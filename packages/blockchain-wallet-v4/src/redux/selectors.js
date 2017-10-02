import { compose, prop, map } from 'ramda'
import * as addresses from './data/Addresses/selectors.js'
import * as adverts from './data/Adverts/selectors.js'
import * as captcha from './data/Captcha/selectors.js'
import * as fee from './data/Fee/selectors.js'
import * as latestBlock from './data/LatestBlock/selectors.js'
import * as logs from './data/Logs/selectors.js'
import * as btcRates from './data/Rates/bitcoin/selectors.js'
import * as ethRates from './data/Rates/ether/selectors.js'
import * as transactions from './data/Transactions/selectors.js'
import * as info from './data/Info/selectors.js'
import * as payment from './data/Payment/selectors.js'
import * as settings from './settings/selectors.js'
import * as wallet from './wallet/selectors.js'
import { commonSelectorsFactory } from './common/selectors.js'

export const coreSelectorsFactory = ({walletPath, dataPath, settingsPath}) => {
  const common = commonSelectorsFactory({walletPath, dataPath, settingsPath})
  const extend = path => s => compose(s, prop(path))
  return ({
    addresses: map(extend(dataPath), addresses),
    adverts: map(extend(dataPath), adverts),
    captcha: map(extend(dataPath), captcha),
    fee: map(extend(dataPath), fee),
    latestBlock: map(extend(dataPath), latestBlock),
    logs: map(extend(dataPath), logs),
    btcRates: map(extend(dataPath), btcRates),
    ethRates: map(extend(dataPath), ethRates),
    transactions: map(extend(dataPath), transactions),
    info: map(extend(dataPath), info),
    payment: map(extend(dataPath), payment),
    settings: map(extend(settingsPath), settings),
    wallet: map(extend(walletPath), wallet),
    common: common
  })
}
