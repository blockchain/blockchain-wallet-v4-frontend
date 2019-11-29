import settings from './settings/sagas'
import securityCenter from './securityCenter/sagas'

export default (...args) => ({
  settings: settings(...args),
  securityCenter: securityCenter(...args)
})
