import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

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
      <Image name='blockchain-icon' width='50px' height='50px' />
      {declined ? (
        <Text size='16px' weight={400} style={{ 'margin-top': '25px' }}>
          <FormattedMessage
            id='scenes.reset2fatoken.declined1'
            defaultMessage="You've successfully declined this Two-Step Verification reset request."
          />
        </Text>
      ) : (
        <Text size='16px' weight={400} style={{ 'margin-top': '25px' }}>
          <FormattedMessage
            id='scenes.reset2fatoken.approved1'
            defaultMessage="You've successfully approved this Two-Step Verification reset request. This will speed up the process of resetting your Two-Step Verification."
          />
        </Text>
      )}
    </Wrapper>
  )
}

export default Success
