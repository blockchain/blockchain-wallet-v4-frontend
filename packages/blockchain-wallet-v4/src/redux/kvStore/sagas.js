import bch from './bch/sagas'
import btc from './btc/sagas'
import eth from './eth/sagas'
import root from './root/sagas'
import lockbox from './lockbox/sagas'
import buySell from './buySell/sagas'
import whatsNew from './whatsNew/sagas'
import contacts from './contacts/sagas'
import userCredentials from './userCredentials/sagas'
import shapeShift from './shapeShift/sagas'
import xlm from './xlm/sagas'

export default (...args) => ({
  bch: bch(...args),
  btc: btc(...args),
  eth: eth(...args),
  root: root(...args),
  lockbox: lockbox(...args),
  buySell: buySell(...args),
  whatsNew: whatsNew(...args),
  contacts: contacts(...args),
  shapeShift: shapeShift(...args),
  userCredentials: userCredentials(...args),
  xlm: xlm(...args)
})
