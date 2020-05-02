import { Box } from 'components/Box'
import {
  Button,
  Icon,
  Link,
  Text,
  TooltipHost,
  TooltipIcon
} from 'blockchain-info-components'
import { FormattedMessage } from 'react-intl'
import { prop } from 'ramda'
import FiatDisplay from 'components/Display/FiatDisplay'

import { Props as OwnProps, SuccessStateType } from '.'

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
    interestAccountBalance,
    interestActions,
    interestEligible,
    interestRate,
    isGoldTier,
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
            currency='USD'
            coin='BTC'
            style={{ lineHeight: '1.5' }}
          >
            {interestAccountBalance.BTC && interestAccountBalance.BTC.balance}
          </FiatDisplay>
          <Text size='12px' style={{ lineHeight: '1.5' }}>
            {interestAccountBalance.BTC && interestAccountBalance.BTC.balance}{' '}
            BTC
          </Text>
        </AmountColumn>
        <AmountColumn>
          <Text
            size='16px'
            color='grey800'
            weight={600}
            style={{ lineHeight: '1.5' }}
          >
            $0
          </Text>
          <Text size='12px' style={{ lineHeight: '1.5' }}>
            Total Interest Earned
          </Text>
        </AmountColumn>
      </AmountRow>
      {interestAccountBalance.BTC && interestAccountBalance.BTC.balance > 0 ? (
        <Button
          style={{ marginTop: '16px' }}
          nature='light'
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
            id='scenes.earninterest.form.earnbutton'
            defaultMessage='Earn Interest'
          />
        </Button>
      )}
      {!interestEligible.eligible &&
        interestEligible.ineligibilityReason === 'REGION' && (
          <AbsoluteWarningRegion size='12px' weight={500} color='grey600'>
            <Icon name='info' color='grey600' />
            <div style={{ marginLeft: '8px' }}>
              <FormattedMessage
                id='scenes.earninterest.userblocked'
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
              id='scenes.earninterest.userblocked.bo'
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
