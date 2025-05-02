export function getLocaleFromRequest(req: Request): string {
    const acceptLanguage = req.headers.get('Accept-Language');
    const supportedLocales = ['en-US', 'en-GB', 'de-DE'];
    const defaultLocale = 'en-US';

    if (!acceptLanguage) {
        return defaultLocale;
    }
    const locale = acceptLanguage.split(',')[0]?.trim().toLowerCase();

    const localeToUse = supportedLocales.find(
        (supportedLocale) =>
            supportedLocale.toLowerCase() === locale || 
            supportedLocale.split('-')[0].toLowerCase() === locale
    ) || defaultLocale;

    return localeToUse;
}
