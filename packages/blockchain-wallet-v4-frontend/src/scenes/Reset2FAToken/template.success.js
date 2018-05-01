import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { Image, Text } from 'blockchain-info-components'

const Wrapper = styled.div`
  display: flex;
  text-align: center;
  align-items: center;
  flex-direction: column;
`

const Success = props => {
  const { message } = props.value
  const declined = message === 'Reset Request Successfully Declined.'

  return (
    <Wrapper>
      <Image name='blue-logo' width='50px' height='50px' />
      {
        declined ? <Text size='16px' weight={300} style={{ 'margin-top': '25px' }}>
          <FormattedMessage id='scenes.reset2fatoken.declined' defaultMessage="You've succesfully declined this Two-Step Verification reset request." />
        </Text> : <Text size='16px' weight={300} style={{ 'margin-top': '25px' }}>
          <FormattedMessage id='scenes.reset2fatoken.approved' defaultMessage="You've sucessfully approved this Two-Step Verification reset request. This will speed up the process of resetting your Two-Step Verification." />
        </Text>
      }
    </Wrapper>
  )
}

export default Success
