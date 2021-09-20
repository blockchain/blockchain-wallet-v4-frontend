import React from 'react'
import styled from 'styled-components'

import { ProductAuthOptions } from 'data/types'

import CreateAccount from './CreateAccount'
import DropdownLanguage from './DropdownLanguage'
import Help from './Help'
import Version from './Version'

const FooterInner = styled.div`
  padding: 2rem;
  padding-bottom: 0;
`

const Footer = ({ designatedProduct, isLogin }: Props) => {
  return (
    <>
      <FooterInner>
        {isLogin ? <CreateAccount designatedProduct={designatedProduct} /> : null}
      </FooterInner>
      <FooterInner>
        <DropdownLanguage color='grey400' size='16px' />
        <Version />
        <Help />
      </FooterInner>
    </>
  )
}

type Props = {
  designatedProduct: ProductAuthOptions
  isLogin: boolean
}

export default Footer
