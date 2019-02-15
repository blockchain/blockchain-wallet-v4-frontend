import React from 'react'
import styled from 'styled-components'

import EmailAddress from './EmailAddress'
import TwoStepVerification from './TwoStepVerification'
import WalletRecoveryPhrase from './WalletRecoveryPhrase'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  width: 100%;
  & > * {
    margin-top: 20px;
  }
`

const BasicSecurity = props => {
  const { changeEmail } = props
  return (
    <Wrapper>
      <EmailAddress changeEmail={changeEmail} />
      <TwoStepVerification />
      <WalletRecoveryPhrase />
    </Wrapper>
  )
}

export default BasicSecurity
