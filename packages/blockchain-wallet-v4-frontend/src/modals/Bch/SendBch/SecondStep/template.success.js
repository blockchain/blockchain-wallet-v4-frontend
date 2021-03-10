import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import {
  Banner,
  Button,
  HeartbeatLoader,
  Link,
  Text
} from 'blockchain-info-components'
import CoinDisplay from 'components/Display/CoinDisplay'
import FiatDisplay from 'components/Display/FiatDisplay'
import {
  ExchangeAmount,
  ExchangeAmounts,
  LargeTableRow,
  SubExchangeAmount,
  Wrapper
} from 'components/Exchange'
import { CountdownTimer } from 'components/Form'

const ConfirmWrapper = styled(Wrapper)`
  padding: 0px;
`
const WarningBanner = styled.div`
  margin-top: 16px;
`
const SummaryExchangeAmount = styled(ExchangeAmount)`
  justify-content: flex-end;
`
const SummarySubExchangeAmount = styled(SubExchangeAmount)`
  justify-content: flex-end;
`
const TextTo = styled(Text)`
  max-width: 60%;
  text-align: right;
  word-break: break-all;
`
const Footer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  margin-top: 16px;
  width: 100%;

  & > :first-child {
    margin-bottom: 15px;
  }
`

const Success = props => {
  const {
    amount,
    coin,
    description,
    fee,
    fromAddress,
    handleBack,
    handleBitPayInvoiceExpiration,
    handleSubmit,
    isLegacy,
    payPro,
    submitting,
    toAddress,
    total
  } = props

  return (
    <React.Fragment>
      {payPro && (
        <CountdownTimer
          expiryDate={payPro.expiration}
          handleExpiry={handleBitPayInvoiceExpiration}
          hideTooltip
          payProInvoice
        />
      )}
      <ConfirmWrapper>
        <LargeTableRow>
          <Text size='16px' weight={500}>
            <FormattedMessage id='copy.from:' defaultMessage='From:' />
          </Text>
          <Text size='16px' weight={400} data-e2e='bchFromWallet'>
            {fromAddress}
          </Text>
        </LargeTableRow>
        <LargeTableRow>
          <Text size='16px' weight={500}>
            <FormattedMessage
              id='modals.sendbch.secondstep.to'
              defaultMessage='To:'
            />
          </Text>
          <TextTo size='16px' weight={400} data-e2e='bchToAddress'>
            {payPro ? `BitPay[${payPro.merchant}]` : toAddress}
          </TextTo>
        </LargeTableRow>
        {description && (
          <LargeTableRow>
            <Text size='16px' weight={500}>
              <FormattedMessage
                id='modals.sendbch.secondstep.note'
                defaultMessage='Note:'
              />
            </Text>
            <Text size='16px' weight={400} data-e2e='bchSendDescription'>
              {description}
            </Text>
          </LargeTableRow>
        )}
        <LargeTableRow>
          <Text size='16px' weight={500}>
            <FormattedMessage id='copy.amount' defaultMessage='Amount:' />
          </Text>
          <ExchangeAmounts>
            <SummaryExchangeAmount>
              <FiatDisplay size='16px' weight={500} coin={coin}>
                {amount}
              </FiatDisplay>
            </SummaryExchangeAmount>
            <SummarySubExchangeAmount>
              <CoinDisplay size='14px' weight={300} coin={coin}>
                {amount}
              </CoinDisplay>
            </SummarySubExchangeAmount>
          </ExchangeAmounts>
        </LargeTableRow>
        <LargeTableRow>
          <Text size='16px' weight={500}>
            <FormattedMessage
              id='modals.sendbch.secondstep.fee'
              defaultMessage='Fee:'
            />
          </Text>
          <ExchangeAmounts>
            <SummaryExchangeAmount>
              <FiatDisplay size='16px' weight={500} coin={coin}>
                {fee}
              </FiatDisplay>
            </SummaryExchangeAmount>
            <SummarySubExchangeAmount>
              <CoinDisplay size='14px' weight={300} coin={coin}>
                {fee}
              </CoinDisplay>
            </SummarySubExchangeAmount>
          </ExchangeAmounts>
        </LargeTableRow>
        <LargeTableRow>
          <Text size='16px' weight={400}>
            <FormattedMessage
              id='modals.sendbch.secondstep.sendtotal'
              defaultMessage='Total:'
            />
          </Text>
          <ExchangeAmounts>
            <SummaryExchangeAmount data-e2e={`${coin}SendTotal`}>
              <FiatDisplay coin={coin} size='16px' weight={500}>
                {total}
              </FiatDisplay>
            </SummaryExchangeAmount>
            <SummarySubExchangeAmount data-e2e={`${coin}SendSubTotal`}>
              <CoinDisplay coin={coin} size='14px' weight={300}>
                {total}
              </CoinDisplay>
            </SummarySubExchangeAmount>
          </ExchangeAmounts>
        </LargeTableRow>
      </ConfirmWrapper>
      {isLegacy && (
        <WarningBanner>
          <Banner type='caution'>
            <Text size='12px'>
              <FormattedMessage
                id='modals.sendbch.secondstep.bchaddrwarning'
                defaultMessage='Are you sure this is a Bitcoin Cash address? Sending funds to a Bitcoin address by accident will result in loss of funds.'
              />
            </Text>
          </Banner>
        </WarningBanner>
      )}
      <Footer>
        <Button
          height='56px'
          size='18px'
          onClick={handleSubmit}
          disabled={submitting}
          nature='primary'
          fullwidth
          data-e2e='bchSendSubmitButton'
        >
          {!submitting ? (
            <FormattedMessage
              id='modals.sendbch.secondstep.send'
              defaultMessage='Send Bitcoin Cash'
            />
          ) : (
            <HeartbeatLoader height='20px' width='20px' color='white' />
          )}
        </Button>
        <Link
          onClick={!submitting && handleBack}
          disabled={submitting}
          size='13px'
          weight={400}
          data-e2e='bchSendBackLink'
        >
          <FormattedMessage id='buttons.go_back' defaultMessage='Go Back' />
        </Link>
      </Footer>
    </React.Fragment>
  )
}

export default Success
