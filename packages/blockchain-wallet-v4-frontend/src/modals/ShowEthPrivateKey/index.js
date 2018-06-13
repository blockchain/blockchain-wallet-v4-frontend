import React, { Component } from 'react'
import { compose, bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import modalEnhancer from 'providers/ModalEnhancer'
import { actions } from 'data'
import { getData } from './selectors'
import ShowEthPrivateKeyTemplate from './template'

class ShowEthPrivateKeyContainer extends Component {
  componentDidMount () {
    if (this.props.isLegacy) {
      this.props.ethActions.fetchLegacyBalance()
    }
  }
  
  componentWillUnmount () {
    this.props.actions.clearShownEthPrivateKey()
  }

  render () {
    const step = this.props.priv == null ? 0 : 1
    const nextStep = () => this.props.actions.showEthPrivateKey(this.props.isLegacy)
    return (
      <ShowEthPrivateKeyTemplate
        {...this.props}
        step={step}
        onContinue={nextStep}
      />
    )
  }
}

const mapStateToProps = (state, ownProps) => getData(state, ownProps)

const mapDispatchToProps = (dispatch) => ({
  ethActions: bindActionCreators(actions.core.data.ethereum, dispatch),
  actions: bindActionCreators(actions.modules.settings, dispatch)
})

const enhance = compose(
  modalEnhancer('ShowEthPrivateKey'),
  connect(mapStateToProps, mapDispatchToProps)
)

export default enhance(ShowEthPrivateKeyContainer)
