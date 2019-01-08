import React from 'react'
import styled from 'styled-components'
import { FormattedHTMLMessage } from 'react-intl'

import { Button, Image, Text } from 'blockchain-info-components'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
`
const IntroText = styled(Text)`
  margin: 20px 0 30px;
`
const SkipTourText = styled(Text)`
  cursor: pointer;
  color: ${props => props.theme['brand-secondary']};
  margin: 25px 0 8px;
`
const FinishSetupStep = props => {
  const { deviceType, onFinishSetup } = props

  return (
    <Wrapper>
      <Image
        style={{ marginBottom: '18px' }}
        name='lockbox-onboard-complete'
        width='100%'
      />
      <IntroText size='13px' weight={300}>
        <FormattedHTMLMessage
          id='modals.lockboxsetup.finishstep.intro'
          defaultMessage="Congratulations your {deviceType} is now ready to use! You'll now be able to view the balances on your device at any time. However, your device will need to be connected whenever you send funds. Start a tour now to learn more!"
          values={{ deviceType }}
        />
      </IntroText>
      <SkipTourText
        size='11px'
        weight={400}
        onClick={() => onFinishSetup(false)}
      >
        <FormattedHTMLMessage
          id='modals.lockboxsetup.finishstep.skiptour'
          defaultMessage='Skip Tour'
        />
      </SkipTourText>
      <Button fullwidth onClick={() => onFinishSetup(true)} nature='primary'>
        <FormattedHTMLMessage
          id='modals.lockboxsetup.finishstep.starttour'
          defaultMessage='Start Tour'
        />
      </Button>
    </Wrapper>
  )
}

export default FinishSetupStep
