// this could use a refactor
import React from 'react'
import { connect } from 'react-redux'
import bip21 from 'bip21'
import PropTypes from 'prop-types'
import { includes, isEmpty, isNil, prop, replace, toUpper } from 'ramda'
import { bindActionCreators } from 'redux'

import { Exchange, utils } from 'blockchain-wallet-v4/src'
import { actions, model, selectors } from 'data'
import * as C from 'services/alerts'

import QRCodeCapture from './template'

const { FORM: BTC_FORM } = model.components.sendBtc
const { FORM: BCH_FORM } = model.components.sendBch
const { FORM: ETH_FORM } = model.components.sendEth
const { FORM: XLM_FORM } = model.components.sendXlm

class QRCodeCaptureContainer extends React.PureComponent {
  state = {
    toggled: false
  }

  getScanHandlerKey = () => `handleScan${replace(/^./, toUpper, this.props.scanType)}`

  handleToggle = () => {
    this.setState({ toggled: !this.state.toggled })
  }

  createNewValue = (data) => {
    return {
      value: {
        label: data,
        value: data
      }
    }
  }

  getAddressOrBitPayInvoice(coin, data) {
    const isBitPay = includes(`${coin}:?r=https://bitpay.com/`, data)
    let address
    let options

    if (isBitPay) {
      address = data
    } else {
      try {
        const decoded = bip21.decode(data, coin)
        address = prop('address', decoded)
        options = prop('options', decoded)
      } catch (e) {
        throw Error('invalid_bip21')
      }
    }

    return {
      address,
      isBitPay,
      options
    }
  }

  handleScanBtcAddress(data) {
    let coinInfo
    try {
      coinInfo = this.getAddressOrBitPayInvoice('bitcoin', data)
      const { btcRates, currency } = this.props
      const { amount, message } = coinInfo.options
      const fiat = Exchange.convertCoinToFiat({
        coin: 'BTC',
        currency,
        isStandard: true,
        rates: btcRates,
        value: amount
      })

      this.props.formActions.change(BTC_FORM, 'to', this.createNewValue(coinInfo.address))
      this.props.formActions.change(BTC_FORM, 'description', message)
      this.props.formActions.change(BTC_FORM, 'amount', {
        coin: amount,
        fiat
      })
    } catch (e) {
      try {
        if (utils.btc.isValidBtcAddress(data, this.props.network) || coinInfo.isBitPay) {
          this.props.formActions.change(BTC_FORM, 'to', this.createNewValue(data))
          return
        }

        throw Error('invalid_btc_addr')
      } catch (e) {
        this.props.alertActions.displayError(C.BTC_ADDRESS_INVALID)
      }
    }
  }

  handleScanBchAddress(data) {
    let coinInfo
    try {
      coinInfo = this.getAddressOrBitPayInvoice('bitcoincash', data)
      const { amount, message } = coinInfo.options
      this.props.formActions.change(BCH_FORM, 'to', this.createNewValue(coinInfo.address))
      this.props.formActions.change(BCH_FORM, 'amount', amount)
      this.props.formActions.change(BCH_FORM, 'description', message)
      this.setState({ bchAddressToggled: false })
    } catch (e) {
      try {
        if (utils.bch.isCashAddr(data)) {
          this.props.formActions.change(BCH_FORM, 'to', this.createNewValue(data))
          return
        }
        // try legacy addr
        if (utils.btc.isValidBtcAddress(data, this.props.network) || coinInfo.isBitPay) {
          this.props.formActions.change(BCH_FORM, 'to', this.createNewValue(data))
          return
        }
        // throw error
        throw Error('invalid_bch_addr')
      } catch (e) {
        this.props.alertActions.displayError(C.BCH_ADDRESS_INVALID)
      }
    }
  }

  handleScanEthAddress(inputAddress) {
    const data = utils.eth.sanitazeEth(inputAddress)
    if (utils.eth.isValidAddress(data)) {
      this.props.formActions.change(ETH_FORM, 'to', this.createNewValue(data))
    } else {
      this.props.alertActions.displayError(C.ETH_ADDRESS_INVALID)
    }
  }

  handleScanXlmAddress(data) {
    const { address } = utils.xlm.decodeXlmURI(data)
    if (utils.xlm.isValidAddress(address)) {
      this.props.formActions.change(XLM_FORM, 'to', this.createNewValue(address))
    } else {
      this.props.alertActions.displayError(C.XLM_ADDRESS_INVALID)
    }
  }

  handleScanBtcPriv(data) {
    if (utils.btc.isValidBtcPrivateKey(data, this.props.network)) {
      this.props.formActions.change(this.props.form || BTC_FORM, 'priv', data)
      this.props.formActions.touch(this.props.form || BTC_FORM, 'priv')
    } else {
      this.props.alertActions.displayError(C.PRIVATE_KEY_INVALID)
    }
  }

  handleScanBtcPrivOrAddress(data) {
    try {
      const { address } = bip21.decode(data)
      if (utils.btc.isValidBtcAddress(address, this.props.network)) {
        this.props.formActions.change(this.props.form || 'importBtcAddress', 'addrOrPriv', address)
        this.props.formActions.touch(this.props.form || 'importBtcAddress', 'addrOrPriv')
      } else {
        this.props.alertActions.displayError(C.BTC_ADDRESS_AND_PRIVATE_KEY_INVALID)
      }
    } catch (e) {
      if (
        utils.btc.isValidBtcPrivateKey(data, this.props.network) ||
        utils.btc.isValidBtcAddress(data, this.props.network)
      ) {
        this.props.formActions.change(this.props.form || 'importBtcAddress', 'addrOrPriv', data)
        this.props.formActions.touch(this.props.form || 'importBtcAddress', 'addrOrPriv')
      } else {
        this.props.alertActions.displayError(C.BTC_ADDRESS_AND_PRIVATE_KEY_INVALID)
      }
    }
  }

  handleScan = (data) => {
    if (!isNil(data) && !isEmpty(data)) {
      try {
        const handlerName = this.getScanHandlerKey()
        this[handlerName](data)
      } catch (e) {
        this.props.onScan(data)
      }
      this.setState({ toggled: false })
    }
  }

  handleError = (error) => {
    if (!isNil(error) && !isEmpty(error)) {
      if (error.name === 'NotAllowedError') {
        this.props.alertActions.displayError(C.QR_SCANNER_NOT_ALLOWED)
      } else {
        this.props.alertActions.displayError(error.message)
      }
    }
  }

  render() {
    const { border } = this.props
    const { toggled } = this.state

    return (
      <QRCodeCapture
        border={border}
        toggled={toggled}
        handleToggle={this.handleToggle}
        handleScan={this.handleScan}
        handleError={this.handleError}
      />
    )
  }
}

const mapStateToProps = (state) => ({
  btcRates: selectors.core.data.btc.getRates(state).getOrFail('Could not find btc rates'),
  currency: selectors.core.settings.getCurrency(state).getOrElse('USD')
})

const mapDispatchToProps = (dispatch) => ({
  alertActions: bindActionCreators(actions.alerts, dispatch),
  formActions: bindActionCreators(actions.form, dispatch),
  modalActions: bindActionCreators(actions.modals, dispatch)
})

QRCodeCaptureContainer.defaultProps = {
  scanType: PropTypes.oneOf([
    'btcAddress',
    'ethAddress',
    'bchAddress',
    'xlmAddress',
    'btcPriv',
    'btcPrivOrAddress'
  ])
}

export default connect(mapStateToProps, mapDispatchToProps)(QRCodeCaptureContainer)
