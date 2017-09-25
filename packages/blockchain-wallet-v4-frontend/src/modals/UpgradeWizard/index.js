import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'

import { actions } from 'data'
import modalEnhancer from 'providers/ModalEnhancer'
import TwoStepYubico from './template.js'

class TwoStepYubicoContainer extends React.Component {
  constructor (props) {
    super(props)
    this.handleConfirm = this.handleConfirm.bind(this)
  }

  handleConfirm () {
    this.props.modalActions.clickUpgradeWizardConfirm()
  }

  render () {
    return (
      <TwoStepYubico {...this.props} handleConfirm={this.handleConfirm} />
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
