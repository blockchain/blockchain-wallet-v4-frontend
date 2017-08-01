import React from 'react'
import styled from 'styled-components'

import { Link } from 'components/generic/Link'
import { Text } from 'components/generic/Text'

const TermsContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  & > * { margin-right: 5px; }
`
const Terms = () => (
  < TermsContainer >
    <Text id='scenes.register.registerform.read' text='I have read and agree to the' small light />
    <Link href='https://blockchain.info/Resources/TermsofServicePolicy.pdf' target='_blank'>
      <Text id='scenes.register.registerform.terms' text='Terms of Service' small light cyan />
    </Link>
  </TermsContainer>
)

export default Terms
