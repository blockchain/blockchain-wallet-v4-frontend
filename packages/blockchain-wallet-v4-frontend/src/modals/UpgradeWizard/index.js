import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'

import { actions } from 'data'
import modalEnhancer from 'providers/ModalEnhancer'
import TwoStepYubico from './template.js'

class TwoStepYubicoContainer extends React.Component {
  constructor (props) {
    super(props)
    this.handleContinue = this.handleContinue.bind(this)
  }

  handleContinue () {
    // this.props.modalActions.clickUpgradeWizardContinue()
  }

  render () {
    return (
      <TwoStepYubico {...this.props} handleContinue={this.handleContinue} />
    )
  }
}

const mapDispatchToProps = (dispatch) => ({
  modalActions: bindActionCreators(actions.modals, dispatch)
})

const enhance = compose(
  modalEnhancer('UpgradeWizard'),
  connect(undefined, mapDispatchToProps)
)

export default enhance(TwoStepYubicoContainer)
