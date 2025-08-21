export interface User {
    refresh_token: string;
    expires_at: string;
    anonymousId?: string;
    customerId?: string;
    access_token?: string;
}