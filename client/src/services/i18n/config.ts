 export const cookieName = "i18next";
export const fallbackLng = 'en';
export const languages = [fallbackLng, 'ar'];
export const defaultNamespace = "common";
export const defaultNS = 'translation';

export function getOptions(language: string = fallbackLng, namespace = defaultNamespace) {
  return {
    debug: process.env.NODE_ENV === 'development',
    supportedLngs: languages,
    fallbackLng: fallbackLng,
    lng: language,
    fallbackNS: defaultNamespace,
    defaultNS: defaultNamespace,
    ns: namespace,
    preload: languages, // was off
  };
}






 
