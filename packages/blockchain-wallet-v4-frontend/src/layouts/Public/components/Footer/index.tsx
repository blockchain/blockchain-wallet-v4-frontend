import React from 'react'
import styled from 'styled-components'

import CreateAccount from './CreateAccount'
import DropdownLanguage from './DropdownLanguage'
import Exchange from './Exchange'
import Help from './Help'
import Version from './Version'

const FooterInner = styled.div`
  padding: 2rem;
  padding-bottom: 0;
`

const Footer = ({ isFirstLoginStep, isSecondLoginStep }: Props) => {
  return (
    <>
      <FooterInner>
        {isFirstLoginStep ? <Exchange /> : isSecondLoginStep ? <CreateAccount /> : null}
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
  isFirstLoginStep: boolean
  isSecondLoginStep: boolean
}

export default Footer
