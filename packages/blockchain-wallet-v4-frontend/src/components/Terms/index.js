import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Link, Text } from 'blockchain-info-components'
import CoinDisplay from 'components/Display/CoinDisplay'

const TermsContainer = styled.div`
  & > * {
    display: inline-block;
  }
`
const Terms = props => {
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
            href='https://www.blockchain.com/legal/borrow-terms'
            target='_blank'
            size='13px'
            weight={500}
            data-e2e='blockchainTermsLink'
          >
            <FormattedMessage
              id='scenes.borrow.terms.default.user'
              defaultMessage='User Agreement'
            />
          </Link>
        </TermsContainer>
      )
    case 'blockchain-loan-transfer':
      return (
        <TermsContainer>
          <Text size='13px' weight={500} color='grey600'>
            <FormattedMessage
              id='scenes.borrow.transferterms.read1'
              defaultMessage='By accepting this, you agree to transfer'
            />
          </Text>{' '}
          <CoinDisplay
            coin={props.coin}
            size='13px'
            color='grey700'
            weight={600}
          >
            {props.total}
          </CoinDisplay>{' '}
          <Text size='13px' weight={500} color='grey600'>
            <FormattedMessage
              id='scenes.borrow.transferterms.read2'
              defaultMessage='from your wallet to Blockchain.com. Your'
            />
          </Text>{' '}
          <CoinDisplay
            coin={props.coin}
            size='13px'
            color='grey700'
            weight={600}
          >
            {props.collateralAmt}
          </CoinDisplay>{' '}
          <Text size='13px' weight={500} color='grey600'>
            <FormattedMessage
              id='scenes.borrow.transferterms.read3'
              defaultMessage='collateral will be returned after your loan has been repaid minus any accrued interest and fees.'
            />{' '}
          </Text>
        </TermsContainer>
      )
    default:
      return (
        <TermsContainer style={{ paddingLeft: '4px' }}>
          {recovery ? (
            <Text
              color='grey800'
              size='12px'
              weight={500}
              style={{ margin: '4px 0' }}
            >
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
              id='copy.privacy_policy'
              defaultMessage='Privacy Policy'
            />
          </Link>
          .
        </TermsContainer>
      )
  }
}

export default Terms
