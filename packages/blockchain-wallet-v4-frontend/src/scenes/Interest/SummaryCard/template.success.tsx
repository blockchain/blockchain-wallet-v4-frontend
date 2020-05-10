import { FormattedMessage } from 'react-intl'
import React, { ReactElement } from 'react'
import styled from 'styled-components'

import { Box } from 'components/Box'
import {
  Button,
  Icon,
  Link,
  Text,
  TooltipHost,
  TooltipIcon
} from 'blockchain-info-components'
import FiatDisplay from 'components/Display/FiatDisplay'

import { Exchange } from 'core'
import { Props as OwnProps, SuccessStateType } from '.'

const DepositBox = styled(Box)<{ showInterestInfoBox: boolean }>`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: ${props => (props.showInterestInfoBox ? 'auto' : '200px')};
`
const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
`
const AmountRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`
const AmountColumn = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
`
const Separator = styled.div`
  border: solid 1px ${props => props.theme.grey000};
`
const AbsoluteWarning = styled(Text)`
  display: flex;
  align-items: center;
  position: absolute;
  bottom: -40px;
  left: 0;
`
const AbsoluteWarningRegion = styled(Text)`
  display: flex;
  align-items: center;
  position: absolute;
  bottom: -60px;
  left: 0;
`

// TODO: update support center links
function SummaryCard (props: OwnProps & SuccessStateType): ReactElement {
  const {
    coin,
    interestAccountBalance,
    interestActions,
    interestEligible,
    interestRate,
    isGoldTier,
    showInterestInfoBox,
    supportedCoins,
    walletCurrency
  } = props
  const { coinTicker, displayName } = supportedCoins[coin]
  const balanceSats =
    interestAccountBalance.BTC && interestAccountBalance.BTC.balance
  const balanceStandard = Exchange.convertCoinToCoin({
    value: balanceSats || 0,
    coin: 'BTC',
    baseToStandard: true
  }).value
  const totalInterest =
    interestAccountBalance.BTC && interestAccountBalance.BTC.totalInterest
  return (
    <DepositBox showInterestInfoBox={showInterestInfoBox}>
      <Row>
        <Icon name='btc-circle-filled' color='btc' size='32px' />
        <Text
          size='20px'
          color='grey800'
          weight={600}
          style={{ marginLeft: '8px', lineHeight: '1.5' }}
        >
          {displayName}
        </Text>
      </Row>
      <Row>
        <TooltipHost id='earninterest.calculation.tooltip'>
          <TooltipIcon name='info' size='14px' />
        </TooltipHost>
        <Text
          size='12px'
          weight={500}
          style={{ marginLeft: '6px', lineHeight: '1.5' }}
        >
          <FormattedMessage
            id='scenes.interest.summarycard.earn'
            defaultMessage='Earn up to {interestRate}% AER on your {coinTicker}.'
            values={{
              coinTicker,
              interestRate: interestRate[coinTicker]
            }}
          />
        </Text>
      </Row>
      <Separator />
      <AmountRow>
        <AmountColumn>
          <FiatDisplay
            color='grey800'
            coin={coinTicker}
            currency={walletCurrency}
            loadingHeight='24px'
            size='16px'
            style={{ lineHeight: '1.5' }}
            weight={600}
          >
            {balanceSats}
          </FiatDisplay>
          <Text size='12px' weight={500} style={{ lineHeight: '1.5' }}>
            {balanceStandard} {coinTicker}
          </Text>
        </AmountColumn>
        <AmountColumn>
          <FiatDisplay
            color='grey800'
            coin={coinTicker}
            currency={walletCurrency}
            loadingHeight='24px'
            size='16px'
            style={{ lineHeight: '1.5' }}
            weight={600}
          >
            {totalInterest}
          </FiatDisplay>
          <Text size='12px' weight={500} style={{ lineHeight: '1.5' }}>
            <FormattedMessage
              id='scenes.interest.summarycard.totalinterest'
              defaultMessage='Total Interest Earned'
            />
          </Text>
        </AmountColumn>
      </AmountRow>
      {balanceSats > 0 ? (
        <Button
          style={{ marginTop: '16px' }}
          nature='primary'
          data-e2e='viewInterestDetails'
          fullwidth
          onClick={() => interestActions.showInterestModal('ACCOUNT_SUMMARY')}
        >
          <FormattedMessage id='copy.view' defaultMessage='View' />
        </Button>
      ) : (
        <Button
          disabled={!isGoldTier || !interestEligible.eligible}
          style={{ marginTop: '16px' }}
          nature='primary'
          fullwidth
          data-e2e='earnInterest'
          onClick={() => interestActions.showInterestModal('ACCOUNT_SUMMARY')}
        >
          <FormattedMessage
            id='scenes.interest.summarycard.earnbutton'
            defaultMessage='Earn Interest'
          />
        </Button>
      )}
      {interestEligible.ineligibilityReason === 'REGION' && (
        <AbsoluteWarningRegion size='12px' weight={500} color='grey600'>
          <Icon name='info' color='grey600' />
          <div style={{ marginLeft: '8px' }}>
            <FormattedMessage
              id='scenes.interest.userblocked'
              defaultMessage='Blockchain Interest Account is currently unavailable in your country or region.'
            />{' '}
            <Link
              size='12px'
              weight={500}
              target='_blank'
              href='https://support.blockchain.com/hc/en-us'
            >
              <FormattedMessage
                id='buttons.learn_more'
                defaultMessage='Learn More'
              />
            </Link>
          </div>
        </AbsoluteWarningRegion>
      )}
      {interestEligible.ineligibilityReason === 'BLOCKED' && (
        <AbsoluteWarning size='12px' weight={500} color='grey600'>
          <Icon name='info' color='grey600' />
          <div style={{ marginLeft: '8px' }}>
            <FormattedMessage
              id='scenes.interest.userblocked.bo'
              defaultMessage='Blockchain Interest Account is currently not available.'
            />{' '}
            <Link
              size='12px'
              weight={500}
              target='_blank'
              href='https://support.blockchain.com/hc/en-us/requests/new?ticket_form_id=360000190032'
            >
              <FormattedMessage
                id='buttons.contact_support'
                defaultMessage='Contact Support'
              />
            </Link>
          </div>
        </AbsoluteWarning>
      )}
    </DepositBox>
  )
}

export default SummaryCard
