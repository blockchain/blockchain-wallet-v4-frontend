import { connect } from 'react-redux'
import React, { Component } from 'react'

import { actions } from 'data'
import { getData } from './selectors'
import ShowEthPrivateKeyTemplate from './template'

class ShowEthPrivateKeyContainer extends Component {
  state = {
    showQrCode: false
  }
  componentDidMount () {
    if (this.props.isLegacy) {
      this.props.fetchLegacyBalance()
    }
    this.props.showEthPrivateKey(this.props.isLegacy)
  }

  componentWillUnmount () {
    this.props.clearShownEthPrivateKey()
  }

  toggleQrCode = () =>
    this.setState(prevState => ({
      showQrCode: !prevState.showQrCode
    }))

  render () {
    return (
      <ShowEthPrivateKeyTemplate
        addressInfo={this.props.addressInfo}
        legacyAddressInfo={this.props.legacyAddressInfo}
        showQrCode={this.state.showQrCode}
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
  clearShownEthPrivateKey: () =>
    dispatch(actions.modules.settings.clearShownEthPrivateKey())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ShowEthPrivateKeyContainer)
