import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { reduxForm } from 'redux-form'
import { prop } from 'ramda'
import { model } from 'data'

import { HeartbeatLoader, Icon, Text } from 'blockchain-info-components'
import {
  Wrapper,
  ExchangeText,
  Title,
  Delimiter,
  TableRow,
  Note,
  ExchangeButton,
  CancelButton
} from 'components/Exchange'
import { Form } from 'components/Form'

const {
  CONFIRM_FORM,
  MISSING_DEVICE_ERROR,
  NO_TRADE_PERMISSION
} = model.components.exchange

const ConfirmWrapper = styled(Wrapper)`
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
  > :last-child {
    margin-bottom: 0;
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
  min-width: 25px;
  width: 45px;
  text-align: center;
  justify-content: center;
  font-size: 24px;
`
const ErrorRow = styled(Text)`
  display: flex;
  flex-direction: row;
  justify-content: center;
  min-height: 18px;
  padding: 5px 0;
  font-weight: 300;
  font-size: 14px;
  line-height: 18px;
  color: ${props => props.theme.error};
`
const ConfirmForm = styled(Form)`
  max-width: 440px;
`

const getErrorMessage = error => {
  if (error === MISSING_DEVICE_ERROR) {
    return (
      <FormattedMessage
        id='scenes.exchange.confirm.missingdevice'
        defaultMessage='Lockbox device is missing'
      />
    )
  } else if (prop('type', error) === NO_TRADE_PERMISSION) {
    return (
      prop('description', error) || (
        <FormattedMessage
          id='scenes.exchange.confirm.notradepermission'
          defaultMessage='You do not have permission to trade right now. Please try again later.'
        />
      )
    )
  } else {
    return (
      prop('description', error) || (
        <FormattedMessage
          id='scenes.exchange.confirm.tradefailed'
          defaultMessage='Failed to execute a trade'
        />
      )
    )
  }
}

const ExchangeConfirm = ({
  error,
  sourceAmount,
  targetAmount,
  targetFiat,
  sourceFiat,
  sourceActive,
  sourceToTargetRate,
  sourceCoin,
  targetCoin,
  currency,
  sourceFee,
  submitting,
  handleSubmit,
  onBack
}) => (
  <ConfirmForm onSubmit={handleSubmit}>
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
        <FromToIcon name='short-right-arrow' />
        <CoinButton coin={targetCoin.toLowerCase()}>
          {`${targetAmount} ${targetCoin}`}
        </CoinButton>
      </Row>
      <TableRow>
        <ExchangeText>
          <FormattedMessage
            id='scenes.exchange.exchange.confirm.summary.rates'
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
            id='scenes.exchange.exchange.confirm.summary.sourceFee'
            defaultMessage='Network Fee'
          />
        </ExchangeText>
        <ExchangeText weight={300}>{`${
          sourceFee.source
        } ${sourceCoin}`}</ExchangeText>
      </TableRow>
      {sourceActive ? (
        <TableRow>
          <ExchangeText>
            <FormattedMessage
              id='scenes.exchange.confirm.exchangevalue'
              defaultMessage='Exchange Value'
            />
          </ExchangeText>
          <ExchangeText
            weight={300}
          >{`${sourceFiat} ${currency}`}</ExchangeText>
        </TableRow>
      ) : (
        <TableRow>
          <ExchangeText>
            <FormattedMessage
              id='scenes.exchange.confirm.receivevalue'
              defaultMessage='Receive Value'
            />
          </ExchangeText>
          <ExchangeText
            weight={300}
          >{`${targetFiat} ${currency}`}</ExchangeText>
        </TableRow>
      )}
      <Delimiter />
      <Note>
        <FormattedMessage
          id='scenes.exchange.confirm.summary.note'
          defaultMessage='All amounts are correct at this time but may change depending on the market price and network congestion at the time of your transaction.'
        />
      </Note>
    </ConfirmWrapper>
    <ErrorRow>{error && getErrorMessage(error)}</ErrorRow>
    <ExchangeButton
      type='submit'
      nature='primary'
      disabled={submitting}
      data-e2e='exchangeCompleteOrderButton'
    >
      {!submitting && (
        <FormattedMessage
          id='scenes.exchange.confirm.submit'
          defaultMessage='Complete Order'
        />
      )}
      {submitting && (
        <HeartbeatLoader height='20px' width='20px' color='white' />
      )}
    </ExchangeButton>
    <CancelButton
      disabled={submitting}
      onClick={onBack}
      data-e2e='exchangeCancelOrderButton'
    >
      {!submitting && (
        <FormattedMessage
          id='scenes.exchange.confirm.cancel'
          defaultMessage='Cancel'
        />
      )}
    </CancelButton>
  </ConfirmForm>
)

export default reduxForm({
  form: CONFIRM_FORM
})(ExchangeConfirm)
