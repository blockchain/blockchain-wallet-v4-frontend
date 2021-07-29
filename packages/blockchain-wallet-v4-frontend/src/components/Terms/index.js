import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Link, Text } from 'blockchain-info-components'

const TermsContainer = styled.div`
  & > * {
    display: inline-block;
  }
`
const Terms = (props) => {
  const { company, recovery } = props
  switch (company) {
    case 'blockchain-kyc':
      return (
        <TermsContainer>
          <Text size='12px' weight={400}>
            <FormattedMessage
              id='scenes.register.registerform.blockchainkyc.read'
              defaultMessage='By hitting continue, I agree to Blockchain’s'
            />
            &nbsp;
          </Text>
          <Link
            href='https://www.blockchain.com/legal/terms'
            tabIndex='-1'
            target='_blank'
            size='12px'
            weight={500}
          >
            <FormattedMessage
              id='scenes.register.registerform.blockchain.terms'
              defaultMessage='Terms of Service'
            />
            &nbsp;
          </Link>
          & &nbsp;
          <Link
            href='https://www.blockchain.com/legal/privacy'
            tabIndex='-1'
            target='_blank'
            size='12px'
            weight={500}
          >
            <FormattedMessage
              id='scenes.register.registerform.blockchain.privacypolicy'
              defaultMessage='Privacy Policy.'
            />
          </Link>
        </TermsContainer>
      )
    default:
      return (
        <TermsContainer style={{ paddingLeft: '4px' }}>
          {recovery ? (
            <Text color='grey800' size='12px' weight={500} style={{ margin: '4px 0' }}>
              <FormattedMessage
                id='scenes.register.registerform.blockchain.read-recovery'
                defaultMessage='By recovering an account, you agree to Blockchain’s'
              />
            </Text>
          ) : (
            <Text color='grey800' size='12px' weight={500}>
              <FormattedMessage
                id='scenes.register.registerform.blockchain.read_1'
                defaultMessage='By creating an account, you agree to Blockchain’s'
              />
            </Text>
          )}
          <span>&nbsp;</span>
          <Link
            href='https://www.blockchain.com/legal/terms'
            target='_blank'
            size='12px'
            weight={500}
            data-e2e='blockchainTermsLink'
          >
            <FormattedMessage
              id='scenes.register.registerform.blockchain.default.terms'
              defaultMessage='Terms of Service'
            />
          </Link>
          &nbsp;
          <Text color='grey800' size='12px' weight={500}>
            &
          </Text>
          &nbsp;
          <Link
            href='https://www.blockchain.com/legal/privacy'
            target='_blank'
            size='12px'
            weight={500}
            data-e2e='blockchainPrivacyLink'
          >
            <FormattedMessage id='copy.privacy_policy' defaultMessage='Privacy Policy' />
          </Link>
          .
        </TermsContainer>
      )
  }
}

export default Terms
