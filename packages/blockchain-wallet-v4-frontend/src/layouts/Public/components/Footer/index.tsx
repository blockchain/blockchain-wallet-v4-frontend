import React from 'react'
import styled from 'styled-components'

import DropdownLanguage from './DropdownLanguage'
import Help from './Help'
import Version from './Version'

const FooterInner = styled.div`
  padding: 2rem;
  padding-bottom: 0;
`

const Footer = (props) => {
  return (
    <FooterInner>
      <DropdownLanguage color='grey400' size='16px' />
      <Version />
      <Help {...props} />
    </FooterInner>
  )
}

export default Footer
