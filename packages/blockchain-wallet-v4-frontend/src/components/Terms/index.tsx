import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Link, Text } from 'blockchain-info-components'

const TermsContainer = styled.div<{ inline?: boolean }>`
  & > * {
    display: ${(props) => (props.inline ? 'inline' : 'inline-block')};
  }
`

type Props = {
  company?: string
  recovery?: boolean
}

const Terms = ({ company, recovery }: Props) => {
  switch (company) {
    case 'blockchain-kyc':
      return (
        <TermsContainer>
          <Text size='12px' weight={400}>
            <FormattedMessage
              id='scenes.register.registerform.blockchainkyc.read'
              defaultMessage='By hitting continue, I agree to Blockchain.com’s'
            />
            &nbsp;
          </Text>
          <Link
            href='https://www.blockchain.com/legal/terms'
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
    case 'sofi':
      return (
        <TermsContainer style={{ paddingLeft: '4px' }} inline>
          <Text color='grey800' size='12px' weight={500}>
            <FormattedMessage
              id='scenes.register.registerform.blockchain.read_1'
              defaultMessage='By checking this box, I acknowledge that I have read and accept the Blockchain.com'
            />
          </Text>
          <Link
            href='https://www.blockchain.com/legal/terms'
            target='_blank'
            size='12px'
            weight={500}
            data-e2e='blockchainTermsLink'
          >
            <FormattedMessage
              id='scenes.register.registerform.blockchain.terms'
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
    case 'sofi-bakkt':
      return (
        <TermsContainer style={{ paddingLeft: '4px' }} inline>
          <Text color='grey800' size='12px' weight={500}>
            <FormattedMessage
              id='scenes.register.registerform.blockchain.bakkt'
              defaultMessage='By checking this box, I hereby agree to the terms and conditions laid out in the Bakkt User Agreement provided below. By so agreeing, I understand that the information I am providing will be used to create my new account application to Bakkt Crypto Solutions, LLC and Bakkt Marketplace, LLC for purposes of opening and maintaining an account.'
            />
          </Text>
          <Link
            href='https://www.blockchain.com/en/legal/bakkt/terms'
            target='_blank'
            size='12px'
            weight={500}
            data-e2e='bakktTermsLink'
          >
            <FormattedMessage
              id='scenes.register.registerform.bakkt.terms'
              defaultMessage='Bakkt’s User Agreement.'
            />
          </Link>
          .
        </TermsContainer>
      )
    default:
      return (
        <TermsContainer style={{ paddingLeft: recovery ? 0 : '4px' }}>
          {recovery ? (
            <Text color='grey800' size='12px' weight={500} style={{ margin: '4px 0' }}>
              <FormattedMessage
                id='scenes.register.registerform.blockchain.read-recovery'
                defaultMessage='By recovering an account, you agree to Blockchain.com’s'
              />
            </Text>
          ) : (
            <Text color='grey800' size='12px' weight={500}>
              <FormattedMessage
                id='scenes.register.registerform.blockchain.read_1'
                defaultMessage='By creating an account, you agree to Blockchain.com’s'
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
              id='scenes.register.registerform.blockchain.terms'
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
