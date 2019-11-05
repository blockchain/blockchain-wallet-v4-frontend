import { bindActionCreators, compose } from 'redux'
import { connect } from 'react-redux'
import React, { Component } from 'react'

import { actions } from 'data'
import { getData } from './selectors'
import modalEnhancer from 'providers/ModalEnhancer'
import ShowPrivateKeyTemplate from './template'

class ShowXlmPrivateKeyContainer extends Component {
  componentWillUnmount () {
    this.props.actions.clearShownEthPrivateKey()
  }

  render () {
    const step = this.props.priv == null ? 0 : 1
    return (
      <ShowPrivateKeyTemplate
        {...this.props}
        step={step}
        onContinue={this.props.actions.showXlmPrivateKey}
      />
    )
  }
}

const mapDispatchToProps = dispatch => ({
  ethActions: bindActionCreators(actions.core.data.eth, dispatch),
  actions: bindActionCreators(actions.modules.settings, dispatch)
})

const enhance = compose(
  modalEnhancer('ShowXlmPrivateKey'),
  connect(
    getData,
    mapDispatchToProps
  )
)

export default enhance(ShowXlmPrivateKeyContainer)
