import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { Icon, Text } from 'blockchain-info-components'

const Wrapper = styled.div`
  display: flex;
  text-align: center;
  align-items: center;
  flex-direction: column;
`

const Success = props => {
  return (
    <Wrapper>
      <Icon name='checkmark-in-circle' color='success' size='40px' />
      <Text size='16px' weight={300} color='gray-5' style={{ 'margin-top': '25px' }}>
        <FormattedMessage id='scenes.authorizelogin.loading' defaultMessage='Login approved! Please return to your previous tab to view your wallet.' />
      </Text>
    </Wrapper>
  )
}

export default Success
