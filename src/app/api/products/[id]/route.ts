import { withExceptionFilter } from '@/lib/utils/withExceptionFilter';
import { apiRoot } from '@/lib/ctClient';
import { NextRequest, NextResponse } from 'next/server';
import { getLocaleFromRequest } from '@/lib/utils/getLocaleFromRequest';

async function handler(
    req: NextRequest,
    context?: { params: { id: string } }
): Promise<NextResponse> {
    const params = await context?.params;
    const id = await params?.id;
    if (!id) throw new Error('Missing product ID');
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

export const GET = withExceptionFilter(handler);
