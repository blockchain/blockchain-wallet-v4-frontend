import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import { HeartbeatLoader, Icon } from 'blockchain-info-components'
import {
  Wrapper,
  ExchangeText,
  Title,
  Delimiter,
  TableRow,
  Note,
  SubmitButton
} from 'components/Exchange'

const ConfirmWrapper = styled(Wrapper)`
  margin-bottom: 24px;
  ${Title} {
    margin-bottom: 8px;
  }
  ${TableRow} {
    margin-bottom: 26px;
  }
  ${Delimiter} {
    margin-top: 29px;
    margin-bottopm: 30px;
  }
`
const CoinButton = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  background-color: ${props => props.theme[props.coin]};
  border: 1px solid ${props => props.theme[props.coin]};
  color: ${props => props.theme.white};
  padding: 10px 15px;
  border-radius: 3px;
  flex: 1;
  font-family: 'Montserrat', Helvetica, sans-serif;
  font-weight: 300;
  font-size: 14px;
  line-height: 1;
  text-decoration: none;
  letter-spacing: normal;
`
const Row = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 35px;
`
const FromToIcon = styled(Icon)`
  min-width: 45px;
  text-align: center;
  justify-content: center;
  font-size: 24px;
`

const Summary = ({
  sourceAmount,
  targetAmount,
  targetFiat,
  sourceToTargetRate,
  sourceCoin,
  targetCoin,
  currency,
  fee,
  submitting,
  handleSubmit
}) => (
  <div>
    <ConfirmWrapper>
      <Title>
        <FormattedMessage
          id='scenes.exchange.confirm.title'
          defaultMessage='Confirm Exchange'
        />
      </Title>
      <Row>
        <CoinButton coin={sourceCoin.toLowerCase()}>
          {`${sourceAmount} ${sourceCoin}`}
        </CoinButton>
        <FromToIcon name='right-arrow-filled' />
        <CoinButton coin={targetCoin.toLowerCase()}>
          {`${targetAmount} ${targetCoin}`}
        </CoinButton>
      </Row>
      <TableRow>
        <ExchangeText>
          <FormattedMessage
            id='scenes.exchange.exchangeform.summary.rates'
            defaultMessage='Rate'
          />
        </ExchangeText>
        <ExchangeText weight={300}>
          {`1 ${sourceCoin} = ${sourceToTargetRate} ${targetCoin}`}
        </ExchangeText>
      </TableRow>
      <TableRow>
        <ExchangeText>
          <FormattedMessage
            id='scenes.exchange.exchangeform.summary.fee'
            defaultMessage='Network Fee'
          />
        </ExchangeText>
        <ExchangeText weight={300}>{`${fee} ${targetCoin}`}</ExchangeText>
      </TableRow>
      <TableRow>
        <ExchangeText>
          <FormattedMessage
            id='scenes.exchange.confirm.value'
            defaultMessage='Total Value'
          />
        </ExchangeText>
        <ExchangeText weight={300}>{`~${targetFiat} ${currency}`}</ExchangeText>
      </TableRow>
      <Delimiter />
      <Note>
        <FormattedMessage
          id='scenes.exchange.exchangeform.summary.note'
          defaultMessage='All amounts are correct at this time but may change depending on the market price and network congestion at the time of your transaction.'
        />
      </Note>
    </ConfirmWrapper>
    <SubmitButton
      type='submit'
      nature='primary'
      disabled={submitting}
      onClick={handleSubmit}
    >
      {!submitting && (
        <FormattedMessage
          id='scenes.exchange.confirm.submit'
          defaultMessage='Complete Order'
          values={{
            source: sourceCoin,
            target: targetCoin
          }}
        />
      )}
      {submitting && (
        <HeartbeatLoader height='20px' width='20px' color='white' />
      )}
    </SubmitButton>
  </div>
)

export default Summary
