import { NextRequest, NextResponse } from 'next/server';
import { ApiError } from 'next/dist/server/api-utils';

function getExceptionStatus(exception: unknown) {
    return exception instanceof ApiError ? exception.statusCode : 500;
}

function getExceptionMessage(exception: unknown) {
    return isError(exception) ? exception.message : 'Internal Server Error';
}

function getExceptionStack(exception: unknown) {
    return isError(exception) ? exception.stack : undefined;
}

function isError(exception: unknown): exception is Error {
    return exception instanceof Error;
}
export function withExceptionFilter<T = unknown, P extends Record<string, string> = Record<string, string>>(
    handler: (
        req: NextRequest,
        context?: { params: P }
    ) => Promise<NextResponse<T>>
) {
    return async function (
        req: NextRequest,
        context?: { params: P }
    ): Promise<NextResponse<T>> {
        try {
            return await handler(req, context);
        } catch (exception) {
            const statusCode = getExceptionStatus(exception);
            const message = getExceptionMessage(exception);
            const stack = getExceptionStack(exception);

            const userAgent = req.headers.get('user-agent');
            const referer = req.headers.get('referer');
            const userId = 'Mocked-UserId';

            const logContext = {
                url: req.nextUrl.pathname,
                userId,
                referer,
                userAgent,
                message,
            };

            console.error(logContext, 'An unhandled exception occurred.');
            if (stack) console.debug(stack);

            return NextResponse.json(
                {
                    statusCode,
                    timestamp: new Date().toISOString(),
                    path: req.nextUrl.pathname,
                },
                { status: statusCode }
            ) as NextResponse<T>;
        }
    };
}
