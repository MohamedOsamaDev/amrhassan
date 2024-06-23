// @ts-nocheck
import { mainTheme } from "./extensions/themes/mainTheme";
import logo from "./extensions/favicon.png";
import "./extensions/globelStyle.css";
import en from './extensions/translations/en.json'
import ar from './extensions/translations/ar.json'


const config = {
  auth: {
    logo,
  },
  head: {
    favicon: logo,
  },
  menu: {
    logo,
  },
  // Extend the translations
  locales: ['ar', 'en'], // Add Arabic to the locales array
  translations: {
    en,
    ar,
  },
  theme: {    dark: mainTheme, // Use the same theme for dark mode or create a separate one
  },
  // Disable video tutorials
  tutorials: false,
  // Disable notifications about new Strapi releases
  notifications: { releases: false },
  // Disable the Strapi logo in the footer
};
const bootstrap = (app) => {

};
export default {
  config,
  bootstrap,
};
