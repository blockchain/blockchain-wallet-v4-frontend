import { all, fork } from 'redux-saga/effects'

import exchange from './exchange/sagas'
import importBtcAddress from './importBtcAddress/sagas'
import priceChart from './priceChart/sagas'
import priceTicker from './priceTicker/sagas'
import sendBch from './sendBch/sagas'
import sendBtc from './sendBtc/sagas'
import sendEth from './sendEth/sagas'
import signMessage from './signMessage/sagas'
import usedAddresses from './usedAddresses/sagas'

export default ({ api, coreSagas }) => {
  exchange: exchange({ coreSagas }),
  importBtcAddress: importBtcAddress({ coreSagas }),
  priceChart: priceChart({ coreSagas }),
  priceTicker: priceTicker({ coreSagas }),
  sendBch: sendBch({ coreSagas }),
  sendBtc: sendBtc({ coreSagas }),
  sendEth: sendEth({ coreSagas }),
  signMessage: signMessage({ coreSagas }),
  usedAddresses: usedAddresses({ coreSagas })
}
