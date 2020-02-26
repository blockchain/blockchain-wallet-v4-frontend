import { FormattedHTMLMessage, FormattedMessage } from 'react-intl'
import React from 'react'
import styled from 'styled-components'

import { Link, Text } from 'blockchain-info-components'

const TermsContainer = styled.div`
  & > * {
    display: inline-block;
  }
`
const Terms = props => {
  const { company, recovery } = props
  switch (company) {
    case 'shapeshift':
      return (
        <TermsContainer>
          <Text size='12px' weight={400}>
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
            weight={500}
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
          <Text size='12px' weight={400}>
            <FormattedMessage
              id='buysellexchangedata.create.accept.terms'
              defaultMessage="I accept Blockchain's "
            />
          </Text>
          <span>&nbsp;</span>
          <Link
            size='12px'
            weight={500}
            href='https://www.blockchain.com/terms/index.html'
            target='_blank'
          >
            <FormattedMessage
              id='components.terms.bc.tos'
              defaultMessage='Terms of Service'
            />
          </Link>
          <span>,</span>
          <span>&nbsp;</span>
          <Text size='12px' weight={400}>
            {`Coinify's`}
          </Text>
          <span>&nbsp;</span>
          <Link
            size='12px'
            weight={500}
            href='https://www.coinify.com/legal'
            target='_blank'
          >
            <FormattedMessage
              id='components.terms.coinify.tos'
              defaultMessage='Terms of Service'
            />
          </Link>
          <span>&nbsp;</span>
          {`&`}
          <span>&nbsp;</span>
          <Link
            size='12px'
            weight={500}
            href='https://www.coinify.com/legal/policy'
            target='_blank'
          >
            <FormattedMessage
              id='components.terms.coinify.privacypolicy'
              defaultMessage='Privacy Policy.'
            />
          </Link>
        </TermsContainer>
      )
    case 'sfox':
      return (
        <TermsContainer>
          <Text size='12px' weight={400}>
            <FormattedMessage
              id='buysellexchangedata.create.accept.terms'
              defaultMessage="I accept Blockchain's "
            />
          </Text>
          <span>&nbsp;</span>
          <Link
            size='12px'
            weight={500}
            href='https://www.blockchain.com/terms/index.html'
            target='_blank'
          >
            <FormattedMessage
              id='components.terms.bc.sfox.tos'
              defaultMessage='Terms of Service'
            />
          </Link>
          <span>,</span>
          <span>&nbsp;</span>
          <Text size='12px' weight={400}>
            {`SFOX's`}
          </Text>
          <span>&nbsp;</span>
          <Link
            size='12px'
            weight={500}
            href='https://www.sfox.com/terms.html'
            target='_blank'
          >
            <FormattedMessage
              id='components.terms.sfox.tos'
              defaultMessage='Terms of Service'
            />
          </Link>
          <span>&nbsp;</span>
          {`&`}
          &nbsp;
          <Link
            size='12px'
            weight={500}
            href='https://www.sfox.com/privacy.html'
            target='_blank'
          >
            <FormattedMessage
              id='components.terms.sfox.privacypolicy'
              defaultMessage='Privacy Policy.'
            />
          </Link>
        </TermsContainer>
      )
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
          {`&`}
          &nbsp;
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
    case 'blockchain-loan-agreement':
      return (
        <TermsContainer>
          <Text size='13px' weight={500} color='grey600'>
            <FormattedMessage
              id='scenes.borrow.terms.read'
              defaultMessage='I have read and agreed to the'
            />
          </Text>
          <span>&nbsp;</span>
          <Link
            href='https://www.blockchain.com/legal/terms'
            target='_blank'
            size='13px'
            weight={500}
            data-e2e='blockchainTermsLink'
          >
            <FormattedMessage
              id='scenes.borrow.terms.default.loan'
              defaultMessage='Loan Agreement'
            />
          </Link>
        </TermsContainer>
      )
    case 'blockchain-loan-transfer':
      return (
        <TermsContainer>
          <Text size='13px' weight={500} color='grey600'>
            <FormattedHTMLMessage
              id='scenes.borrow.transferterms.read'
              defaultMessage='By accepting this, you agree to transfer <b>{amount}</b> from your wallet to Blockchain.com. The BTC amount will be returned after the loan is repaid in full.'
              values={{ amount: props.amount }}
            />
          </Text>
        </TermsContainer>
      )
    default:
      return (
        <TermsContainer style={{ paddingLeft: '4px', margin: '8px 0' }}>
          {recovery ? (
            <Text color='grey800' size='12px' weight={500}>
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
            <FormattedMessage
              id='scenes.register.registerform.blockchain.default.privacypolicy'
              defaultMessage='Privacy Policy.'
            />
          </Link>
        </TermsContainer>
      )
  }
}

export default Terms
