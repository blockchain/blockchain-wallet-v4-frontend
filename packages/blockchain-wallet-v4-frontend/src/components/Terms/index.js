import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import { Link, Text } from 'blockchain-info-components'

const TermsContainer = styled.div`
  & > * {
    display: inline-block;
    margin-right: 3px;
  }
`
const Terms = (props) => {
  const { company } = props
  switch (company) {
    case 'shapeshift':
      return (
        <TermsContainer >
          <Text size='12px' weight={300}>
            <FormattedMessage id='scenes.register.registerform.shapeshift.read' defaultMessage='I agree to ShapeShift&#39;s' />
          </Text>
          <Link href='https://info.shapeshift.io/sites/default/files/ShapeShift_Terms_Conditions%20v1.1.pdf' target='_blank' size='12px' weight={300}>
            <FormattedMessage id='scenes.register.registerform.shapeshift.terms' defaultMessage='terms and conditions' />
          </Link>
        </TermsContainer>
      )
    default:
      return (
        <TermsContainer >
          <Text size='12px' weight={300}>
            <FormattedMessage id='scenes.register.registerform.blockchain.read' defaultMessage='I have read and agree to the&nbsp;' />
          </Text>
          <Link href='https://blockchain.info/Resources/TermsofServicePolicy.pdf' target='_blank' size='12px' weight={300}>
            <FormattedMessage id='scenes.register.registerform.blockchain.terms' defaultMessage='Terms of Service' />
          </Link>
        </TermsContainer>
      )
  }
}

export default Terms
