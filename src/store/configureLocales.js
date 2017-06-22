import { addLocaleData } from 'react-intl'

// import localeDataBg from 'react-intl/locale-data/bg'
// import localeDataCs from 'react-intl/locale-data/cs'
// import localeDataDa from 'react-intl/locale-data/da'
// import localeDataDe from 'react-intl/locale-data/de'
// import localeDataEl from 'react-intl/locale-data/el'
import localeDataEn from 'react-intl/locale-data/en'
// import localeDataEs from 'react-intl/locale-data/es'
import localeDataFr from 'react-intl/locale-data/fr'
// import localeDataHi from 'react-intl/locale-data/hi'
// import localeDataHu from 'react-intl/locale-data/hu'
// import localeDataId from 'react-intl/locale-data/id'
// import localeDataJa from 'react-intl/locale-data/ja'
// import localeDataKo from 'react-intl/locale-data/ko'
// import localeDataNl from 'react-intl/locale-data/nl'
// import localeDataNn from 'react-intl/locale-data/nn'
// import localeDataPl from 'react-intl/locale-data/pl'
// import localeDataPt from 'react-intl/locale-data/pt'
// import localeDataRo from 'react-intl/locale-data/ro'
// import localeDataRu from 'react-intl/locale-data/ru'
// import localeDataSl from 'react-intl/locale-data/sl'
// import localeDataSv from 'react-intl/locale-data/sv'
// import localeDataTh from 'react-intl/locale-data/th'
// import localeDataTr from 'react-intl/locale-data/tr'
// import localeDataUk from 'react-intl/locale-data/uk'
// import localeDataVi from 'react-intl/locale-data/vi'
// import localeDataZh from 'react-intl/locale-data/zh'

// import bg from 'locales/bg-BG.json'
// import cs from 'locales/cs-CZ.json'
// import da from 'locales/da-DK.json'
// import de from 'locales/de-DE.json'
// import el from 'locales/el-GR.json'
import en from 'locales/en-GB.json'
// import es from 'locales/es-ES.json'
import fr from 'locales/fr-FR.json'
// import hi from 'locales/hi-IN.json'
// import hu from 'locales/hu-HU.json'
// import id from 'locales/id-ID.json'
// import it from 'locales/it-IT.json'
// import ja from 'locales/ja-JP.json'
// import ko from 'locales/ko-KR.json'
// import nl from 'locales/nl-NL.json'
// import nn from 'locales/nn-NO.json'
// import pl from 'locales/pl-PL.json'
// import pt from 'locales/pt-PT.json'
// import ro from 'locales/ro-RO.json'
// import ru from 'locales/ru-RU.json'
// import sl from 'locales/sl-SL.json'
// import sv from 'locales/sv-SE.json'
// import th from 'locales/th-TH.json'
// import tr from 'locales/tr-TR.json'
// import uk from 'locales/uk-UA.json'
// import vi from 'locales/vi-VN.json'
// import zh from 'locales/zh-CN.json'

function configureLocales () {
  addLocaleData([...localeDataEn, ...localeDataFr])

  let messages = {
    en: en,
    fr: fr
  }

  return messages
}

export default configureLocales
