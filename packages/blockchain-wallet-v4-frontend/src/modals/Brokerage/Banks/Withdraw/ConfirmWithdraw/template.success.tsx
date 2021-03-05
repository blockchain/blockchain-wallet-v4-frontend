import { Button, HeartbeatLoader, Icon, Text } from 'blockchain-info-components'
import { NabuMoneyFloatType } from 'core/types'
import React from 'react'
import styled from 'styled-components'

import { displayFiatToFiat } from 'blockchain-wallet-v4/src/exchange'
import { ErrorCartridge } from 'components/Cartridge'
import { fiatToString } from 'core/exchange/currency'
import { FlyoutWrapper, Row, Title, Value } from 'components/Flyout'
import { Form } from 'components/Form'
import { FormattedMessage } from 'react-intl'
import { InjectedFormProps, reduxForm } from 'redux-form'
import { Props as OwnProps, SuccessStateType } from '.'
import { WithdrawCheckoutFormValuesType, WithdrawStepEnum } from 'data/types'

import CoinDisplay from 'components/Display/CoinDisplay'

const Top = styled(Text)`
  display: flex;
  align-items: center;
  margin-bottom: 16px;
`
const AmountContainer = styled.div`
  margin-top: 40px;
  margin-bottom: 24px;
  display: flex;
`
const ErrorContainer = styled(FlyoutWrapper)`
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 0px;
  margin-top: 0px;
`

const Success: React.FC<InjectedFormProps<
  WithdrawCheckoutFormValuesType,
  Props
> &
  Props> = props => {
  return (
    <Form
      onSubmit={e => {
        e.preventDefault()

        props.withdrawActions.handleCustodyWithdraw(
          props.formValues.amount,
          props.beneficiary || props.defaultMethod || null,
          props.fiatCurrency
        )
      }}
    >
      <FlyoutWrapper>
        <Top>
          <Icon
            name='arrow-left'
            size='20px'
            role='button'
            style={{ marginRight: '16px' }}
            onClick={() =>
              props.withdrawActions.setStep({
                beneficiary: props.beneficiary,
                fiatCurrency: props.fiatCurrency,
                step: WithdrawStepEnum.ENTER_AMOUNT
              })
            }
          />
          <Text size='20px' weight={600} color='grey800'>
            <FormattedMessage
              id='copy.confirm_withdrawal'
              defaultMessage='Confirm Withdrawal'
            />
          </Text>
        </Top>
        <AmountContainer>
          <CoinDisplay
            color='grey800'
            size='32px'
            weight={600}
            coin={props.fiatCurrency}
          >
            {props.amount}
          </CoinDisplay>
          &nbsp;
          <Text color='grey800' size='32px' weight={600}>
            {props.fiatCurrency}
          </Text>
        </AmountContainer>
      </FlyoutWrapper>
      <Row>
        <Title>
          <FormattedMessage id='copy.from' defaultMessage='From' />
        </Title>
        <Value>
          <FormattedMessage
            id='modals.simplebuy.confirm.funds_wallet'
            defaultMessage='{coin} Wallet'
            values={{
              coin: props.fiatCurrency
            }}
          />
        </Value>
      </Row>
      <Row>
        <Title>
          <FormattedMessage id='copy.to' defaultMessage='To' />
        </Title>
        <Value>
          {props.beneficiary?.name || props.defaultMethod?.details.bankName}
        </Value>
      </Row>
      <Row>
        <Title>
          <FormattedMessage id='copy.fee' defaultMessage='Fee' />
        </Title>
        <Value>
          {props.fees.value} {props.fiatCurrency}
        </Value>
      </Row>
      <Row>
        <Title>
          <FormattedMessage id='copy.total' defaultMessage='Total' />
        </Title>
        <Value>
          {displayFiatToFiat({ value: props.amount })} {props.fiatCurrency}
        </Value>
      </Row>
      <FlyoutWrapper>
        <Button
          data-e2e='withdrawCustody'
          disabled={props.submitting}
          fullwidth
          height='48px'
          nature='primary'
          size='16px'
          type='submit'
        >
          {props.submitting ? (
            <HeartbeatLoader height='20px' width='20px' color='white' />
          ) : (
            <FormattedMessage
              id='buttons.withdraw_value'
              defaultMessage='Withdraw {value}'
              values={{
                value: fiatToString({
                  value: props.amount,
                  unit: props.fiatCurrency
                })
              }}
            />
          )}
        </Button>
        <Button
          onClick={() =>
            props.withdrawActions.setStep({
              beneficiary: props.beneficiary,
              fiatCurrency: props.fiatCurrency,
              step: WithdrawStepEnum.ENTER_AMOUNT
            })
          }
          data-e2e='cancelWithdrawCustody'
          height='48px'
          fullwidth
          nature='light-red'
          size='16px'
          style={{ marginTop: '16px' }}
        >
          <FormattedMessage id='buttons.cancel' defaultMessage='Cancel' />
        </Button>
      </FlyoutWrapper>
      {props.error && !props.submitting && (
        <ErrorContainer>
          <ErrorCartridge>{props.error}</ErrorCartridge>
        </ErrorContainer>
      )}
    </Form>
  )
}

export type Props = OwnProps & SuccessStateType & { fees: NabuMoneyFloatType }

export default reduxForm<WithdrawCheckoutFormValuesType, Props>({
  form: 'confirmCustodyWithdraw',
  destroyOnUnmount: false
})(Success)
