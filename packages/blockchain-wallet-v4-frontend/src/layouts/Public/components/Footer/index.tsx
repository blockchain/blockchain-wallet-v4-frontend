import React from 'react'
import styled from 'styled-components'

import { LoginSteps, PlatformTypes, ProductAuthMetadata } from 'data/types'

import CreateAccount from './CreateAccount'
import DropdownLanguage from './DropdownLanguage'
import Help from './Help'
import ProductPicker from './ProductPicker'
import Version from './Version'

const FooterInner = styled.div`
  padding: 2rem;
  padding-bottom: 0;
`

const Footer = ({ isLogin, loginStep, productAuthMetadata }: Props) => {
  return (
    <>
      <FooterInner>
        {isLogin && <ProductPicker productAuthMetadata={productAuthMetadata} />}
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
  isLogin: boolean
  loginStep: LoginSteps
  productAuthMetadata: ProductAuthMetadata
}

export default Footer
