import { withExceptionFilter } from '@/lib/utils/withExceptionFilter';
import { apiRoot } from '@/lib/ctClient';
import { NextRequest, NextResponse } from 'next/server';
import { getLocaleFromRequest } from '@/lib/utils/getLocaleFromRequest';

async function handler(req: NextRequest): Promise<NextResponse> {
    const { searchParams } = new URL(req.url);

    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);
    const locale = getLocaleFromRequest(req);

    const result = await apiRoot
        .productProjections()
        .get({
            queryArgs: {
                limit,
                offset,
                localeProjection: locale,
            },
        })
        .execute();

    const products = result.body.results.map((product) => ({
        id: product.id,
        key: product.key,
        name: product.name,
        slug: product.slug,
        description: product.description,
        image: product.masterVariant.images?.[0]?.url || null,
        price: product.masterVariant.prices?.[0]?.value,
    }));

    return NextResponse.json({
        total: result.body.total,
        count: result.body.count,
        offset: result.body.offset,
        limit,
        products,
    });
}

export const GET = withExceptionFilter(handler);
