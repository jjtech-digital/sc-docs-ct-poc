import {  NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { ApiError } from 'next/dist/server/api-utils';
import { getOrRefreshCookie } from '@/lib/utils/getOrRefreshCookie';
import { getOrCreateCart } from '@/lib/utils/getOrCreateCart';
import { withExceptionFilter } from '@/lib/utils/withExceptionFilter';

async function handler(): Promise<NextResponse> {
    const cartId = await getOrRefreshCookie('cartId')
    const anonymousId = await getOrRefreshCookie('anonymousId', uuidv4())

    const cart = await getOrCreateCart(anonymousId, cartId);

    if(!cart){
        throw new ApiError(400, 'Cart not found.');
    }

    const cartSummary = {
        id: cart.id,
        totalPrice: cart.totalPrice,
        lineItems: cart.lineItems.map(item => ({
            id: item.id,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            totalPrice: item.totalPrice,
            image: item.variant?.images?.[0]?.url,
        })),
        currency: cart.totalPrice.currencyCode,
        anonymousId,
    };

    return NextResponse.json({
        cart: cartSummary,
    });
}

export const GET = withExceptionFilter(handler);