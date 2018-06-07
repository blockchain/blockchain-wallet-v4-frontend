import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import ui from 'redux-ui'
import { isNil, isEmpty } from 'ramda'
import bip21 from 'bip21'

import { actions } from 'data'
import QRCodeCapture from './template.js'
import * as C from 'services/AlertService'
import {utils} from '../../../../blockchain-wallet-v4/src'

class QRCodeCaptureContainer extends React.PureComponent {
  constructor (props) {
    super(props)
    this.handleToggle = this.handleToggle.bind(this)
    this.handleScan = this.handleScan.bind(this)
    this.handleError = this.handleError.bind(this)
  }

  handleToggle () {
    switch (this.props.scanType) {
      case 'btcAddress': return this.props.updateUI({ btcAddress: { toggled: !this.props.ui.btcAddress.toggled } })
      case 'ethAddress': return this.props.updateUI({ ethAddress: { toggled: !this.props.ui.ethAddress.toggled } })
      case 'bchAddress': return this.props.updateUI({ bchAddress: { toggled: !this.props.ui.bchAddress.toggled } })
      case 'btcPriv': return this.props.updateUI({ btcPriv: { toggled: !this.props.ui.btcPriv.toggled } })
    }
  }

  handleScanBtcAddress (data) {
    try {
      const { address, options } = bip21.decode(data)
      const { amount, message } = options
      this.props.formActions.change('sendBtc', 'to', address)
      this.props.formActions.change('sendBtc', 'amount', amount)
      this.props.formActions.change('sendBtc', 'message', message)
      this.props.updateUI({ btcAddress: { toggled: false } })
    } catch (e) {
      this.props.alertActions.displayError(C.BTC_ADDRESS_INVALID)
      this.props.updateUI({ btcAddress: { toggled: false } })
    }
  }

  handleScanBchAddress (data) {
    try {
      const {address, options} = bip21.decode(data, 'bitcoincash')
      const {amount, message} = options
      this.props.formActions.change('sendBch', 'to', address)
      this.props.formActions.change('sendBch', 'amount', amount)
      this.props.formActions.change('sendBch', 'message', message)
      this.props.updateUI({ bchAddress: { toggled: false } })
    } catch (e) {
      this.props.alertActions.displayError(C.BCH_ADDRESS_INVALID)
      this.props.updateUI({ bchAddress: { toggled: false } })
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
    try {
      this.props.formActions.change('sendBtc', 'priv', data)
      this.props.updateUI({ btcPriv: { toggled: false } })
    } catch (e) {
      this.props.alertActions.displayError(C.PRIVATE_KEY_INVALID)
      this.props.updateUI({ btcPriv: { toggled: false } })
    }
  }

  handleScan (data) {
    if (!isNil(data) && !isEmpty(data)) {
      switch (this.props.scanType) {
        case 'btcAddress': return this.handleScanBtcAddress(data)
        case 'ethAddress': return this.handleScanEthAddress(data)
        case 'bchAddress': return this.handleScanBchAddress(data)
        case 'btcPriv': return this.handleScanBtcPriv(data)
      }
    }
  }

  handleError (error) {
    if (!isNil(error) && !isEmpty(error)) {
      this.props.alertActions.displayError(error)
    }
  }

  render () {
    const { border, ui, scanType } = this.props
    const getTypeToggled = (scanType) => {
      switch (scanType) {
        case 'btcAddress': return ui.btcAddress.toggled
        case 'ethAddress': return ui.ethAddress.toggled
        case 'bchAddress': return ui.bchAddress.toggled
        case 'btcPriv': return ui.btcPriv.toggled
      }
    }
    const toggled = getTypeToggled(scanType)

    return <QRCodeCapture
      border={border}
      toggled={toggled}
      handleToggle={this.handleToggle}
      handleScan={this.handleScan}
      handleError={this.handleError}
    />
  }
}

const mapDispatchToProps = dispatch => ({
  alertActions: bindActionCreators(actions.alerts, dispatch),
  modalActions: bindActionCreators(actions.modals, dispatch),
  formActions: bindActionCreators(actions.form, dispatch)
})

const enhance = compose(
  ui({ key: 'QRCodeCapture',
    state: { btcAddress: { toggled: false },
      ethAddress: { toggled: false },
      bchAddress: { toggled: false },
      btcPriv: { toggled: false } } }),
  connect(undefined, mapDispatchToProps)
)

QRCodeCaptureContainer.defaultProps = {
  scanType: PropTypes.oneOf(['btcAddress', 'ethAddress', 'bchAddress', 'btcPriv'])
}

export default enhance(QRCodeCaptureContainer)
