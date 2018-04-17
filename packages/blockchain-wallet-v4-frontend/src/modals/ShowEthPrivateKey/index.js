import React, { Component } from 'react'
import { compose, bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import modalEnhancer from 'providers/ModalEnhancer'
import { actions, selectors } from 'data'
import ShowEthPrivateKeyTemplate from './template'

class ShowEthPrivateKeyContainer extends Component {
  componentWillUnmount () {
    this.props.actions.clearShownEthPrivateKey()
  }

  render () {
    let step = this.props.priv == null ? 0 : 1
    let nextStep = () => this.props.actions.showEthPrivateKey(this.props.archived)
    console.log(this.props.priv)
    return (
      <ShowEthPrivateKeyTemplate
        {...this.props}
        step={step}
        onContinue={nextStep}
      />
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const ethKvStoreSelectors = selectors.core.kvStore.ethereum
  return ({
    balance: ownProps.archived ? 0 : selectors.core.data.ethereum.getBalance(state).getOrElse(0),
    addr: (ownProps.archived
      ? ethKvStoreSelectors.getLegacyAccountAddress(state)
      : ethKvStoreSelectors.getContext(state)).getOrElse(''),
    priv: state.securityCenter.shownEthPrivKey
  })
}

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions.modules.settings, dispatch)
})

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  modalEnhancer('ShowEthPrivateKey')
)

export default enhance(ShowEthPrivateKeyContainer)
