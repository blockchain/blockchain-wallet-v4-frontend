import React from 'react'
import styled from 'styled-components'

import { Text } from 'components/generic/Text'
import InfoWell from 'components/shared/InfoWell'
import PasswordHint from './PasswordHint'
import SecondPasswordWallet from './SecondPasswordWallet'
import TwoStepVerification from './TwoStepVerification'
import TwoStepVerificationRemember from './TwoStepVerificationRemember'
import WalletPassword from './WalletPassword'
import WalletRecoveryPhrase from './WalletRecoveryPhrase'

const Wrapper = styled.div``

const BasicSecurity = () => (
  <Wrapper>
    <InfoWell>
      <Text id='scenes.settings.basicsecurity.explain' text='Basic security: Make sure your details are accurate and up to date to keep your wallet safe from unauthorized access' small />
      <Text id='scenes.settings.basicsecurity.explain2' text='and to help you restore access to your wallet in the case of a Wallet ID or password loss.' small />
    </InfoWell>
    <WalletRecoveryPhrase />
    <WalletPassword />
    <PasswordHint />
    <SecondPasswordWallet />
    <TwoStepVerification />
    <TwoStepVerificationRemember />
  </Wrapper>
)

export default BasicSecurity
