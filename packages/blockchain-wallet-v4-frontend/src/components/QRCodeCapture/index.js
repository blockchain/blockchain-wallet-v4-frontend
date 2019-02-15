import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { isNil, isEmpty, replace, toUpper } from 'ramda'
import bip21 from 'bip21'

import { actions, model, selectors } from 'data'
import QRCodeCapture from './template.js'
import * as C from 'services/AlertService'
import { Exchange, utils } from 'blockchain-wallet-v4/src'

const { FORM: BTC_FORM } = model.components.sendBtc
const { FORM: BSV_FORM } = model.components.sendBsv
const { FORM: BCH_FORM } = model.components.sendBch
const { FORM: ETH_FORM } = model.components.sendEth
const { FORM: XLM_FORM } = model.components.sendXlm

class QRCodeCaptureContainer extends React.PureComponent {
  state = {
    toggled: false
  }

  getScanHandlerKey = () =>
    `handleScan${replace(/^./, toUpper, this.props.scanType)}`

  handleToggle = () => {
    this.setState({ toggled: !this.state.toggled })
  }

  handleScanBtcAddress (data) {
    try {
      const { address, options } = bip21.decode(data)
      const { currency, btcRates } = this.props
      const { amount, message } = options
      const fiat = Exchange.convertBitcoinToFiat({
        value: amount,
        fromUnit: 'BTC',
        toCurrency: currency,
        rates: btcRates
      }).value

      this.props.formActions.change(BTC_FORM, 'to', address)
      this.props.formActions.change(BTC_FORM, 'description', message)
      this.props.formActions.change(BTC_FORM, 'amount', {
        coin: amount,
        fiat
      })
    } catch (e) {
      try {
        if (utils.bitcoin.isValidBitcoinAddress(data, this.props.network)) {
          this.props.formActions.change(BTC_FORM, 'to', data)
          return
        }

        throw Error('invalid_btc_addr')
      } catch (e) {
        this.props.alertActions.displayError(C.BTC_ADDRESS_INVALID)
      }
    }
  }

  handleScanBchAddress (data) {
    try {
      const { address, options } = bip21.decode(data, 'bitcoincash')
      const { amount, message } = options
      this.props.formActions.change(BCH_FORM, 'to', address)
      this.props.formActions.change(BCH_FORM, 'amount', amount)
      this.props.formActions.change(BCH_FORM, 'description', message)
      this.setState({ bchAddressToggled: false })
    } catch (e) {
      try {
        if (utils.bch.isCashAddr(data)) {
          this.props.formActions.change(BCH_FORM, 'to', data)
          return
        }
        // try legacy addr
        if (utils.bitcoin.isValidBitcoinAddress(data, this.props.network)) {
          this.props.formActions.change(BCH_FORM, 'to', data)
          return
        }
        // throw error
        throw Error('invalid_bch_addr')
      } catch (e) {
        this.props.alertActions.displayError(C.BCH_ADDRESS_INVALID)
      }
    }
  }

  handleScanBsvAddress (data) {
    try {
      const { address, options } = bip21.decode(data, 'bitcoincash')
      const { amount, message } = options
      this.props.formActions.change(BSV_FORM, 'to', address)
      this.props.formActions.change(BSV_FORM, 'amount', amount)
      this.props.formActions.change(BSV_FORM, 'description', message)
      this.setState({ bchAddressToggled: false })
    } catch (e) {
      try {
        if (utils.bch.isCashAddr(data)) {
          this.props.formActions.change(BSV_FORM, 'to', data)
          return
        }
        // try legacy addr
        if (utils.bitcoin.isValidBitcoinAddress(data, this.props.network)) {
          this.props.formActions.change(BSV_FORM, 'to', data)
          return
        }
        // throw error
        throw Error('invalid_bch_addr')
      } catch (e) {
        this.props.alertActions.displayError(C.BCH_ADDRESS_INVALID)
      }
    }
  }

  handleScanEthAddress (data) {
    if (utils.ethereum.isValidAddress(data)) {
      this.props.formActions.change(ETH_FORM, 'to', data)
    } else {
      this.props.alertActions.displayError(C.ETH_ADDRESS_INVALID)
    }
  }

  handleScanXlmAddress (data) {
    const { address } = utils.xlm.decodeXlmURI(data)
    if (utils.xlm.isValidAddress(address)) {
      this.props.formActions.change(XLM_FORM, 'to', address)
    } else {
      this.props.alertActions.displayError(C.XLM_ADDRESS_INVALID)
    }
  }

  handleScanBtcPriv (data) {
    if (utils.bitcoin.isValidBitcoinPrivateKey(data, this.props.network)) {
      this.props.formActions.change(this.props.form || BTC_FORM, 'priv', data)
      this.props.formActions.touch(this.props.form || BTC_FORM, 'priv')
    } else {
      this.props.alertActions.displayError(C.PRIVATE_KEY_INVALID)
    }
  }

  handleScanBtcPrivOrAddress (data) {
    try {
      const { address } = bip21.decode(data)
      if (utils.bitcoin.isValidBitcoinAddress(address, this.props.network)) {
        this.props.formActions.change(
          this.props.form || 'importBtcAddress',
          'addrOrPriv',
          address
        )
        this.props.formActions.touch(
          this.props.form || 'importBtcAddress',
          'addrOrPriv'
        )
      } else {
        this.props.alertActions.displayError(
          C.BTC_ADDRESS_AND_PRIVATE_KEY_INVALID
        )
      }
    } catch (e) {
      if (
        utils.bitcoin.isValidBitcoinPrivateKey(data, this.props.network) ||
        utils.bitcoin.isValidBitcoinAddress(data, this.props.network)
      ) {
        this.props.formActions.change(
          this.props.form || 'importBtcAddress',
          'addrOrPriv',
          data
        )
        this.props.formActions.touch(
          this.props.form || 'importBtcAddress',
          'addrOrPriv'
        )
      } else {
        this.props.alertActions.displayError(
          C.BTC_ADDRESS_AND_PRIVATE_KEY_INVALID
        )
      }
    }
  }

  handleScan = data => {
    if (!isNil(data) && !isEmpty(data)) {
      const handlerName = this.getScanHandlerKey()
      this[handlerName](data)
      this.setState({ toggled: false })
    }
  }

  handleError = error => {
    if (!isNil(error) && !isEmpty(error)) {
      if (error.name === 'NotAllowedError') {
        this.props.alertActions.displayError(C.QR_SCANNER_NOT_ALLOWED)
      } else {
        this.props.alertActions.displayError(error.message)
      }
    }
  }

  render () {
    const { border } = this.props
    const toggled = this.state.toggled

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

const mapStateToProps = state => ({
  currency: selectors.core.settings.getCurrency(state).getOrElse('USD'),
  btcRates: selectors.core.data.bitcoin
    .getRates(state)
    .getOrFail('Could not find btc rates')
})

const mapDispatchToProps = dispatch => ({
  alertActions: bindActionCreators(actions.alerts, dispatch),
  modalActions: bindActionCreators(actions.modals, dispatch),
  formActions: bindActionCreators(actions.form, dispatch)
})

QRCodeCaptureContainer.defaultProps = {
  scanType: PropTypes.oneOf([
    'btcAddress',
    'ethAddress',
    'bchAddress',
    'bsvAddress',
    'xlmAddress',
    'btcPriv',
    'btcPrivOrAddress'
  ])
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(QRCodeCaptureContainer)
