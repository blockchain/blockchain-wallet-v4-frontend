import React from 'react'
import styled from 'styled-components'

import { ProductAuthOptions } from 'data/types'

import DropdownLanguage from './DropdownLanguage'
import Help from './Help'
import InstitutionalPortal from './InstitutionalPortal'
import Version from './Version'

const FooterInner = styled.div`
  padding: 2rem;
  padding-bottom: 0;
`

const Footer = (props) => {
  return (
    <>
      {props.authProduct === ProductAuthOptions.EXCHANGE && (
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
}

export default Footer
