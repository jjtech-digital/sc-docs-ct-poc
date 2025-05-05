import { NextRequest, NextResponse } from 'next/server';
import { apiRoot } from '@/lib/ctClient';
import { ApiError } from 'next/dist/server/api-utils';
import { getOrRefreshCookie } from '@/lib/utils/getOrRefreshCookie';
import { getOrCreateCart } from '@/lib/utils/getOrCreateCart';
import { v4 as uuidv4 } from 'uuid';
import { withExceptionFilter } from '@/lib/utils/withExceptionFilter';

async function handler(req: NextRequest): Promise<NextResponse> {
    const { lineItemId } = await req.json();
    let cartId = await getOrRefreshCookie('cartId');
    const anonymousId = await getOrRefreshCookie('anonymousId', uuidv4())

    const cart = await getOrCreateCart(anonymousId, cartId);
    if (!cart) {
        throw new ApiError(400, 'Unable to create or retrieve cart.');
    }
    cartId = cart.id;
    await getOrRefreshCookie('cartId', cart.id);

    const updatedCart = await apiRoot
        .carts()
        .withId({ ID: cartId })
        .post({
            body: {
                version: cart.version,
                actions: [
                    {
                        action: 'removeLineItem',
                        lineItemId,
                    },
                ],
            },
        })
        .execute();

    return NextResponse.json({ cart: updatedCart.body });
}

export const POST = withExceptionFilter(handler);
