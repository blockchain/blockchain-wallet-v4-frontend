import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import { Link } from 'blockchain-info-components'

const Wrapper = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
`
const Circle = styled.div`
  display: block;
  width: 10px;
  height: 10px;
  border-radius: 5px;
  border: 1px solid ${props => props.theme['bordergrey']};
`

const Footer = () => {
  return (
    <Wrapper>
      <Link href='https://blockchain.info/Resources/TermsofServicePolicy.pdf' target='_blank' size='13px' weight={300} color='text'>
        <FormattedMessage id='layouts.wallet.menuleft.footer.termsofservice' defaultMessage='ToS' />
      </Link>
      <Circle />
      <Link href='https://www.blockchain.com/assets/pdf/Blockchain_PrivacyPolicy.pdf' target='_blank' size='13px' weight={300} color='text'>
        <FormattedMessage id='layouts.wallet.menuleft.footer.privacypolicy' defaultMessage='Privacy policy' />
      </Link>
      <Circle />
      <Link href='https://www.blockchain.com/about' target='_blank' size='13px' weight={300} color='text'>
        <FormattedMessage id='layouts.wallet.menuleft.footer.about' defaultMessage='About' />
      </Link>
    </Wrapper>
  )
}

export default Footer
