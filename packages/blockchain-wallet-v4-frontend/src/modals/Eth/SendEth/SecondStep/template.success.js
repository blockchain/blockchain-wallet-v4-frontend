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
  padding: 0px;s
`

const Summary = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: ${props => props.theme['gray-1']};
  padding: 10px 0;
  margin: 5px 0 25px;

  & > * {
    padding: 10px 0;
  }
`
const TextTo = styled(Text)`
  max-width: 60%;
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
    total,
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
            <ExchangeAmount>
              <FiatDisplay size='16px' weight={500} coin={coin}>
                {amount}
              </FiatDisplay>
            </ExchangeAmount>
            <SubExchangeAmount>
              <CoinDisplay size='14px' weight={300} coin={coin}>
                {amount}
              </CoinDisplay>
            </SubExchangeAmount>
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
            <ExchangeAmount>
              <FiatDisplay size='16px' weight={500} coin='ETH'>
                {fee}
              </FiatDisplay>
            </ExchangeAmount>
            <SubExchangeAmount>
              <CoinDisplay size='14px' weight={300} coin='ETH'>
                {fee}
              </CoinDisplay>
            </SubExchangeAmount>
          </ExchangeAmounts>
        </LargeTableRow>
        <Summary>
          <Text size='16px' weight={400} color='sent'>
            <FormattedMessage
              id='modals.sendeth.secondstep.total'
              defaultMessage='Total'
            />
          </Text>
          <CoinDisplay coin={coin} size='30px' weight={600} color='sent'>
            {total}
          </CoinDisplay>
          <FiatDisplay coin={coin} size='20px' weight={400} color='sent'>
            {total}
          </FiatDisplay>
        </Summary>
      </ConfirmWrapper>
      <Footer>
        <Button
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
