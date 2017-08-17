import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

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
      <FormattedMessage id='scenes.settings.basicsecurity.explain' defaultMessage='Basic security: Make sure your details are accurate and up to date to keep your wallet safe from unauthorized access' />
      <FormattedMessage id='scenes.settings.basicsecurity.explain2' defaultMessage='and to help you restore access to your wallet in the case of a Wallet ID or password loss.' />
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
