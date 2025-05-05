import { apiRoot } from '@/lib/ctClient';
import { getExceptionMessage } from './withExceptionFilter';
import { Cart } from '@commercetools/platform-sdk';

export async function getOrCreateCart(anonymousId?: string, cartId?: string): Promise<Cart | null> {
    let cart = null;

    if (cartId) {
        try {
            const cartResponse = await apiRoot.carts().withId({ ID: cartId }).get().execute();
            cart = cartResponse.body;
        } catch (error:unknown) {
            console.log(cartId, getExceptionMessage(error));
        }
    }

    if (!cart && anonymousId) {
        const queryResponse = await apiRoot
            .carts()
            .get({
                queryArgs: {
                    where: `anonymousId="${anonymousId}"`,
                    sort: 'lastModifiedAt desc',
                    limit: 1,
                },
            })
            .execute();

        cart = queryResponse.body.results[0];
    }

    if (!cart && anonymousId) {
        const createResponse = await apiRoot.carts().post({
            body: {
                currency: 'USD',
                country: 'US',
                anonymousId,
            },
        }).execute();

        cart = createResponse.body;
    }

    return cart;
}
