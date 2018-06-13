import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import { path } from 'ramda'
import ui from 'redux-ui'
import { getData } from './selectors'
import Success from './template.success'

import { actions } from 'data'

class WalletRecoveryPhraseContainer extends React.PureComponent {
  constructor (props) {
    super(props)

    this.toggleNextStep = this.toggleNextStep.bind(this)
    this.closeSteps = this.closeSteps.bind(this)
    this.changeDescription = this.changeDescription.bind(this)
    this.state = {}
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.recoveryPhrase && this.props.recoveryPhrase === undefined) {
      this.props.updateUI({ nextStepToggled: true })
      this.props.handleEnable()
    }
  }

  toggleNextStep () {
    if (this.props.recoveryPhrase === undefined) {
      this.props.settingsActions.showBackupRecovery()
    } else {
      this.props.updateUI({ nextStepToggled: true })
      this.props.handleEnable()
    }
  }

  closeSteps () {
    this.props.updateUI({ nextStepToggled: false, descriptionToggled: false })
  }

  changeDescription () {
    this.props.updateUI({ descriptionToggled: !this.props.ui.descriptionToggled })
  }

  render () {
    const { data, ...rest } = this.props
    return <Success
      {...rest}
      data={data}
      toggleNextStep={this.toggleNextStep}
      handleClose={this.closeSteps}
      changeDescription={this.changeDescription}
    />
  }
}

const mapStateToProps = (state) => ({
  data: getData(state),
  recoveryPhrase: path(['securityCenter', 'recovery_phrase'], state)
})

const mapDispatchToProps = (dispatch) => ({
  settingsActions: bindActionCreators(actions.modules.settings, dispatch),
  securityCenterActions: bindActionCreators(actions.modules.securityCenter, dispatch),
  formActions: bindActionCreators(actions.form, dispatch)
})

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  ui({ key: 'Security_TwoStep', state: { nextStepToggled: false, descriptionToggled: false } })
)

export default enhance(WalletRecoveryPhraseContainer)
