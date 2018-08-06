import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { FormattedMessage } from 'react-intl'
import { formValueSelector } from 'redux-form'

import ConfirmRecoveryStep from './template'

import Stepper, { StepView, StepTransition } from 'components/Utilities/Stepper'
import { actions } from 'data'
import { Button, Text } from 'blockchain-info-components'

class ConfirmRecoveryStepContainer extends React.PureComponent {
  constructor (props) {
    super(props)
    this.onSubmit = this.onSubmit.bind(this)
  }

  onSubmit () {
    this.props.lockboxActions.storeDeviceBackupFlag(true)
  }

  render () {
    return <ConfirmRecoveryStep onSubmit={this.onSubmit} />

    return (
      <Stepper key='LockboxConfirmRecoveryStep' initialStep={0}>
        <StepView step={0}>
          <Text size='16px' weight={400}>
            <FormattedMessage
              id='modals.lockboxsetup.confirmrecovery.step1.title'
              defaultMessage='Have you saved your 24 word recovery phrase?'
            />
          </Text>
          <Text size='13px' weight={300} style={{ marginTop: '10px' }}>
            <FormattedMessage
              id='modals.lockboxsetup.confirmrecovery.step1.subtitle'
              defaultMessage='This is your only backup for your Carbon. The 12 word backup phrase for your Blockchain wallet DOES NOT cover the funds in your Lockbox.'
            />
          </Text>
          <StepTransition
            next
            Component={Button}
            fullwidth
            nature='primary'
            style={{ marginTop: '25px' }}
          >
            <FormattedMessage
              id='modals.lockboxsetup.confirmrecovery.step1.confirm'
              defaultMessage='Yes, I saved my passphrase'
            />
          </StepTransition>
        </StepView>
        <StepView step={1}>
          <Text size='16px' weight={400}>
            <FormattedMessage
              id='modals.lockboxsetup.confirmrecovery.step2.title'
              defaultMessage='Please confirm that you saved your backup phrase.'
            />
          </Text>
          <Text size='13px' weight={300} style={{ marginTop: '10px' }}>
            <FormattedMessage
              id='modals.lockboxsetup.confirmrecovery.step2.subtitle'
              defaultMessage='This cannot be recovered at a later date. Type COMPLETE to confirm that you have written down your backup phrase.'
            />
          </Text>
          <StepTransition
            next
            Component={Button}
            fullwidth
            nature='primary'
            style={{ marginTop: '25px' }}
          >
            <FormattedMessage
              id='modals.lockboxsetup.confirmrecovery.step2.confirm'
              defaultMessage='Continue'
            />
          </StepTransition>
        </StepView>
      </Stepper>
    )
  }
}

const mapStateToProps = state => ({
  storePublicKeys: formValueSelector('lockboxConfirmRecovery')(
    state,
    'storePublicKeys'
  )
})

const mapDispatchToProps = dispatch => ({
  modalActions: bindActionCreators(actions.modals, dispatch),
  lockboxActions: bindActionCreators(actions.components.lockbox, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ConfirmRecoveryStepContainer)
