import React, { Component } from 'react'
import { compose, bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import modalEnhancer from 'providers/ModalEnhancer'
import { actions } from 'data'
import ShowPrivateKeyTemplate from './template'

class ShowPrivateKeyContainer extends Component {
  componentWillUnmount () {
    this.props.actions.clearShownPrivateKey()
  }

  render () {
    let step = this.props.priv == null ? 0 : 1
    let nextStep = () => this.props.actions.showPrivateKey(this.props.addr)
    return (<ShowPrivateKeyTemplate {...this.props} step={step} onContinue={nextStep} />)
  }
}

const mapState = (state) => ({
  priv: state.securityCenter.shownPrivKey
})

const mapDispatch = (dispatch) => ({
  actions: bindActionCreators(actions.modules.settings, dispatch)
})

const enhance = compose(
  connect(mapState, mapDispatch),
  modalEnhancer('ShowPrivateKey')
)

export default enhance(ShowPrivateKeyContainer)
