import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import ui from 'redux-ui'
import { isNil, isEmpty } from 'ramda'
import bip21 from 'bip21'

import { actions, selectors } from 'data'
import QRCodeCapture from './template.js'
import * as C from 'services/AlertService'
import { Exchange, utils } from 'blockchain-wallet-v4/src'

class QRCodeCaptureContainer extends React.PureComponent {
  constructor (props) {
    super(props)
    this.handleToggle = this.handleToggle.bind(this)
    this.handleScan = this.handleScan.bind(this)
    this.handleError = this.handleError.bind(this)
  }

  handleToggle () {
    switch (this.props.scanType) {
      case 'btcAddress':
        return this.props.updateUI({
          btcAddress: { toggled: !this.props.ui.btcAddress.toggled }
        })
      case 'ethAddress':
        return this.props.updateUI({
          ethAddress: { toggled: !this.props.ui.ethAddress.toggled }
        })
      case 'bchAddress':
        return this.props.updateUI({
          bchAddress: { toggled: !this.props.ui.bchAddress.toggled }
        })
      case 'btcPriv':
        return this.props.updateUI({
          btcPriv: { toggled: !this.props.ui.btcPriv.toggled }
        })
      case 'btcPrivOrAddress':
        return this.props.updateUI({
          btcPrivOrAddress: { toggled: !this.props.ui.btcPrivOrAddress.toggled }
        })
    }
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

      this.props.formActions.change('sendBtc', 'to', address)
      this.props.formActions.change('sendBtc', 'description', message)
      this.props.formActions.change('sendBtc', 'amount', {
        coin: amount,
        fiat
      })
      this.props.updateUI({ btcAddress: { toggled: false } })
    } catch (e) {
      try {
        if (utils.bitcoin.isValidBitcoinAddress(data, this.props.network)) {
          this.props.formActions.change('sendBtc', 'to', data)
          this.props.updateUI({ btcAddress: { toggled: false } })
          return
        }

        throw Error('invalid_btc_addr')
      } catch (e) {
        this.props.alertActions.displayError(C.BTC_ADDRESS_INVALID)
        this.props.updateUI({ btcAddress: { toggled: false } })
      }
    }
  }

  handleScanBchAddress (data) {
    // try bitcoincash:qruaxzyr4wcxyuxg2qnteajhgnq2nsmzccuc6d4r5u
    try {
      const { address, options } = bip21.decode(data, 'bitcoincash')
      const { amount, message } = options
      this.props.formActions.change('sendBch', 'to', address)
      this.props.formActions.change('sendBch', 'amount', amount)
      this.props.formActions.change('sendBch', 'description', message)
      this.props.updateUI({ bchAddress: { toggled: false } })
    } catch (e) {
      try {
        // try qruaxzyr4wcxyuxg2qnteajhgnq2nsmzccuc6d4r5u
        if (utils.bch.isCashAddr(data)) {
          this.props.formActions.change('sendBch', 'to', data)
          this.props.updateUI({ bchAddress: { toggled: false } })
          return
        }
        // try legacy addr
        if (utils.bitcoin.isValidBitcoinAddress(data, this.props.network)) {
          this.props.formActions.change('sendBch', 'to', data)
          this.props.updateUI({ bchAddress: { toggled: false } })
          return
        }
        // throw error
        throw Error('invalid_bch_addr')
      } catch (e) {
        this.props.alertActions.displayError(C.BCH_ADDRESS_INVALID)
        this.props.updateUI({ bchAddress: { toggled: false } })
      }
    }
  }

  handleScanEthAddress (data) {
    if (utils.ethereum.isValidAddress(data)) {
      this.props.formActions.change('sendEth', 'to', data)
      this.props.updateUI({ ethAddress: { toggled: false } })
    } else {
      this.props.alertActions.displayError(C.ETH_ADDRESS_INVALID)
      this.props.updateUI({ ethAddress: { toggled: false } })
    }
  }

  handleScanBtcPriv (data) {
    if (utils.bitcoin.isValidBitcoinPrivateKey(data, this.props.network)) {
      this.props.formActions.change(this.props.form || 'sendBtc', 'priv', data)
      this.props.formActions.touch(this.props.form || 'sendBtc', 'priv')
      this.props.updateUI({ btcPriv: { toggled: false } })
    } else {
      this.props.alertActions.displayError(C.PRIVATE_KEY_INVALID)
      this.props.updateUI({ btcPriv: { toggled: false } })
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
        this.props.updateUI({ btcPrivOrAddress: { toggled: false } })
      } else {
        this.props.alertActions.displayError(
          C.BTC_ADDRESS_AND_PRIVATE_KEY_INVALID
        )
        this.props.updateUI({ btcPrivOrAddress: { toggled: false } })
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
        this.props.updateUI({ btcPrivOrAddress: { toggled: false } })
      } else {
        this.props.alertActions.displayError(
          C.BTC_ADDRESS_AND_PRIVATE_KEY_INVALID
        )
        this.props.updateUI({ btcPrivOrAddress: { toggled: false } })
      }
    }
  }

  handleScan (data) {
    if (!isNil(data) && !isEmpty(data)) {
      switch (this.props.scanType) {
        case 'btcAddress':
          this.handleScanBtcAddress(data)
          return
        case 'ethAddress':
          this.handleScanEthAddress(data)
          return
        case 'bchAddress':
          this.handleScanBchAddress(data)
          return
        case 'btcPriv':
          this.handleScanBtcPriv(data)
          return
        case 'btcPrivOrAddress':
          this.handleScanBtcPrivOrAddress(data)
      }
    }
  }

  handleError (error) {
    if (!isNil(error) && !isEmpty(error)) {
      if (error.name === 'NotAllowedError') {
        this.props.alertActions.displayError(C.QR_SCANNER_NOT_ALLOWED)
      } else {
        this.props.alertActions.displayError(error.message)
      }
    }
  }

  render () {
    const { border, ui, scanType } = this.props
    const getTypeToggled = scanType => {
      switch (scanType) {
        case 'btcAddress':
          return ui.btcAddress.toggled
        case 'ethAddress':
          return ui.ethAddress.toggled
        case 'bchAddress':
          return ui.bchAddress.toggled
        case 'btcPriv':
          return ui.btcPriv.toggled
        case 'btcPrivOrAddress':
          return ui.btcPrivOrAddress.toggled
      }
    }
    const toggled = getTypeToggled(scanType)

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

const enhance = compose(
  ui({
    key: 'QRCodeCapture',
    state: {
      btcAddress: { toggled: false },
      ethAddress: { toggled: false },
      bchAddress: { toggled: false },
      btcPriv: { toggled: false },
      btcPrivOrAddress: { toggled: false }
    }
  }),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)

QRCodeCaptureContainer.defaultProps = {
  scanType: PropTypes.oneOf([
    'btcAddress',
    'ethAddress',
    'bchAddress',
    'btcPriv',
    'btcPrivOrAddress'
  ])
}

export default enhance(QRCodeCaptureContainer)
