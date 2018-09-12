import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { path } from 'ramda'
import { getData } from './selectors'
import Success from './template.success'
import { actions } from 'data'

class WalletRecoveryPhraseContainer extends React.PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      nextStepToggled: false,
      descriptionToggled: false
    }
    this.toggleNextStep = this.toggleNextStep.bind(this)
    this.closeSteps = this.closeSteps.bind(this)
    this.changeDescription = this.changeDescription.bind(this)
    this.handleUpdate = this.handleUpdate.bind(this)
  }

  componentDidUpdate (prevProps) {
    if (prevProps.recoveryPhrase && this.props.recoveryPhrase === undefined) {
      this.props.handleEnable()

      this.handleUpdate()
    }
  }
  handleUpdate () {
    this.setState({
      nextStepToggled: !this.state.nextStepToggled
    })
  }

  toggleNextStep () {
    if (this.props.recoveryPhrase === undefined) {
      this.props.settingsActions.showBackupRecovery()
    } else {
      this.handleUpdate()
      this.props.handleEnable()
    }
  }

  closeSteps () {
    this.setState({
      nextStepToggled: false,
      descriptionToggled: false
    })
  }

  changeDescription () {
    this.setState({
      descriptionToggled: !this.state.descriptionToggled
    })
  }

  render () {
    const { data, ...rest } = this.props
    return (
      <Success
        {...rest}
        formState={this.state}
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
