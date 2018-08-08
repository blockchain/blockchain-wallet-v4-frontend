import addressesBch from './addressesBch/sagas'
import coinify from './coinify/sagas'
import profile from './profile/sagas'
import rates from './rates/sagas'
import settings from './settings/sagas'
import securityCenter from './securityCenter/sagas'
import transferEth from './transferEth/sagas'
import sfox from './sfox/sagas'

export default ({ coreSagas, api }) => ({
  addressesBch: addressesBch({ coreSagas }),
  coinify: coinify({ coreSagas }),
  profile: profile({ api }),
  rates: rates({ api }),
  settings: settings({ coreSagas }),
  securityCenter: securityCenter({ coreSagas }),
  transferEth: transferEth({ coreSagas }),
  sfox: sfox({ coreSagas })
})
