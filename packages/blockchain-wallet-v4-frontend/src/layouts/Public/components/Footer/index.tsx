import React from 'react'
import styled from 'styled-components'

import { LoginParam } from 'data/types'

import CreateAccount from './CreateAccount'
import DropdownLanguage from './DropdownLanguage'
import Help from './Help'
import Version from './Version'

const FooterInner = styled.div`
  padding: 2rem;
  padding-bottom: 0;
`

const Footer = ({ isLogin, loginParam }: Props) => {
  return (
    <>
      <FooterInner>{isLogin ? <CreateAccount loginParam={loginParam} /> : null}</FooterInner>
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
  loginParam: LoginParam
}

export default Footer
