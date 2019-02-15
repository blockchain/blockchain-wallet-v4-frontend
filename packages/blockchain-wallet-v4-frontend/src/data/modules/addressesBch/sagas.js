import { select, call, put } from 'redux-saga/effects'
import * as actions from '../../actions.js'
import * as selectors from '../../selectors.js'
import * as C from 'services/AlertService'
import { promptForInput } from 'services/SagaService'
import { utils } from 'blockchain-wallet-v4/src'
const { toCashAddr } = utils.bch
const GAP_LIMIT = 20

export default ({ coreSagas, networks }) => {
  const logLocation = 'modules/addressesBch/sagas'

  const editBchAccountLabel = function*(action) {
    try {
      const { index, label } = action.payload
      const newLabel = yield call(promptForInput, {
        title: 'Rename Bitcoin Cash Wallet',
        initial: label,
        maxLength: 30
      })
      yield put(actions.core.kvStore.bch.setAccountLabel(index, newLabel))
      yield put(actions.alerts.displaySuccess(C.RENAME_BCH_WALLET_SUCCESS))
    } catch (e) {
      if (e.message === 'PROMPT_INPUT_CANCEL') return
      yield put(
        actions.logs.logErrorMessage(logLocation, 'editBchAccountLabel', e)
      )
      yield put(actions.alerts.displayError(C.RENAME_BCH_WALLET_ERROR))
    }
  }

  const selectChangeAddresses = (accountIndex, start, end, state) => {
    let addrs = []
    for (var i = start + GAP_LIMIT; i < end; i += GAP_LIMIT) {
      // get address at GAP_LIMIT points
      const addr = selectors.core.common.bch.getAddress(
        networks.btc,
        `${accountIndex}/${1}/${i}`,
        state
      )
      addrs.push(addr)
    }
    return addrs
  }

  // if change was sent to users btc change index instead of bch
  const showBchChangeAddrs = function*(action) {
    const { index, xpub } = action.payload
    const state = yield select()
    const btcChangeIndex = selectors.core.data.bitcoin
      .getChangeIndex(xpub, state)
      .getOrElse(0)
    const bchChangeIndex = selectors.core.data.bch
      .getChangeIndex(xpub, state)
      .getOrElse(0)

    // check if bch change index got behind btc by gap limit
    const addrs = selectChangeAddresses(
      index,
      bchChangeIndex,
      btcChangeIndex,
      state
    )

    // if there are addrs to display show them else carry on
    /* eslint-disable */
    if (addrs.length) {
      window.alert(
        addrs.map((addr, i) => `${toCashAddr(addr, true)}`).join(', ')
      )
    } else {
      window.alert('Nothing to see here!')
    }
    /* eslint-enable */
  }

  return {
    showBchChangeAddrs,
    editBchAccountLabel,
    selectChangeAddresses
  }
}
