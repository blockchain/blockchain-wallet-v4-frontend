import addressesBch from './addressesBch/sagas'
import coinify from './coinify/sagas'
import limits from './limits/sagas'
import profile from './profile/sagas'
import rates from './rates/sagas'
import settings from './settings/sagas'
import securityCenter from './securityCenter/sagas'
import transferEth from './transferEth/sagas'
import sfox from './sfox/sagas'

export default ({ coreSagas, api }) => ({
  addressesBch: addressesBch({ coreSagas }),
  coinify: coinify({ coreSagas }),
  limits: limits({ api }),
  profile: profile({ api, coreSagas }),
  rates: rates({ api }),
  settings: settings({ api, coreSagas }),
  securityCenter: securityCenter({ coreSagas }),
  transferEth: transferEth({ coreSagas }),
  sfox: sfox({ coreSagas })
})
