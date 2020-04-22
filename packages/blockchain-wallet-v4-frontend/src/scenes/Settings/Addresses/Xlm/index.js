import { connect } from 'react-redux'
import React, { Component } from 'react'

import { actions } from 'data'
import { getData } from './selectors'
import XlmAddresses from './template'

class XlmAddressContainer extends Component {
  state = {
    showQrCode: false
  }

  componentDidMount () {
    this.props.showXlmPrivateKey()
  }

  toggleQrCode = () =>
    this.setState(prevState => ({
      showQrCode: !prevState.showQrCode
    }))

  render () {
    return (
      <XlmAddresses
        {...this.props}
        privateKey={this.props.priv}
        showQrCode={this.state.showQrCode}
        toggleQrCode={this.toggleQrCode}
      />
    )
  }
}

const mapStateToProps = (state, ownProps) => getData(state, ownProps)

const mapDispatchToProps = dispatch => ({
  showXlmPrivateKey: isLegacy =>
    dispatch(actions.modules.settings.showXlmPrivateKey(isLegacy))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(XlmAddressContainer)
