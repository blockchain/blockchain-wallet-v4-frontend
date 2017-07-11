import React from 'react'
import styled from 'styled-components'

import { Link } from 'components/generic/Link'
import { Text } from 'components/generic/Text'

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
  border: 1px solid #CDCDCD;
`

const Footer = () => {
  return (
    <Wrapper>
      <Link href='https://blockchain.info/Resources/TermsofServicePolicy.pdf' target='_blank'>
        <Text id='components.layouts.wallet.menuleft.footer.termsofservice' text='ToS' smaller light />
      </Link>
      <Circle />
      <Link href='https://www.blockchain.com/assets/pdf/Blockchain_PrivacyPolicy.pdf' target='_blank' className='text-capitalize'>
        <Text id='components.layouts.wallet.menuleft.footer.privacypolicy' text='Privacy policy' smaller light />
      </Link>
      <Circle />
      <Link href='https://www.blockchain.com/about' target='_blank'>
        <Text id='components.layouts.wallet.menuleft.footer.about' text='About' smaller light />
      </Link>
    </Wrapper>
  )
}

export default Footer
