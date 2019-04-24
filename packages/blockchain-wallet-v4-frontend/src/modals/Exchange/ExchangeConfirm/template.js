import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { reduxForm } from 'redux-form'
import { model } from 'data'

import { Remote } from 'blockchain-wallet-v4/src'
import { HeartbeatLoader, Icon, Text } from 'blockchain-info-components'
import { ExchangeButton, Note, Title, Wrapper } from 'components/Exchange'
import { Form } from 'components/Form'
import ExchangeError from './ExchangeError'
import Summary from '../../../scenes/Exchange/ExchangeForm/Summary'
import TargetFiatAmount from '../../../scenes/Exchange/ExchangeForm/Summary/TargetFiatAmount'

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
  white-space: nowrap;
  background-color: ${props => props.theme[props.coin]};
  border: 1px solid ${props => props.theme[props.coin]};
  color: ${props => props.theme.white};
  padding: 10px 15px;
  border-radius: 3px;
  flex: 1;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
    Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  font-weight: 400;
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
const OrderInfoBox = styled.div`
  display: flex;
  box-sizing: border-box;
  border-radius: 4px;
  border: 1px solid ${props => props.theme['gray-1']};
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding: 10px 16px;
  cursor: pointer;
  width: 100%;
  > * {
    transition: color 0.1s, transform 0.1s;
  }
  ${props =>
    props.showOrderInfo &&
    `
    border-radius: 4px 4px 0px 0px;
    border-bottom: 0px;
    margin-bottom: 0px;
    > span:last-child {
      transform: rotate(180deg);
    }
    & + div {
      border-radius: 0px 0px 4px 4px;
    }
  `}
  &:hover {
    * {
      color: ${props => props.theme['brand-secondary']};
    }
  }
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
  close,
  currency,
  error,
  handleSubmit,
  showOrderInfo,
  sourceAmount,
  sourceCoin,
  sourceCoinIcon,
  submitting,
  targetAmount,
  targetCoin,
  targetCoinIcon,
  toggleShowOrderInfo
}) => (
  <ConfirmForm onSubmit={handleSubmit}>
    <ConfirmWrapper>
      <CoinIconTitle>
        <Icon
          size='42px'
          color={sourceCoin.toLowerCase()}
          name={sourceCoinIcon}
        />
        <Icon size='12px' name='thick-arrow-right' />
        <Icon
          size='42px'
          color={targetCoin.toLowerCase()}
          name={targetCoinIcon}
        />
      </CoinIconTitle>
      <AmountTitle>
        <TargetFiatAmount
          targetAmount={Remote.of(targetAmount)}
          targetCoin={targetCoin}
          color='brand-primary'
          weight={400}
          size='42px'
        />
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
      <OrderInfoBox onClick={toggleShowOrderInfo} showOrderInfo={showOrderInfo}>
        <Text size='14px' weight={400}>
          <FormattedMessage
            id='scenes.exchange.confirm.orderinfo'
            defaultMessage='Order Info'
          />
        </Text>
        <Icon name='down-arrow' weight={600} size='14px' color='gray-3' />
      </OrderInfoBox>
      {showOrderInfo && (
        <Summary
          sourceCoin={sourceCoin}
          targetCoin={targetCoin}
          currency={currency}
        />
      )}
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
