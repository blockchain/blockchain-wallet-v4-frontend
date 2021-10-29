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
        {isLogin && loginStep === LoginSteps.ENTER_EMAIL_GUID && (
          <CreateAccount productAuthMetadata={productAuthMetadata} />
        )}
        {isLogin &&
          productAuthMetadata.platform === PlatformTypes.WEB &&
          (loginStep === LoginSteps.ENTER_PASSWORD_WALLET ||
            loginStep === LoginSteps.ENTER_PASSWORD_EXCHANGE) && (
            <ProductPicker productAuthMetadata={productAuthMetadata} />
          )}
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
