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
  margin: 24px 0 32px;
  text-align: center;
`
const SkipTourText = styled(Text)`
  cursor: pointer;
  color: ${props => props.theme['brand-secondary']};
  margin: 25px 0 12px;
`
const FinishSetupStep = props => {
  const { onFinishSetup } = props

  return (
    <Wrapper>
      <Image
        style={{ marginBottom: '18px' }}
        name='lockbox-onboard-complete'
        width='100%'
      />
      <IntroText size='12px' weight={300}>
        <FormattedHTMLMessage
          id='modals.lockboxsetup.finishstep.intro'
          defaultMessage="Congratulations! Your Lockbox is ready. You'll be able to view your Lockbox balance in your Wallet any time, but will need your device connected to transfer funds."
        />
      </IntroText>
      <SkipTourText
        size='11px'
        weight={300}
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
