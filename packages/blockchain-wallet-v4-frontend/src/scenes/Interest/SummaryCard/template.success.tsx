import React, { ReactElement } from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Button, Icon, Text, TooltipHost, TooltipIcon } from 'blockchain-info-components'
import { Box } from 'components/Box'
import FiatDisplay from 'components/Display/FiatDisplay'
import { convertBaseToStandard } from 'data/components/exchange/services'

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
  border: solid 1px ${(props) => props.theme.grey000};
`

function SummaryCard(props: OwnProps & SuccessStateType): ReactElement {
  const {
    coin,
    interestAccountBalance,
    interestActions,
    interestEligible,
    interestRate,
    isGoldTier,
    walletCurrency
  } = props
  const displayName = window.coins[coin].coinfig.name
  const account = interestAccountBalance && interestAccountBalance[coin]
  const accountBalanceBase = account ? account.balance : 0
  const interestBalanceBase = account ? account.totalInterest : 0
  const accountBalanceStandard = convertBaseToStandard(coin, accountBalanceBase)
  const interestBalanceStandard = convertBaseToStandard(coin, interestBalanceBase)
  const interestEligibleCoin = interestEligible[coin] && interestEligible[coin]?.eligible

  return (
    <DepositBox>
      <Row>
        <Icon name={coin} color={coin} size='32px' />
        <Text
          size='20px'
          color='grey800'
          weight={600}
          style={{ lineHeight: '1.5', marginLeft: '8px' }}
        >
          {displayName}
        </Text>
      </Row>
      <Row>
        <TooltipHost id='earninterest.calculation.tooltip'>
          <TooltipIcon name='info' size='14px' />
        </TooltipHost>
        <Text size='12px' weight={500} style={{ lineHeight: '1.5', marginLeft: '6px' }}>
          {accountBalanceBase > 0 ? (
            <FormattedMessage
              id='scenes.interest.summarycard.earning'
              defaultMessage='Earning up to {interestRate}% annually on your {coinTicker}.'
              values={{
                coinTicker: coin,
                interestRate: interestRate[coin]
              }}
            />
          ) : (
            <FormattedMessage
              id='scenes.interest.summarycard.earn'
              defaultMessage='Earn up to {interestRate}% annually on your {coinTicker}.'
              values={{
                coinTicker: coin,
                interestRate: interestRate[coin]
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
          <Text data-e2e='btcBalance' size='14px' weight={600} style={{ lineHeight: '1.5' }}>
            {accountBalanceStandard} {coin}
          </Text>
          <FiatDisplay
            color='grey600'
            coin={coin}
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
          <Text data-e2e='btcInterest' size='14px' weight={600} style={{ lineHeight: '1.5' }}>
            {interestBalanceStandard} {coin}
          </Text>
          <FiatDisplay
            color='grey600'
            coin={coin}
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
          disabled={!isGoldTier || !interestEligibleCoin}
          style={{ marginTop: '16px' }}
          nature='primary'
          data-e2e='viewInterestDetails'
          fullwidth
          onClick={() => interestActions.showInterestModal({ coin, step: 'ACCOUNT_SUMMARY' })}
        >
          <FormattedMessage id='copy.view' defaultMessage='View' />
        </Button>
      ) : (
        <Button
          disabled={!isGoldTier || !interestEligibleCoin}
          style={{ marginTop: '16px' }}
          nature='primary'
          fullwidth
          data-e2e='earnInterest'
          onClick={() => interestActions.showInterestModal({ coin, step: 'ACCOUNT_SUMMARY' })}
        >
          <FormattedMessage
            id='scenes.interest.summarycard.earnbutton'
            defaultMessage='Earn Interest'
          />
        </Button>
      )}
    </DepositBox>
  )
}

export default SummaryCard
