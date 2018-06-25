import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import { Link } from 'blockchain-info-components'

const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-around;
`
const Circle = styled.div`
  display: block;
  width: 10px;
  height: 10px;
  border-radius: 5px;
  background: ${props => props.theme['gray-2']};
`

const Footer = () => {
  return (
    <Wrapper>
      <Link href='https://www.blockchain.com/terms/index.html' target='_blank' size='13px' weight={300} color='gray-5'>
        <FormattedMessage id='layouts.wallet.menuleft.footer.termsofservice' defaultMessage='ToS' />
      </Link>
      <Circle />
      <Link href='https://www.blockchain.com/privacy/index.html' target='_blank' size='13px' weight={300} color='gray-5'>
        <FormattedMessage id='layouts.wallet.menuleft.footer.privacypolicy' defaultMessage='Privacy Policy' />
      </Link>
      <Circle />
      <Link href='https://www.blockchain.com/about' target='_blank' size='13px' weight={300} color='gray-5'>
        <FormattedMessage id='layouts.wallet.menuleft.footer.about' defaultMessage='About' />
      </Link>
    </Wrapper>
  )
}

export default Footer
