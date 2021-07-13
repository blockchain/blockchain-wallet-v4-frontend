import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Button, Image, Text } from 'blockchain-info-components'

const Wrapper = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 0 56px;
  box-sizing: border-box;
`
const Title = styled(Text)`
  margin: 40px 0 10px;
`

const SubTitle = styled(Text)`
  margin: 0 0 24px;
`

const TimedOut = props => {
  return (
    <Wrapper>
      <div>
        <Image
          width='48px'
          height='48px'
          name='world-alert'
          srcset={{ 'world-alert2': '2x', 'world-alert3': '3x' }}
        />
        <Title weight={600} size='20px' lineHeight='150%'>
          <FormattedMessage
            id='modals.brokerage.timed_out_title'
            defaultMessage='We timed out waiting to hear from your bank.'
          />
        </Title>
        <SubTitle weight={400} size='14px' lineHeight='150%'>
          <FormattedMessage
            id='modals.brokerage.timed_out_sub'
            defaultMessage='This happens from time to time. Wait a few minutes and then check the status of your deposit in the transaction list.'
          />
        </SubTitle>
        <Button
          fullwidth
          height='48px'
          data-e2e='addBankClose'
          nature='primary'
          size='16px'
          onClick={props.handleClose}
        >
          <FormattedMessage id='buttons.close' defaultMessage='Close' />
        </Button>
      </div>
    </Wrapper>
  )
}

export default TimedOut
