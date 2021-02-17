import { Field, InjectedFormProps, reduxForm } from 'redux-form'
import { FormattedMessage } from 'react-intl'
import React from 'react'
import styled from 'styled-components'

import { AmountTextBox } from 'components/Exchange'
import { BankDepositStepType } from 'data/types'
import { Button, HeartbeatLoader, Icon, Text } from 'blockchain-info-components'
import { DisplayPaymentIcon } from 'components/SimpleBuy'
import { FlyoutWrapper } from 'components/Flyout'
import { Form } from 'components/Form'
import Currencies from 'blockchain-wallet-v4/src/exchange/currencies'

import { Props as _P, LinkStatePropsType, SuccessStateType } from '.'
import { DepositOrWithdrawal } from '../../model'
import {
  getIcon,
  PaymentArrowContainer,
  PaymentContainer,
  PaymentText
} from '../../../../SimpleBuy/EnterAmount/Checkout/Payment/model'
import { getText, RightArrowIcon } from './model'
import { Row } from '../../../../Swap/EnterAmount/Checkout'

const CustomForm = styled(Form)`
  height: 100%;
  display: flex;
  flex-direction: column;
`
const TopText = styled(Text)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`

const LeftTopCol = styled.div`
  display: flex;
  align-items: center;
`

const AmountRow = styled(Row)`
  position: relative;
  padding: 24px;
  justify-content: center;
  border: 0;
`

const Header = ({ brokerageActions, fiatCurrency }) => {
  return (
    <FlyoutWrapper style={{ paddingBottom: '0px', borderBottom: 'grey000' }}>
      <TopText color='grey800' size='20px' weight={600}>
        <LeftTopCol>
          <Icon
            cursor
            data-e2e='depositBackToDepositMethods'
            name='arrow-back'
            size='20px'
            color='grey600'
            role='button'
            style={{ marginRight: '8px' }}
            onClick={() =>
              brokerageActions.setStep({
                step: BankDepositStepType.DEPOSIT_METHODS
              })
            }
          />
          <DepositOrWithdrawal
            fiatCurrency={fiatCurrency}
            orderType={'DEPOSIT'}
          />
        </LeftTopCol>
      </TopText>
    </FlyoutWrapper>
  )
}

const LimitSection = ({ paymentMethods }) => {
  const bankTranfser = paymentMethods.methods.find(
    method => method.type === 'BANK_TRANSFER'
  )

  if (bankTranfser.limits) {
    return (
      <FlyoutWrapper>
        <FormattedMessage
          id='modals.brokerage.daily_limit'
          defaultMessage='Daily Limit'
        />
        {bankTranfser.limits.daily.available}{' '}
        <FormattedMessage id='copy.available' defaultMessage='Available' />
      </FlyoutWrapper>
    )
  } else {
    // TODO: return something if no limits are available
    return <></>
  }
}

const Amount = ({ fiatCurrency }) => {
  return (
    <FlyoutWrapper>
      <AmountRow id='amount-row'>
        <Text size={'56px'} color='textBlack' weight={500}>
          {Currencies[fiatCurrency].units[fiatCurrency].symbol}
        </Text>
        <Field
          data-e2e='depositAmountInput'
          name='amount'
          component={AmountTextBox}
          // validate={[maximumAmount, minimumAmount]}
          // normalize={normalizeAmount}
          // onUpdate={resizeSymbol.bind(null, fix === 'FIAT')}
          maxFontSize='56px'
          placeholder='0'
          // leave fiatActive always to avoid 50% width in HOC?
          fiatActive
          {...{
            autoFocus: true,
            hideError: true
          }}
        />
      </AmountRow>
    </FlyoutWrapper>
  )
}

const Account = ({ method, invalid, brokerageActions }) => {
  return (
    <PaymentContainer
      disabled={invalid}
      role='button'
      data-e2e='paymentMethodSelect'
      onClick={() => {
        return !invalid
          ? brokerageActions.setStep({
              step: BankDepositStepType.BANK_LIST
            })
          : null
      }}
      isMethod={!!method}
    >
      <DisplayPaymentIcon showBackground={!method}>
        {getIcon(method, false, invalid)}
      </DisplayPaymentIcon>
      <PaymentText isMethod={!!method}>{getText(null)}</PaymentText>
      <PaymentArrowContainer>
        <RightArrowIcon
          cursor
          disabled={invalid}
          name='arrow-back'
          size='20px'
          color='grey600'
        />
      </PaymentArrowContainer>
    </PaymentContainer>
  )
}

const NextButton = ({ invalid, submitting }) => {
  return (
    <Button
      data-e2e='submitDepositAmount'
      height='48px'
      size='16px'
      nature='primary'
      type='submit'
      fullwidth
      disabled={invalid}
    >
      {submitting ? (
        <HeartbeatLoader height='16px' width='16px' color='white' />
      ) : (
        <FormattedMessage id='buttons.next' defaultMessage='Next' />
      )}
    </Button>
  )
}

const ErrorMessage = () => {
  return <div>sup</div>
}
const Success = (props: OwnProps) => {
  const isUserEligible =
    props.paymentMethods.methods.length &&
    props.paymentMethods.methods.find(method => method.limits.max !== '0')

  return (
    <div>
      {isUserEligible && (
        <CustomForm onSubmit={props.handleSubmit}>
          <Header {...props} />
          <LimitSection {...props} />
          <Amount {...props} />
          <Account {...props} method={'DEPOSIT'} />
          <NextButton {...props} />
          <ErrorMessage />
        </CustomForm>
      )}
    </div>
  )
}

export type Props = _P & SuccessStateType & LinkStatePropsType
type OwnProps = Props & InjectedFormProps<{}, Props>

export default reduxForm<{}, OwnProps>({
  form: 'brokerageTx',
  destroyOnUnmount: false
})(Success)
