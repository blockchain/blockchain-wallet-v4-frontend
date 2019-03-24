import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { reduxForm } from 'redux-form'
import { model } from 'data'

import { HeartbeatLoader, Icon, Text } from 'blockchain-info-components'
import { ExchangeButton, Note, Title, Wrapper } from 'components/Exchange'
import { Form } from 'components/Form'
import ExchangeError from './ExchangeError'
import Summary from '../../../scenes/Exchange/ExchangeForm/Summary'

const { CONFIRM_FORM } = model.components.exchange

const ConfirmWrapper = styled(Wrapper)`
  border: 0px;
  padding: 0px;
  padding-bottom: 0px;
  > :last-child {
    margin-bottom: 0;
  }
`
const CoinIconTitle = styled(Title)`
  width: 100%;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: initial;
  span:nth-child(2) {
    width: 30px;
    height: 30px;
    border-radius: 15px;
    background: ${props => props.theme['white']};
    justify-content: center;
    align-items: center;
    margin: 0px -6px;
    z-index: 1;
  }
`
const AmountTitle = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin-bottom: 16px;
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
  margin-bottom: 16px;
`
const FromToIcon = styled(Icon)`
  min-width: 25px;
  width: 45px;
  text-align: center;
  justify-content: center;
  font-size: 24px;
`
const ConfirmForm = styled(Form)`
  padding: 0px;
`
const AmountNote = styled(Note)`
  margin-top: 0px;
`
const Buttons = styled.div`
  margin-bottom: 16px;
  margin-top: -8px;
  width: 100%;
`

const ExchangeConfirm = ({
  error,
  sourceAmount,
  targetAmount,
  sourceCoin,
  targetCoin,
  targetFiat,
  currency,
  fiatCurrencySymbol,
  submitting,
  handleSubmit,
  close
}) => (
  <ConfirmForm onSubmit={handleSubmit}>
    <ConfirmWrapper>
      <CoinIconTitle>
        <Icon
          size='42px'
          color={sourceCoin.toLowerCase()}
          name={sourceCoin.toLowerCase() + '-circle-filled'}
        />
        <Icon size='12px' name='thick-arrow-right' />
        <Icon
          size='42px'
          color={targetCoin.toLowerCase()}
          name={targetCoin.toLowerCase() + '-circle-filled'}
        />
      </CoinIconTitle>
      <AmountTitle>
        <Text size='42px' color='brand-primary'>
          {fiatCurrencySymbol}
          {targetFiat}
        </Text>
      </AmountTitle>
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
        </Buttons>
      )}
      {error ? (
        <ExchangeError
          error={error}
          onBack={close}
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
  </ConfirmForm>
)

export default reduxForm({
  form: CONFIRM_FORM
})(ExchangeConfirm)
