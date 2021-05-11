import React from 'react'
import styled from 'styled-components'

import DropdownLanguage from './DropdownLanguage'
import ExchangeLogin from './ExchangeLogin'
import Help from './Help'
import Version from './Version'

const FooterInner = styled.div`
  padding: 2rem;
  padding-bottom: 0;
`

const Footer = ({ isLogin }: Props) => {
  return (
    <>
      <FooterInner>{isLogin ? <ExchangeLogin /> : null}</FooterInner>
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
}

export default Footer
