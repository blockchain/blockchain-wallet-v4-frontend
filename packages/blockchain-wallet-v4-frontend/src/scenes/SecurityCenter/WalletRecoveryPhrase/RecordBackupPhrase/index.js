import React from 'react'
import { compose, bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import wizardProvider from 'providers/WizardProvider'
import { actions } from 'data'
import { path } from 'ramda'
import FirstStep from './FirstStep'
import SecondStep from './SecondStep'
import ThirdStep from './ThirdStep'

class RecoveryPhraseContainer extends React.Component {
  componentWillMount () {
    this.props.resetStep()
  }

  componentDidMount () {
    this.props.settingsActions.showBackupRecovery()
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.step === 3 || (nextProps.step === 2 && this.props.step === 3)) this.props.triggerCopyChange()
  }

  onClose () {
    this.props.handleClose()
  }

  render () {
    switch (this.props.step) {
      case 1: return <FirstStep {...this.props} />
      case 2: return <SecondStep {...this.props} />
      case 3: return <ThirdStep {...this.props} />
      default: return <div />
    }
  }
}

const mapStateToProps = (state) => ({
  recoveryPhrase: path(['securityCenter', 'recovery_phrase'], state)
})

const mapDispatchToProps = (dispatch) => ({
  settingsActions: bindActionCreators(actions.modules.settings, dispatch)
})

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  wizardProvider('recoveryPhrase', 3)
)

export default enhance(RecoveryPhraseContainer)
