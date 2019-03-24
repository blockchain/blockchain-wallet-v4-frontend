import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { reduxForm } from 'redux-form'
import { model } from 'data'

import { HeartbeatLoader, Icon } from 'blockchain-info-components'
import {
  Wrapper,
  Title,
  Note,
  ExchangeButton,
  CancelButton
} from 'components/Exchange'
import { Form } from 'components/Form'
import ExchangeError from './ExchangeError'
import Summary from '../ExchangeForm/Summary'

const { CONFIRM_FORM } = model.components.exchange

const ConfirmWrapper = styled(Wrapper)`
  ${Title} {
    margin-bottom: 8px;
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
const ConfirmForm = styled(Form)`
  max-width: 440px;
`
const AmountNote = styled(Note)`
  margin-top: 0px;
`
const Buttons = styled.div`
  margin-top: 16px;
`

const ExchangeConfirm = ({
  error,
  sourceAmount,
  targetAmount,
  sourceCoin,
  targetCoin,
  currency,
  submitting,
  handleSubmit,
  onBack
}) => (
  <ConfirmForm onSubmit={handleSubmit}>
    <ConfirmWrapper>
      <Title>
        <FormattedMessage
          id='scenes.exchange.confirm.header'
          defaultMessage='Confirm'
        />
      </Title>
      <Row>
        <CoinButton
          coin={sourceCoin.toLowerCase()}
          data-e2e='exchangeConfirmSourceValue'
        >
          {`${sourceAmount} ${sourceCoin}`}
        </CoinButton>
        <FromToIcon name='short-right-arrow' />
        <CoinButton
          coin={targetCoin.toLowerCase()}
          data-e2e='exchangeConfirmTargetValue'
        >
          {`${targetAmount} ${targetCoin}`}
        </CoinButton>
      </Row>
      <Summary
        sourceCoin={sourceCoin}
        targetCoin={targetCoin}
        currency={currency}
      />
      {error ? (
        <ExchangeError
          error={error}
          onBack={onBack}
          handleSubmit={handleSubmit}
        />
      ) : (
        <AmountNote>
          <FormattedMessage
            id='scenes.exchange.confirm.summary.note'
            defaultMessage='All amounts are correct at this time but may change depending on the market price and network congestion at the time of your transaction.'
          />
        </AmountNote>
      )}
    </ConfirmWrapper>
    {!error && (
      <Buttons>
        <ExchangeButton
          type='submit'
          nature='primary'
          disabled={submitting}
          data-e2e='exchangeCompleteOrderButton'
        >
          {!submitting && (
            <FormattedMessage
              id='scenes.exchange.confirm.confirm'
              defaultMessage='Confirm'
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
      </Buttons>
    )}
  </ConfirmForm>
)

export default reduxForm({
  form: CONFIRM_FORM
})(ExchangeConfirm)
