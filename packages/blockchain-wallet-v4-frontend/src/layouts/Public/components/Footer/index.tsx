import React from 'react'
import styled from 'styled-components'

import { ProductAuthMetadata } from 'data/types'

import CreateAccount from './CreateAccount'
import DropdownLanguage from './DropdownLanguage'
import Help from './Help'
import ProductPicker from './ProductPicker'
import Version from './Version'

const FooterInner = styled.div`
  padding: 2rem;
  padding-bottom: 0;
`

const Footer = ({ isLogin, productAuthMetadata }: Props) => {
  return (
    <>
      <FooterInner>
        {isLogin ? <CreateAccount productAuthMetadata={productAuthMetadata} /> : null}
        {/* TODO: figure out when to show this */}
        {/* <ProductPicker /> */}
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
  productAuthMetadata: ProductAuthMetadata
}

export default Footer
