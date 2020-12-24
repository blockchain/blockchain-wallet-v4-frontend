import React from 'react'

import About from './About'
import LinkedBanks from './LinkedBanks'
import LinkedCards from './LinkedCards'
import PairingCode from './PairingCode'
import PrivacyPolicy from './PrivacyPolicy'
import TermsOfService from './TermsOfService'
import WalletId from './WalletId'

const General = () => {
  return (
    <section>
      <WalletId />
      <PairingCode />
      <LinkedBanks />
      <LinkedCards />
      <PrivacyPolicy />
      <TermsOfService />
      <About />
    </section>
  )
}

export default General
