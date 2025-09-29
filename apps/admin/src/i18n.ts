import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import ruCommon from "./lang/ru/common.json";

const resources = {
  ru: {
    translation: ruCommon,
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "ru",
  fallbackLng: "ru",
  debug: false,
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
