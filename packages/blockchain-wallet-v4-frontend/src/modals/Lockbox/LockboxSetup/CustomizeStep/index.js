import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import styled from 'styled-components'

import { Button, Image, Text } from 'blockchain-info-components'
import { actions } from 'data'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
`
const IntroText = styled(Text)`
  margin: 12px 0 20px;
  text-align: center;
`
const ReminderText = styled(Text)`
  margin: 35px 0 14px;
`

class CustomizeStepContainer extends React.PureComponent {
  onNextStep = () => {
    this.props.lockboxActions.changeDeviceSetupStep('app-manager-step')
  }

  render() {
    return (
      <Wrapper>
        <Image
          style={{ marginBottom: '18px' }}
          name='lockbox-onboard-customize'
          width='100%'
        />
        <IntroText size='13px' weight={400}>
          <FormattedMessage
            id='modals.lockboxsetup.customizestep.title'
            defaultMessage='Now the fun starts. It’s time to add apps to your device. You will need to install an app for each asset that you store on your device.'
          />
        </IntroText>
        <ReminderText size='10px' weight={400}>
          <FormattedMessage
            id='modals.lockboxsetup.customizestep.reminder'
            defaultMessage="Don't worry you can always change them later."
          />
        </ReminderText>
        <Button fullwidth onClick={this.onNextStep} nature={'primary'}>
          <FormattedMessage
            id='modals.lockboxsetup.customizestep.addapps'
            defaultMessage='Add Apps'
          />
        </Button>
      </Wrapper>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  lockboxActions: bindActionCreators(actions.components.lockbox, dispatch)
})

export default connect(null, mapDispatchToProps)(CustomizeStepContainer)
