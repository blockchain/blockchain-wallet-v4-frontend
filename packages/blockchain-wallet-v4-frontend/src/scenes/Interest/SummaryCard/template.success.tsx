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
import { convertBaseToStandard } from 'data/components/exchange/services'
import FiatDisplay from 'components/Display/FiatDisplay'

import { Props as OwnProps, SuccessStateType } from '.'

const DepositBox = styled(Box)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 225px;
  width: 275px;
  margin-bottom: 24px;
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

function SummaryCard (props: OwnProps & SuccessStateType): ReactElement {
  const {
    coin,
    interestAccountBalance,
    interestActions,
    interestEligible,
    interestRate,
    isGoldTier,
    supportedCoins,
    walletCurrency
  } = props
  const { coinTicker, colorCode, displayName, icons } = supportedCoins[coin]
  const account = interestAccountBalance && interestAccountBalance[coin]
  const accountBalanceBase = account ? account.balance : 0
  const interestBalanceBase = account && account.totalInterest
  const accountBalanceStandard = convertBaseToStandard(coin, accountBalanceBase)
  const interestBalanceStandard = convertBaseToStandard(
    coin,
    interestBalanceBase
  )
  return (
    <DepositBox>
      <Row>
        <Icon name={icons.circleFilled} color={colorCode} size='32px' />
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
          {accountBalanceBase > 0 ? (
            <FormattedMessage
              id='scenes.interest.summarycard.earning'
              defaultMessage='Earning up to {interestRate}% annually on your {coinTicker}.'
              values={{
                coinTicker,
                interestRate: interestRate[coinTicker]
              }}
            />
          ) : (
            <FormattedMessage
              id='scenes.interest.summarycard.earn'
              defaultMessage='Earn up to {interestRate}% annually on your {coinTicker}.'
              values={{
                coinTicker,
                interestRate: interestRate[coinTicker]
              }}
            />
          )}
        </Text>
      </Row>
      <Separator />
      <AmountRow>
        <AmountColumn>
          <Text
            size='12px'
            weight={500}
            style={{ lineHeight: '1.5', marginTop: '5px' }}
            color='grey600'
          >
            <FormattedMessage
              id='modals.interest.detailsbalance'
              defaultMessage='{coin} Balance'
              values={{ coin }}
            />
          </Text>
          <Text
            data-e2e='btcBalance'
            size='14px'
            weight={600}
            style={{ lineHeight: '1.5' }}
          >
            {accountBalanceStandard} {coinTicker}
          </Text>
          <FiatDisplay
            color='grey600'
            coin={coinTicker}
            currency={walletCurrency}
            loadingHeight='24px'
            size='12px'
            style={{ lineHeight: '1.5' }}
            weight={500}
          >
            {accountBalanceBase}
          </FiatDisplay>
        </AmountColumn>
        <AmountColumn>
          <Text
            size='12px'
            weight={500}
            style={{ lineHeight: '1.5', marginTop: '5px' }}
            color='grey600'
          >
            <FormattedMessage
              id='scenes.interest.summarycard.totalinterest'
              defaultMessage='Total Interest Earned'
            />
          </Text>
          <Text
            data-e2e='btcInterest'
            size='14px'
            weight={600}
            style={{ lineHeight: '1.5' }}
          >
            {interestBalanceStandard} {coinTicker}
          </Text>
          <FiatDisplay
            color='grey600'
            coin={coinTicker}
            currency={walletCurrency}
            loadingHeight='24px'
            size='12px'
            style={{ lineHeight: '1.5' }}
            weight={500}
          >
            {interestBalanceBase}
          </FiatDisplay>
        </AmountColumn>
      </AmountRow>
      {accountBalanceBase > 0 ? (
        <Button
          disabled={!isGoldTier || !interestEligible.eligible}
          style={{ marginTop: '16px' }}
          nature='primary'
          data-e2e='viewInterestDetails'
          fullwidth
          onClick={() =>
            interestActions.showInterestModal('ACCOUNT_SUMMARY', coin)
          }
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
          onClick={() =>
            interestActions.showInterestModal('ACCOUNT_SUMMARY', coin)
          }
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
              defaultMessage='Blockchain Interest Account is currently not available in your country or region.'
            />{' '}
            <Link
              size='12px'
              weight={500}
              target='_blank'
              href='https://blockchain.zendesk.com/hc/en-us/articles/360043221472'
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
