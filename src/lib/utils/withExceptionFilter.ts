import { NextRequest, NextResponse } from 'next/server';
import { ApiError } from 'next/dist/server/api-utils';

export function getExceptionStatus(exception: unknown) {
    return exception instanceof ApiError ? exception.statusCode : 500;
}

export function getExceptionMessage(exception: unknown) {
    return isError(exception) ? exception.message : 'Internal Server Error';
}

export function getExceptionStack(exception: unknown) {
    return isError(exception) ? exception.stack : undefined;
}

export function isError(exception: unknown): exception is Error {
    return exception instanceof Error;
}

export function withExceptionFilter(
    handler: (
        req: NextRequest
    ) => Promise<NextResponse>
): (req: NextRequest) => Promise<NextResponse> {
    return async (
        req: NextRequest): Promise<NextResponse> => {
        try {
            return await handler(req);
        } catch (exception) {
            const statusCode = getExceptionStatus(exception);
            const message = getExceptionMessage(exception);

            const userAgent = req.headers.get('user-agent');
            const referer = req.headers.get('referer');

            const logContext = {
                url: req.nextUrl.pathname,
                referer,
                userAgent,
                message,
            };

            console.error(logContext, 'Exception occurred.');

            return NextResponse.json(
                {
                    statusCode,
                    message: "Something went wrong while processing your request.",
                    timestamp: new Date().toISOString(),
                    path: req.nextUrl.pathname,
                },
                { status: statusCode }
            ) as NextResponse;
        }
    };
}
