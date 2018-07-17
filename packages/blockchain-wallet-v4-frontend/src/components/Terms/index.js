import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import { Link, Text } from 'blockchain-info-components'

const TermsContainer = styled.div`
  & > * {
    display: inline-block;
  }
`
const Terms = props => {
  const { company } = props
  switch (company) {
    case 'shapeshift':
      return (
        <TermsContainer>
          <Text size='12px' weight={300}>
            <FormattedMessage
              id='scenes.register.registerform.shapeshift.read'
              defaultMessage="I agree to ShapeShift's"
            />
          </Text>
          <span>&nbsp;</span>
          <Link
            href='https://info.shapeshift.io/sites/default/files/ShapeShift_Terms_Conditions%20v1.1.pdf'
            target='_blank'
            size='12px'
            weight={300}
          >
            <FormattedMessage
              id='scenes.register.registerform.shapeshift.terms'
              defaultMessage='terms and conditions'
            />
          </Link>
        </TermsContainer>
      )
    case 'coinify':
      return (
        <TermsContainer>
          <Text size='12px' weight={300}>
            <FormattedMessage
              id='buysellexchangedata.create.accept.terms'
              defaultMessage="I accept Blockchain's "
            />
          </Text>
          <span>&nbsp;</span>
          <Link
            size='12px'
            weight={300}
            href='https://www.blockchain.com/terms/index.html'
            target='_blank'
          >
            <FormattedMessage id='tos' defaultMessage='Terms of Service' />
          </Link>
          <span>,</span>
          <span>&nbsp;</span>
          <Text size='12px' weight={300}>
            {`Coinify's`}
          </Text>
          <span>&nbsp;</span>
          <Link
            size='12px'
            weight={300}
            href='https://www.coinify.com/legal'
            target='_blank'
          >
            <FormattedMessage id='tos' defaultMessage='Terms of Service' />
          </Link>
          <span>&nbsp;</span>
          {`&`}
          <span>&nbsp;</span>
          <Link
            size='12px'
            weight={300}
            href='https://www.coinify.com/legal/policy'
            target='_blank'
          >
            <FormattedMessage
              id='privacypolicy'
              defaultMessage='Privacy Policy.'
            />
          </Link>
        </TermsContainer>
      )
    case 'sfox':
      return (
        <TermsContainer>
          <Text size='12px' weight={300}>
            <FormattedMessage
              id='buysellexchangedata.create.accept.terms'
              defaultMessage="I accept Blockchain's "
            />
          </Text>
          <span>&nbsp;</span>
          <Link
            size='12px'
            weight={300}
            href='https://www.blockchain.com/terms/index.html'
            target='_blank'
          >
            <FormattedMessage id='tos' defaultMessage='Terms of Service' />
          </Link>
          <span>,</span>
          <span>&nbsp;</span>
          <Text size='12px' weight={300}>
            {`SFOX's`}
          </Text>
          <span>&nbsp;</span>
          <Link
            size='12px'
            weight={300}
            href='https://www.sfox.com/terms.html'
            target='_blank'
          >
            <FormattedMessage id='tos' defaultMessage='Terms of Service' />
          </Link>
          <span>&nbsp;</span>
          {`&`}
          &nbsp;
          <Link
            size='12px'
            weight={300}
            href='https://www.sfox.com/privacy.html'
            target='_blank'
          >
            <FormattedMessage
              id='privacypolicy'
              defaultMessage='Privacy Policy.'
            />
          </Link>
        </TermsContainer>
      )
    default:
      return (
        <TermsContainer>
          <Text size='12px' weight={300}>
            <FormattedMessage
              id='scenes.register.registerform.blockchain.read'
              defaultMessage='I have read and agreed to the'
            />
          </Text>
          <span>&nbsp;</span>
          <Link
            href='https://www.blockchain.com/terms/index.html'
            target='_blank'
            size='12px'
            weight={300}
          >
            <FormattedMessage
              id='scenes.register.registerform.blockchain.terms'
              defaultMessage='Terms of Service'
            />
          </Link>
        </TermsContainer>
      )
  }
}

export default Terms
