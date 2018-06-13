import { addLocaleData } from 'react-intl'
import { map, flatten } from 'ramda'
import * as languageService from 'services/LanguageService'

import localesBG from 'assets/locales/bg.json'
import localesDA from 'assets/locales/da.json'
import localesDE from 'assets/locales/de.json'
import localesEL from 'assets/locales/el.json'
import localesEN from 'assets/locales/en.json'
import localesFR from 'assets/locales/fr.json'
import localesHI from 'assets/locales/hi.json'
import localesHU from 'assets/locales/hu.json'
import localesID from 'assets/locales/id.json'
import localesIT from 'assets/locales/it.json'
import localesJA from 'assets/locales/ja.json'
import localesKO from 'assets/locales/ko.json'
import localesNL from 'assets/locales/nl.json'
import localesNN from 'assets/locales/nn.json'
import localesPL from 'assets/locales/pl.json'
import localesPT from 'assets/locales/pt.json'
import localesZH from 'assets/locales/zh.json'
import localesES from 'assets/locales/es.json'
import localesRU from 'assets/locales/ru.json'

const importLocaleData = (language) => require(`react-intl/locale-data/${language}`)

function configureLocales (store) {
  // We add the locale data for each language
  addLocaleData(flatten(map(x => importLocaleData(x.language), languageService.languages)))

  // We get all the messages
  const messages = {
    bg: localesBG,
    da: localesDA,
    de: localesDE,
    el: localesEL,
    en: localesEN,
    fr: localesFR,
    hi: localesHI,
    hu: localesHU,
    id: localesID,
    it: localesIT,
    ja: localesJA,
    ko: localesKO,
    nl: localesNL,
    nn: localesNN,
    pl: localesPL,
    pt: localesPT,
    zh: localesZH,
    es: localesES,
    ru: localesRU
  }

  return { messages }
}

export default configureLocales
