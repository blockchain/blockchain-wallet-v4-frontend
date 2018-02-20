import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import ui from 'redux-ui'
import { isNil, isEmpty } from 'ramda'
import bip21 from 'bip21'

import { actions } from 'data'
import QRCodeCapture from './template.js'

class QRCodeCaptureContainer extends React.Component {
  constructor (props) {
    super(props)
    this.handleToggle = this.handleToggle.bind(this)
    this.handleScan = this.handleScan.bind(this)
    this.handleError = this.handleError.bind(this)
  }

  handleToggle () {
    switch (this.props.coin) {
      case 'BTC': return this.props.updateUI({ bitcoin: { toggled: !this.props.ui.bitcoin.toggled } })
      case 'ETH': return this.props.updateUI({ ethereum: { toggled: !this.props.ui.ethereum.toggled } })
      case 'BCH': return this.props.updateUI({ bch: { toggled: !this.props.ui.bch.toggled } })
    }
  }

  handleScanBtc (data) {
    if (!isNil(data) && !isEmpty(data)) {
      const { address, options } = bip21.decode(data)
      const { amount, message } = options
      this.props.formActions.change('sendBtc', 'to2', address)
      this.props.formActions.change('sendBtc', 'amount', amount)
      this.props.formActions.change('sendBtc', 'message', message)
      this.props.updateUI({ bitcoin: { toggled: false } })
    }
  }

  handleScanBch (data) {
    if (!isNil(data) && !isEmpty(data)) {
      const { address, options } = bip21.decode(data)
      const { amount, message } = options
      this.props.formActions.change('sendBch', 'to2', address)
      this.props.formActions.change('sendBch', 'amount', amount)
      this.props.formActions.change('sendBch', 'message', message)
      this.props.updateUI({ bch: { toggled: false } })
    }
  }

  handleScanEthereum (data) {
    if (!isNil(data) && !isEmpty(data)) {
      this.props.formActions.change('sendEth', 'to', data)
      this.props.updateUI({ ethereum: { toggled: false } })
    }
  }

  handleScan (data) {
    switch (this.props.coin) {
      case 'BTC': return this.handleScanBtc(data)
      case 'ETH': return this.handleScanEthereum(data)
      case 'BCH': return this.handleScanBch(data)
    }
  }

  handleError (error) {
    if (!isNil(error) && !isEmpty(error)) {
      this.props.alertActions.displayError(error)
    }
  }

  render () {
    const { ui, coin } = this.props
    const toggled = coin === 'BTC' ? ui.bitcoin.toggled : coin === 'ETH' ? ui.ethereum.toggled : ui.bch.toggled

    return <QRCodeCapture
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
  ui({ key: 'QRCodeCapture', state: { bitcoin: { toggled: false }, ethereum: { toggled: false }, bch: { toggled: false } } }),
  connect(undefined, mapDispatchToProps)
)

QRCodeCaptureContainer.defaultProps = {
  coin: PropTypes.oneOf(['BTC', 'ETH', 'BCH'])
}

export default enhance(QRCodeCaptureContainer)
