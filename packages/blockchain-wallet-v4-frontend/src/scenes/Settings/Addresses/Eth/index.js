import { connect } from 'react-redux'
import { prop } from 'ramda'
import React, { Component } from 'react'

import { actions } from 'data'
import { getData } from './selectors'
import ShowEthPrivateKeyTemplate from './template'

class ShowEthPrivateKeyContainer extends Component {
  state = {
    checkSecondPassword: false,
    showQrCode: false
  }

  componentDidMount () {
    this.props.isLegacy
      ? this.props.fetchLegacyBalance()
      : this.props.showEthPrivateKey(this.props.isLegacy)
  }

  componentWillUnmount () {
    this.props.clearShownEthPrivateKey()
    this.props.clearShownEthLegacyPrivateKey()
  }

  toggleQrCode = () => {
    if (this.props.secondPasswordEnabled && !this.state.checkSecondPassword) {
      this.props.showEthPrivateKey(this.props.isLegacy)
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

  checkQrCode = () =>
    this.props.isLegacy
      ? this.state.showQrCode &&
        prop('priv', this.props.legacyAddressInfo) &&
        prop('priv', this.props.addressInfo)
      : this.state.showQrCode &&
        (prop('priv', this.props.legacyAddressInfo) ||
          prop('priv', this.props.addressInfo))

  render () {
    const showQrCode = this.checkQrCode()
    return (
      <ShowEthPrivateKeyTemplate
        addressInfo={this.props.addressInfo}
        legacyAddressInfo={this.props.legacyAddressInfo}
        showQrCode={showQrCode}
        toggleQrCode={this.toggleQrCode}
      />
    )
  }
}

const mapStateToProps = (state, ownProps) => getData(state, ownProps)

const mapDispatchToProps = dispatch => ({
  fetchLegacyBalance: () =>
    dispatch(actions.core.data.eth.fetchLegacyBalance()),
  showEthPrivateKey: isLegacy =>
    dispatch(actions.modules.settings.showEthPrivateKey(isLegacy)),
  clearShownEthLegacyPrivateKey: () =>
    dispatch(actions.modules.settings.clearShownEthLegacyPrivateKey()),
  clearShownEthPrivateKey: () =>
    dispatch(actions.modules.settings.clearShownEthPrivateKey())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ShowEthPrivateKeyContainer)
