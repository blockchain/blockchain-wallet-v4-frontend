import { Box } from 'components/Box'
import {
  Button,
  Icon,
  Text,
  TooltipHost,
  TooltipIcon
} from 'blockchain-info-components'
import { FormattedMessage } from 'react-intl'
import { prop } from 'ramda'
import CoinDisplay from 'components/Display/CoinDisplay'
import FiatDisplay from 'components/Display/FiatDisplay'

import { Props } from '.'

import React, { ReactElement } from 'react'
import styled from 'styled-components'

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
const IneligibleText = styled.div`
  color: ${props => props.theme.grey500};
`

function SummaryCard (props: Props): ReactElement {
  const {
    interestAccountBalance,
    interestActions,
    interestEligible,
    // @ts-ignore PHIL HELP
    interestRate,
    // @ts-ignore PHIL HELP
    isGoldTier,
    modalActions,
    showInterestInfoBox
  } = props

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
          Bitcoin
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
            id='scenes.earninterest.form.earn3percent'
            defaultMessage='Earn up to {interestRate}% AER on your BTC.'
            // TODO make this more coin interchangeable
            values={{ interestRate: prop('BTC', interestRate) }}
          />
        </Text>
      </Row>
      <Separator />
      <AmountRow>
        <AmountColumn>
          <FiatDisplay
            color='grey800'
            size='16px'
            weight={600}
            coin='BTC'
            style={{ lineHeight: '1.5' }}
          >
            {interestAccountBalance.BTC.balance}
          </FiatDisplay>
          <CoinDisplay coin='BTC' size='12px' style={{ lineHeight: '1.5' }}>
            {interestAccountBalance.BTC.balance}
          </CoinDisplay>
        </AmountColumn>
        <AmountColumn>
          <FiatDisplay
            color='grey800'
            size='16px'
            weight={600}
            coin='BTC'
            style={{ lineHeight: '1.5' }}
          >
            {interestAccountBalance.BTC.totalInterest}
          </FiatDisplay>
          <Text size='12px' style={{ lineHeight: '1.5' }}>
            Total Interest Earned
          </Text>
        </AmountColumn>
      </AmountRow>
      {interestAccountBalance.BTC.balance ? (
        <Button
          style={{ marginTop: '16px' }}
          nature='light'
          data-e2e='viewInterestDetails'
          fullwidth
          onClick={() => interestActions.showInterestModal('DETAILS')}
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
          onClick={() => modalActions.showModal('INTEREST_MODAL')}
        >
          <FormattedMessage
            id='scenes.earninterest.form.earnbutton'
            defaultMessage='Earn Interest'
          />
        </Button>
      )}
      {!interestEligible.eligible && <IneligibleText>TODO</IneligibleText>}
    </DepositBox>
  )
}

export default SummaryCard
