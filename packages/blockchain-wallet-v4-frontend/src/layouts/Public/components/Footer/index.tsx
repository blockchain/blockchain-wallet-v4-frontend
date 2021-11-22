import React from 'react'
import styled from 'styled-components'

import DropdownLanguage from './DropdownLanguage'
import Exchange from './Exchange'
import Help from './Help'
import Version from './Version'

const FooterInner = styled.div`
  padding: 2rem;
  padding-bottom: 0;
`

const Footer = ({ isLogin }: Props) => {
  return (
    <>
      <FooterInner>{isLogin && <Exchange />}</FooterInner>
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
