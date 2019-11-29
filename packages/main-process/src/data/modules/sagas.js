import addressesBch from './addressesBch/sagas'
import profile from './profile/sagas'
import rates from './rates/sagas'
import settings from './settings/sagas'
import securityCenter from './securityCenter/sagas'
import transferEth from './transferEth/sagas'
import sfox from './sfox/sagas'

export default (...args) => ({
  addressesBch: addressesBch(...args),
  profile: profile(...args),
  rates: rates(...args),
  settings: settings(...args),
  securityCenter: securityCenter(...args),
  transferEth: transferEth(...args),
  sfox: sfox(...args)
})
