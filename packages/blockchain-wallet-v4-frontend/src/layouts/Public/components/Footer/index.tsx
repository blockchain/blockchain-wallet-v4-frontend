import React from 'react'
import styled from 'styled-components'

import { LoginSteps, ProductAuthOptions } from 'data/types'

import DropdownLanguage from './DropdownLanguage'
import Help from './Help'
import InstitutionalPortal from './InstitutionalPortal'
import Version from './Version'

const FooterInner = styled.div`
  padding: 2rem 2rem 0;
`

const Footer = (props) => (
  <>
    {props.authProduct === ProductAuthOptions.EXCHANGE &&
      props.formValues?.step !== LoginSteps.INSTITUTIONAL_PORTAL && (
        <FooterInner>
          <InstitutionalPortal />
        </FooterInner>
      )}
    <FooterInner>
      <DropdownLanguage color='grey400' size='16px' />
      <Version />
      <Help {...props} />
    </FooterInner>
  </>
)

export default Footer
