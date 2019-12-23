import { actions } from 'data'
import { bindActionCreators, compose } from 'redux'
import { connect } from 'react-redux'
import { path } from 'ramda'
import FirstStep from './FirstStep'
import React from 'react'
import SecondStep from './SecondStep'
import ThirdStep from './ThirdStep'
import wizardProvider from 'providers/WizardProvider'

class RecoveryPhraseContainer extends React.PureComponent {
  componentDidMount () {
    this.props.resetStep()
  }

  componentDidUpdate (nextProps) {
    if (
      nextProps.step === 3 ||
      (nextProps.step === 2 && this.props.step === 3)
    ) {
      this.props.triggerCopyChange()
    }
  }

  onClose () {
    this.props.handleClose()
  }

  render () {
    switch (this.props.step) {
      case 1:
        return <FirstStep {...this.props} />
      case 2:
        return <SecondStep {...this.props} />
      case 3:
        return <ThirdStep {...this.props} />
      default:
        return <div />
    }
  }
}

const mapStateToProps = state => ({
  recoveryPhrase: path(['securityCenter', 'recovery_phrase'], state)
})

const mapDispatchToProps = dispatch => ({
  settingsActions: bindActionCreators(actions.modules.settings, dispatch)
})

const enhance = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  wizardProvider('recoveryPhrase', 3)
)

export default enhance(RecoveryPhraseContainer)
