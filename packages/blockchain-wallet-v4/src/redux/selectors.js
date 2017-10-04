import { compose, prop, map } from 'ramda'
import * as addresses from './data/addresses/selectors.js'
import * as adverts from './data/adverts/selectors.js'
import * as captcha from './data/captcha/selectors.js'
import * as charts from './data/charts/selectors.js'
import * as fee from './data/fee/selectors.js'
import * as latestBlock from './data/latestBlock/selectors.js'
import * as logs from './data/logs/selectors.js'
import * as rates from './data/rates/selectors.js'
import * as transactions from './data/transactions/selectors.js'
import * as info from './data/info/selectors.js'
import * as payment from './data/payment/selectors.js'
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
    charts: map(extend(dataPath), charts),
    fee: map(extend(dataPath), fee),
    latestBlock: map(extend(dataPath), latestBlock),
    logs: map(extend(dataPath), logs),
    rates: map(extend(dataPath), rates),
    transactions: map(extend(dataPath), transactions),
    info: map(extend(dataPath), info),
    payment: map(extend(dataPath), payment),
    settings: map(extend(settingsPath), settings),
    wallet: map(extend(walletPath), wallet),
    common: common
  })
}
