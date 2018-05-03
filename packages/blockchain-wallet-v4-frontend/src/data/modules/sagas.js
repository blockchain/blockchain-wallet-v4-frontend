import addressesBch from './addressesBch/sagas'
import coinify from './coinify/sagas'
import settings from './settings/sagas'
import securityCenter from './securityCenter/sagas'
import transferEther from './transferEther/sagas'
import sfox from './sfox/sagas'

export default ({ coreSagas }) => ({
  addressesBch: addressesBch({ coreSagas }),
  coinify: coinify({ coreSagas }),
  settings: settings({ coreSagas }),
  securityCenter: securityCenter({ coreSagas }),
  transferEther: transferEther({ coreSagas }),
  sfox: sfox({ coreSagas })
})
