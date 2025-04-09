import addressesBch from './addressesBch/sagas'
import profile from './profile/sagas.ts'
import securityCenter from './securityCenter/sagas'
import settings from './settings/sagas'
import transferEth from './transferEth/sagas'

export default ({ api, coreSagas, networks }) => ({
  addressesBch: addressesBch({ coreSagas }),
  profile: profile({ api, coreSagas, networks }),
  securityCenter: securityCenter({ coreSagas }),
  settings: settings({ api, coreSagas }),
  transferEth: transferEth({ coreSagas, networks })
})
