import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import { Link } from 'blockchain-info-components'

const TermsContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  & > * { margin-right: 5px; }
`
const Terms = () => (
  < TermsContainer >
    <FormattedMessage id='scenes.register.registerform.read' defaultMessage='I have read and agree to the' />
    <Link href='https://blockchain.info/Resources/TermsofServicePolicy.pdf' target='_blank'>
      <FormattedMessage id='scenes.register.registerform.terms' defaultMessage='Terms of Service' />
    </Link>
  </TermsContainer>
)

export default Terms
