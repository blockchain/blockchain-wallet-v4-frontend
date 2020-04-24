import { connect } from 'react-redux'
import React, { Component } from 'react'

import { actions } from 'data'
import { getData } from './selectors'
import XlmAddresses from './template'

class XlmAddressContainer extends Component {
  state = {
    checkSecondPassword: false,
    showQrCode: false
  }

  componentWillUnmount () {
    this.props.clearShownXlmPrivateKey()
  }

  toggleQrCode = () => {
    if (this.props.secondPasswordEnabled && !this.state.checkSecondPassword) {
      this.props.showXlmPrivateKey()
      this.setState(prevState => ({
        checkSecondPassword: true,
        showQrCode: !prevState.showQrCode
      }))
    } else {
      this.setState(prevState => ({
        showQrCode: !prevState.showQrCode
      }))
    }
  }

  render () {
    return (
      <XlmAddresses
        {...this.props}
        privateKey={this.props.priv}
        showQrCode={this.state.showQrCode && this.props.priv}
        toggleQrCode={this.toggleQrCode}
      />
    )
  }
}

const mapStateToProps = (state, ownProps) => getData(state, ownProps)

const mapDispatchToProps = dispatch => ({
  clearShownXlmPrivateKey: () =>
    dispatch(actions.modules.settings.clearShownXlmPrivateKey()),
  showXlmPrivateKey: isLegacy =>
    dispatch(actions.modules.settings.showXlmPrivateKey(isLegacy))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(XlmAddressContainer)
