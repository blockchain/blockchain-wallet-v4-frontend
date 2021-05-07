import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { BaseFieldProps, Field, InjectedFormProps, reduxForm } from 'redux-form'
import styled from 'styled-components'

import { Button, HeartbeatLoader, Icon, Text } from 'blockchain-info-components'
import CoinDisplay from 'components/Display/CoinDisplay'
import FiatDisplay from 'components/Display/FiatDisplay'
import { FlyoutWrapper } from 'components/Flyout'
import {
  CoinBalanceDropdown,
  Form,
  FormLabel,
  NumberBox
} from 'components/Form'
import { selectors } from 'data'
import { RepayLoanFormType } from 'data/components/borrow/types'

import { maximumAmount, minimumAmount } from '../BorrowForm/validation'
import { Props as OwnProps, SuccessStateType } from '.'
import TabMenuPaymentMethod from './TabMenuPaymentMethod'
import TabMenuPaymentType from './TabMenuPaymentType'

const CustomForm = styled(Form)`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

const Top = styled(FlyoutWrapper)`
  padding-bottom: 0;
`
const TopText = styled(Text)`
  display: flex;
  align-items: center;
`

const AmountsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 40px 0;
  > div {
    width: 50%;
  }
`
const AmountsHeader = styled(Text)`
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 8px;
  color: ${props => props.theme.grey600};
`

const Bottom = styled(FlyoutWrapper)`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  height: 100%;
`

const CustomFormLabel = styled(FormLabel)`
  display: block;
  margin-top: 24px;
  margin-bottom: 8px;
`

const CustomField = styled(Field)<BaseFieldProps>`
  > input {
    padding-left: 95px;
  }
`

const AmountFieldContainer = styled.div`
  display: flex;
  position: relative;
`

const PrincipalCcyAbsolute = styled.div`
  position: absolute;
  top: 16px;
  left: 12px;
`

const InfoContainer = styled.div`
  display: flex;
  margin-bottom: 16px;
`

const ErrorText = styled(Text)`
  display: inline-flex;
  font-weight: 500;
  font-size: 14px;
  padding: 6px 12px;
  border-radius: 32px;
  background-color: ${props => props.theme.red000};
  color: ${props => props.theme.red800};
  margin-bottom: 16px;
`

export type Props = OwnProps & SuccessStateType & LinkStatePropsType & FormProps

