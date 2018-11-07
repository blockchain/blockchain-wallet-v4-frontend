import { addLocaleData } from 'react-intl'
import { map, flatten } from 'ramda'
import * as languageService from 'services/LanguageService'

import localesCS from 'assets/locales/cs.json'
import localesDE from 'assets/locales/de.json'
import localesEN from 'assets/locales/en.json'
import localesES from 'assets/locales/es.json'
import localesFR from 'assets/locales/fr.json'
import localesID from 'assets/locales/id.json'
import localesIT from 'assets/locales/it.json'
import localesJA from 'assets/locales/ja.json'
import localesKO from 'assets/locales/ko.json'
import localesMS from 'assets/locales/ms.json'
import localesNL from 'assets/locales/nl.json'
import localesPL from 'assets/locales/pl.json'
import localesPT from 'assets/locales/pt.json'
import localesRO from 'assets/locales/ro.json'
import localesRU from 'assets/locales/ru.json'
import localesSV from 'assets/locales/sv.json'
import localesTH from 'assets/locales/th.json'
import localesTR from 'assets/locales/tr.json'
import localesVI from 'assets/locales/vi.json'
import localesUK from 'assets/locales/uk.json'
import localesZH from 'assets/locales/zh.json'

const importLocaleData = language =>
  require(`react-intl/locale-data/${language}`)

function configureLocales (store) {
  // We add the locale data for each language
  addLocaleData(
    flatten(map(x => importLocaleData(x.language), languageService.languages))
  )

  // We get all the messages
  const messages = {
    cs: localesCS,
    de: localesDE,
    en: localesEN,
    es: localesES,
    fr: localesFR,
    id: localesID,
    it: localesIT,
    ja: localesJA,
    ko: localesKO,
    ms: localesMS,
    nl: localesNL,
    pl: localesPL,
    pt: localesPT,
    ro: localesRO,
    ru: localesRU,
    sv: localesSV,
    th: localesTH,
    tr: localesTR,
    vi: localesVI,
    uk: localesUK,
    zh: localesZH
  }

  return { messages }
}

export default configureLocales
