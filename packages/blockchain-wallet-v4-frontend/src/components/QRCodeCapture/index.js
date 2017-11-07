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
    }
  }

  handleScanBitcoin (data) {
    if (!isNil(data) && !isEmpty(data)) {
      const { address, options } = bip21.decode(data)
      const { amount, message } = options
      console.log(data, address, amount, message)
      this.props.formActions.change('sendBitcoin', 'to2', address)
      this.props.formActions.change('sendBitcoin', 'amount', amount)
      this.props.formActions.change('sendBitcoin', 'message', message)
      this.props.updateUI({ bitcoin: { toggled: false } })
    }
  }

  handleScanEthereum (data) {
    if (!isNil(data) && !isEmpty(data)) {
      this.props.formActions.change('sendEther', 'to', data)
      this.props.updateUI({ ethereum: { toggled: false } })
    }
  }

  handleScan (data) {
    switch (this.props.coin) {
      case 'BTC': return this.handleScanBitcoin(data)
      case 'ETH': return this.handleScanEthereum(data)
    }
  }

  handleError (error) {
    if (!isNil(error) && !isEmpty(error)) {
      this.props.alertActions.displayError(error)
    }
  }

  render () {
    const { ui, coin } = this.props
    const toggled = coin === 'BTC' ? ui.bitcoin.toggled : ui.ethereum.toggled

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
  ui({ key: 'QRCodeCapture', state: { bitcoin: { toggled: false }, ethereum: { toggled: false } } }),
  connect(undefined, mapDispatchToProps)
)

QRCodeCaptureContainer.defaultProps = {
  coin: PropTypes.oneOf(['BTC', 'ETH'])
}

export default enhance(QRCodeCaptureContainer)
