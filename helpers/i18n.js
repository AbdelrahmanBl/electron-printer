import i18next from 'i18next';
import Backend from 'i18next-fs-backend';

export async function init() {
    await i18next.use(Backend).init({
        lng: global.config?.lang ?? 'ar', // default language
        fallbackLng: 'en',
        backend: {
            loadPath: global.paths.i18n,
        },
    });

    return i18next;
}