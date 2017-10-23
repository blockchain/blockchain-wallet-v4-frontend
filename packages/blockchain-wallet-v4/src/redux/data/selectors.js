import { useWith, prop, map } from 'ramda'
import * as addresses from './addresses/selectors'
import * as adverts from './adverts/selectors'
import * as captcha from './captcha/selectors'
import * as charts from './charts/selectors'
import * as fee from './fee/selectors'
import * as info from './info/selectors'
import * as latestBlock from './latestBlock/selectors'
import * as logs from './logs/selectors'
import * as payment from './payment/selectors'
import * as rates from './rates/selectors'
import * as reports from './reports/selectors'
import * as transactionFiats from './transactionFiats/selectors'
import * as transactions from './transactions/selectors'

export const dataSelectorsFactory = ({ walletPath, dataPath, kvStorePath, settingsPath, walletOptionsPath }) => {
  const extend = path => s => useWith(s, [prop(path)])
  return ({
    addresses: map(extend(dataPath), addresses),
    adverts: map(extend(dataPath), adverts),
    captcha: map(extend(dataPath), captcha),
    charts: map(extend(dataPath), charts),
    fee: map(extend(dataPath), fee),
    info: map(extend(dataPath), info),
    latestBlock: map(extend(dataPath), latestBlock),
    logs: map(extend(dataPath), logs),
    payment: map(extend(dataPath), payment),
    rates: map(extend(dataPath), rates),
    reports: map(extend(dataPath), reports),
    transactionFiats: map(extend(dataPath), transactionFiats),
    transactions: map(extend(dataPath), transactions)
  })
}
