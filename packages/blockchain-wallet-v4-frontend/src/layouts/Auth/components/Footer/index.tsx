import React from 'react'
import styled from 'styled-components'

import { LoginSteps, PlatformTypes, ProductAuthOptions } from 'data/types'

import DropdownLanguage from './DropdownLanguage'
import Help from './Help'
import InstitutionalPortal from './InstitutionalPortal'
import Version from './Version'

const FooterInner = styled.div`
  padding: 2rem 2rem 0;
`

const Footer = (props) => {
  return (
    <>
      {props.authProduct === ProductAuthOptions.EXCHANGE &&
        props.formValues?.step !== LoginSteps.INSTITUTIONAL_PORTAL &&
        props.platform !== PlatformTypes.IOS &&
        props.platform !== PlatformTypes.ANDROID &&
        props.path === '/login' && (
          <FooterInner>
            <InstitutionalPortal />
          </FooterInner>
        )}
      <FooterInner>
        <DropdownLanguage color='grey400' size='16px' />
        <Version />
        <Help />
      </FooterInner>
    </>
  )
}

export default Footer
