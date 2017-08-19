import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import { Link, Text } from 'blockchain-info-components'

const TermsContainer = styled.div`
  & > * { display: inline-block; margin-right: 5px; }
`
const Terms = () => (
  <TermsContainer >
    <Text size='12px' weight={300}>
      <FormattedMessage id='scenes.register.registerform.read' defaultMessage='I have read and agree to the' />
    </Text>
    <Link href='https://blockchain.info/Resources/TermsofServicePolicy.pdf' target='_blank' size='12px' weight={300}>
      <FormattedMessage id='scenes.register.registerform.terms' defaultMessage='Terms of Service' />
    </Link>
  </TermsContainer>
)

export default Terms
