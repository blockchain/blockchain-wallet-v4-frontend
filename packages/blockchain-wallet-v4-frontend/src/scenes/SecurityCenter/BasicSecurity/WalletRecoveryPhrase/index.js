import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { path } from 'ramda'
import { getData } from './selectors'
import WalletRecoveryPhrase from './template.success'

import { actions } from 'data'

class WalletRecoveryPhraseContainer extends React.PureComponent {
  state = {
    nextStepToggled: false,
    descriptionToggled: false
  }

  componentDidUpdate (prevProps) {
    if (!prevProps.recoveryPhrase && this.props.recoveryPhrase) {
      this.toggleNextStep()
    }
  }

  toggleNextStep = () => {
    if (this.props.recoveryPhrase === undefined) {
      this.props.settingsActions.showBackupRecovery()
    } else {
      this.setState({ nextStepToggled: true })
    }
  }

  closeSteps = () => {
    this.setState({ nextStepToggled: false, descriptionToggled: false })
  }

  changeDescription = () => {
    this.setState({
      descriptionToggled: !this.state.descriptionToggled
    })
  }

  render () {
    const { data, ...rest } = this.props
    return (
      <WalletRecoveryPhrase
        {...rest}
        ui={this.state}
        data={data}
        toggleNextStep={this.toggleNextStep}
        handleClose={this.closeSteps}
        changeDescription={this.changeDescription}
      />
    )
  }
}

const mapStateToProps = state => ({
  data: getData(state),
  recoveryPhrase: path(['securityCenter', 'recovery_phrase'], state)
})

const mapDispatchToProps = dispatch => ({
  settingsActions: bindActionCreators(actions.modules.settings, dispatch),
  securityCenterActions: bindActionCreators(
    actions.modules.securityCenter,
    dispatch
  ),
  formActions: bindActionCreators(actions.form, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WalletRecoveryPhraseContainer)
