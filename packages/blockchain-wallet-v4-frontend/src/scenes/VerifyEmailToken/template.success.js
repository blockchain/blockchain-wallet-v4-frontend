import React from 'react'
import styled from 'styled-components'
import { Image, Text } from 'blockchain-info-components'
import SanitizedFormattedHTMLMessage from 'components/SanitizedFormattedHTMLMessage'

const Wrapper = styled.div`
  display: flex;
  text-align: center;
  align-items: center;
  flex-direction: column;
`
const SuccessText = styled(Text)`
  > span > span {
    color: ${props => props.theme['gray-5']}
  }
`

const Success = props => {
  return (
    <Wrapper>
      <Image name='blue-logo' width='50px' height='50px' />
      <SuccessText size='16px' weight={300} color='success' style={{ 'margin-top': '25px' }}>
        <SanitizedFormattedHTMLMessage id='scenes.verifyemailtoken.success' defaultMessage="You've succesfully verified your email address! <span>Return to the previous tab to view your wallet.</span>" />
      </SuccessText>
    </Wrapper>
  )
}

export default Success
