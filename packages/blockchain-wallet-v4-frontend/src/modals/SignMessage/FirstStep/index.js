import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { formValueSelector } from 'redux-form'
import { isNil } from 'ramda'

import { actions } from 'data'
import FirstStep from './template'

class FirstStepContainer extends React.PureComponent {
  constructor (props) {
    super(props)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleSubmit (e) {
    e.preventDefault()
    this.props.settingsActions.signMessage(this.props.address)
    this.props.nextStep()
  }

  render () {
    const { address, closeAll, disabled } = this.props

    return <FirstStep
      address={address}
      disabled={disabled}
      closeAll={closeAll}
      handleSubmit={this.handleSubmit} />
  }
}

const mapStateToProps = (state) => ({
  disabled: isNil(formValueSelector('signMessage')(state, 'message'))
})

const mapDispatchToProps = (dispatch) => ({
  modalActions: bindActionCreators(actions.modals, dispatch),
  formActions: bindActionCreators(actions.form, dispatch),
  settingsActions: bindActionCreators(actions.modules.settings, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(FirstStepContainer)
