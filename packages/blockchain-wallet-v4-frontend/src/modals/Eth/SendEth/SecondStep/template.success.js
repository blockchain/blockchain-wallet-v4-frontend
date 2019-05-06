import React from 'react'
import styled from 'styled-components'
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl'

import { Button, Link, HeartbeatLoader, Text } from 'blockchain-info-components'
import CoinDisplay from 'components/Display/CoinDisplay'
import FiatDisplay from 'components/Display/FiatDisplay'
import {
  ExchangeAmount,
  ExchangeAmounts,
  LargeTableRow,
  SubExchangeAmount,
  Wrapper
} from 'components/Exchange'

const ConfirmWrapper = styled(Wrapper)`
  padding: 0px;
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
    submitting,
    coin,
    coinDisplayName,
    fromAddress,
    toAddress,
    description,
    amount,
    fee,
    totalCrypto,
    totalFiat,
    handleBack,
    handleSubmit
  } = props

  return (
    <React.Fragment>
      <ConfirmWrapper>
        <LargeTableRow>
          <Text size='16px' weight={500}>
            <FormattedMessage
              id='modals.sendeth.secondstep.from'
              defaultMessage='From:'
            />
          </Text>
          <Text size='16px' weight={400} data-e2e={`${coin}FromWallet`}>
            {fromAddress}
          </Text>
        </LargeTableRow>
        <LargeTableRow>
          <Text size='16px' weight={500}>
            <FormattedMessage
              id='modals.sendeth.secondstep.to'
              defaultMessage='To:'
            />
          </Text>
          <TextTo size='14px' weight={400} data-e2e={`${coin}ToAddress`}>
            {toAddress}
          </TextTo>
        </LargeTableRow>
        {description && (
          <LargeTableRow>
            <Text size='16px' weight={500}>
              <FormattedMessage
                id='modals.sendeth.secondstep.note'
                defaultMessage='Note:'
              />
            </Text>
            <Text size='16px' weight={400} data-e2e={`${coin}SendDescription`}>
              {description}
            </Text>
          </LargeTableRow>
        )}
        <LargeTableRow>
          <Text size='16px' weight={500}>
            <FormattedMessage
              id='modals.sendeth.secondstep.payment'
              defaultMessage='Payment:'
            />
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
              id='modals.sendeth.secondstep.fee'
              defaultMessage='Fee:'
            />
          </Text>
          <ExchangeAmounts>
            <SummaryExchangeAmount>
              <FiatDisplay size='16px' weight={500} coin='ETH'>
                {fee}
              </FiatDisplay>
            </SummaryExchangeAmount>
            <SummarySubExchangeAmount>
              <CoinDisplay size='14px' weight={300} coin='ETH'>
                {fee}
              </CoinDisplay>
            </SummarySubExchangeAmount>
          </ExchangeAmounts>
        </LargeTableRow>
        <LargeTableRow>
          <Text size='16px' weight={500}>
            <FormattedMessage
              id='modals.sendeth.secondstep.total'
              defaultMessage='Total'
            />
          </Text>
          <ExchangeAmounts>
            {coin === 'ETH' ? (
              <React.Fragment>
                <SummaryExchangeAmount>{totalFiat}</SummaryExchangeAmount>
                <SummarySubExchangeAmount>
                  <CoinDisplay coin={coin} size='14px' weight={300}>
                    {totalCrypto}
                  </CoinDisplay>
                </SummarySubExchangeAmount>
              </React.Fragment>
            ) : (
              <SummaryExchangeAmount>-{totalFiat}</SummaryExchangeAmount>
            )}
          </ExchangeAmounts>
        </LargeTableRow>
      </ConfirmWrapper>
      <Footer>
        <Button
          height='56px'
          size='18px'
          onClick={handleSubmit}
          disabled={submitting}
          nature='primary'
          fullwidth
          data-e2e={`${coin}SendSubmitButton`}
        >
          {!submitting ? (
            <FormattedHTMLMessage
              id='modals.sendeth.secondstep.sendcoin'
              defaultMessage='Send {coinDisplayName}'
              values={{ coinDisplayName }}
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
          data-e2e={`${coin}SendBackLink`}
        >
          <FormattedMessage
            id='modals.sendeth.sendconfirm.back'
            defaultMessage='Go Back'
          />
        </Link>
      </Footer>
    </React.Fragment>
  )
}

export default Success