const Success: React.FC<InjectedFormProps<{}, Props> & Props> = props => {
  const principalDisplayName =
    props.supportedCoins[props.loan.principal.amount[0].currency].displayName
  const isSufficientEthForErc20 =
    (props.payment.coin === 'PAX' ||
      props.payment.coin === 'USDT' ||
      props.payment.coin === 'WDGLD') &&
    props.payment.isSufficientEthForErc20

  return (
    <CustomForm onSubmit={props.handleSubmit}>
      <Top>
        <TopText color='grey800' size='20px' weight={600}>
          <Icon
            cursor
            style={{ marginRight: '24px' }}
            name='arrow-left'
            size='20px'
            color='grey600'
            onClick={() =>
              props.borrowActions.setStep({
                step: 'DETAILS',
                loan: props.loan,
                offer: props.offer
              })
            }
          />
          <FormattedMessage
            id='modals.borrow.repayloan'
            defaultMessage='Repay Loan'
          />
        </TopText>
        <AmountsContainer>
          <div>
            <AmountsHeader>
              <FormattedMessage
                id='scenes.borrow.repayloan.amount'
                defaultMessage='Borrow Amount'
              />
            </AmountsHeader>
            <CoinDisplay
              coin={props.loan.principal.amount[0].currency}
              color='grey800'
              size='20px'
              weight={600}
            >
              {props.loan.principal.amount[0].amount}
            </CoinDisplay>
          </div>
          <div>
            <AmountsHeader>
              <FormattedMessage
                id='scenes.borrow.repayloan.collateral'
                defaultMessage='Collateral Value'
              />
            </AmountsHeader>
            <FiatDisplay
              color='grey800'
              size='20px'
              weight={600}
              currency='USD'
              coin={props.loan.collateral.amounts[0].currency}
            >
              {props.loan.collateral.amounts[0].amount}
            </FiatDisplay>
          </div>
        </AmountsContainer>
        <CustomFormLabel>
          <Text color='grey600' weight={500} size='14px'>
            <FormattedMessage
              id='modals.repayloan.chooseamttorepay'
              defaultMessage='Choose how much you want to repay'
            />
          </Text>
        </CustomFormLabel>
        <Field name='repay-type' component={TabMenuPaymentType} />
        <CustomFormLabel>
          <Text color='grey600' weight={500} size='14px'>
            <FormattedMessage
              id='modals.repayloan.choosewaytopay'
              defaultMessage='How do you want to repay?'
            />
          </Text>
        </CustomFormLabel>
        <Field
          name='repay-method'
          component={TabMenuPaymentMethod}
          {...{
            coin: principalDisplayName
          }}
        />
        <CustomFormLabel>
          <Text color='grey600' weight={500} size='14px'>
            <FormattedMessage
              id='modals.repayloan.repayfrom'
              defaultMessage='Repay from'
            />
          </Text>
        </CustomFormLabel>
        <CoinBalanceDropdown
          {...props}
          includeCustodial={false}
          coin='PAX'
          name='repay-principal'
        />
        <CustomFormLabel>
          <Text color='grey600' weight={500} size='14px'>
            <FormattedMessage
              id='modals.repayloan.repayamount'
              defaultMessage='Repay amount'
            />
          </Text>
        </CustomFormLabel>
        <AmountFieldContainer>
          <CustomField
            component={NumberBox}
            data-e2e='repayInput'
            name='amount'
            validate={[maximumAmount, minimumAmount]}
            {...{
              disabled: props.values
                ? props.values['repay-type'] === 'full'
                : false,
              errorBottom: true,
              errorLeft: true,
              errorIcon: 'alert-filled'
            }}
          />
          <PrincipalCcyAbsolute>
            <Text color='grey400' size='14px' weight={600}>
              {principalDisplayName}
            </Text>
          </PrincipalCcyAbsolute>
        </AmountFieldContainer>
      </Top>
      <Bottom>
        <InfoContainer>
          <Icon
            name='info'
            color='grey600'
            size='20px'
            style={{ marginRight: '8px' }}
          />
          <Text size='12px' color='grey600' weight={500}>
            <FormattedMessage
              id='modals.borrow.repayloan.info'
              defaultMessage='If we don’t receive the full outstanding amount in {principalCcy} we will automatically repay the remaining amount with {collateralCcy} collateral.'
              values={{
                principalCcy: principalDisplayName,
                collateralCcy: props.offer.terms.collateralCcy
              }}
            />
          </Text>
        </InfoContainer>
        {props.error && (
          <ErrorText>
            <Icon
              name='alert-filled'
              color='red600'
              style={{ marginRight: '4px' }}
            />
            Error: {props.error}
          </ErrorText>
        )}
        {!isSufficientEthForErc20 && (
          <ErrorText>
            <Icon
              name='alert-filled'
              color='red600'
              style={{ marginRight: '4px' }}
            />
            <FormattedMessage
              id='modals.borrow.repayloan.notenougheth'
              defaultMessage='ETH is required to send {principalDisplayName}. You do not have enough ETH to perform a transaction.'
              values={{ principalDisplayName }}
            />
          </ErrorText>
        )}
        <Button
          nature='primary'
          type='submit'
          data-e2e='repayLoanSubmit'
          disabled={
            props.submitting || props.invalid || !isSufficientEthForErc20
          }
          fullwidth
        >
          {props.submitting ? (
            <HeartbeatLoader height='16px' width='16px' color='white' />
          ) : (
            <Text size='16px' weight={600} color='white'>
              <FormattedMessage
                id='modals.borrow.repayloan.repay'
                defaultMessage='Complete Repayment'
              />
            </Text>
          )}
        </Button>
      </Bottom>
    </CustomForm>
  )
}

const mapStateToProps = state => ({
  values: selectors.form.getFormValues('repayLoanForm')(state)
})

// @ts-ignore
const enhance = compose(
  reduxForm<{}, Props>({ form: 'repayLoanForm', destroyOnUnmount: false }),
  connect(mapStateToProps)
)

type LinkStatePropsType = {
  values?: RepayLoanFormType
}

type FormProps = {
  onSubmit: () => void
}

export default enhance(Success) as React.FunctionComponent<Props>
