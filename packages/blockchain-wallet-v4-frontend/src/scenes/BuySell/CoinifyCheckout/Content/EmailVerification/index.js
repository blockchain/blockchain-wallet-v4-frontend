import React from 'react'
import EmailVerification from 'modals/Coinify/CoinifyExchangeData/Create'
import styled from 'styled-components'

const EmailVerificationWrapper = styled.div`
  padding: 30px;
`
const emailVerification = props => {
  return (
    <EmailVerificationWrapper>
      <EmailVerification country={props.country} />
    </EmailVerificationWrapper>
  )
}

export default emailVerification
