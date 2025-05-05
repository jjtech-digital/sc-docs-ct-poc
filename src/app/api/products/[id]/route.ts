import { apiRoot } from '@/lib/ctClient';
import { NextRequest, NextResponse } from 'next/server';
import { getLocaleFromRequest } from '@/lib/utils/getLocaleFromRequest';
import { ApiError } from 'next/dist/server/api-utils';

async function handler(
    req: NextRequest,
    context?: { params: { id: string } }
): Promise<NextResponse> {
    const params = await context?.params;
    const id = await params?.id;
    if (!id) throw new ApiError(400, 'Product ID is required.');
    const locale = getLocaleFromRequest(req);

    const getProduct = await apiRoot
        .productProjections()
        .withId({ ID: id })
        .get({
            queryArgs: {
                localeProjection: locale,
            },
        })
        .execute();

    const product = getProduct.body;
    return NextResponse.json(product);
}

export const GET = handler as (req: NextRequest) => Promise<NextResponse>;
