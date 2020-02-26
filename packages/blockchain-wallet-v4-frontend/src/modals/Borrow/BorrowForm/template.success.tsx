import { BorrowFormValuesType } from 'data/components/borrow/types'
import { Button, HeartbeatLoader, Icon, Text } from 'blockchain-info-components'
import { CheckBox, Form, FormItem, FormLabel, NumberBox } from 'components/Form'
import { coinToString } from 'blockchain-wallet-v4/src/exchange/currency'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { Field, InjectedFormProps, reduxForm } from 'redux-form'
import { FlyoutWrapper } from 'components/Flyout'
import { FormattedMessage } from 'react-intl'
import { LinkDispatchPropsType, OwnProps, SuccessStateType } from '.'
import { maximumAmount, minimumAmount } from './validation'
import { selectors } from 'data'
import BorrowCoinDropdown from './BorrowCoinDropdown'
import FiatDisplay from 'components/Display/FiatDisplay'
import React from 'react'
import styled from 'styled-components'
import Summary from './Summary'
import Terms from 'components/Terms'

const CustomForm = styled(Form)`
  height: 100%;
  display: flex;
  flex-direction: column;
`

const Top = styled(FlyoutWrapper)`
  padding-bottom: 0px;
`

const TopText = styled(Text)`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
`

const Bottom = styled(FlyoutWrapper)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
`

const CustomFormLabel = styled(FormLabel)`
  display: block;
  margin-top: 24px;
`

const CustomField = styled(Field)`
  > input {
    padding-left: 50px;
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

const MaxAmountContainer = styled.div`
  align-items: center;
  display: flex;
  margin-top: 16px;
`

const FiatContainer = styled.div`
  cursor: pointer;
  display: inline-block;
  padding: 4px 8px;
  border-radius: 20px;
  background-color: ${props => props.theme.grey000};
`

const TermsFormItem = styled(FormItem)`
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  .Container {
    height: auto;
  }
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

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  > button {
    height: 48px !important;
    width: 45% !important;
    padding: 15px !important;
  }
`

type LinkStatePropsType = {
  values?: BorrowFormValuesType
}

export type Props = OwnProps &
  SuccessStateType &
  LinkDispatchPropsType &
  LinkStatePropsType

const checkboxShouldBeChecked = value => (value ? undefined : true)

const Success: React.FC<InjectedFormProps & Props> = props => {
  // TODO: Borrow - make dynamic
  const displayName = props.supportedCoins['PAX'].displayName

  return (
    <CustomForm onSubmit={props.handleSubmit}>
      <Top>
        <TopText color='grey900' size='20px' weight={600}>
          <FormattedMessage
            id='modals.borrow.borrowusd'
            defaultMessage='Borrow {displayName}'
            values={{ displayName }}
          />
          <Icon
            onClick={props.handleClose}
            cursor
            name='close'
            size='20px'
            color='grey600'
          />
        </TopText>
        <MaxAmountContainer>
          <Text color='grey600' weight={500} size='14px'>
            <FormattedMessage
              id='modals.borrow.canborrow'
              defaultMessage='You can borrow up to'
            />{' '}
            <FiatContainer
              onClick={() => props.borrowActions.handleMaxCollateralClick()}
            >
              <FiatDisplay
                cursor='pointer'
                color='blue600'
                size='14px'
                weight={500}
                coin='BTC'
                currency='USD'
                rates={props.rates}
              >
                {props.limits.maxCrypto}
              </FiatDisplay>
            </FiatContainer>{' '}
            {displayName}{' '}
            <FormattedMessage
              id='modals.borrow.basedonwallet'
              defaultMessage="based on the selected Wallet's balance."
            />
          </Text>
        </MaxAmountContainer>
        <CustomFormLabel>
          <Text color='grey600' weight={500} size='14px'>
            <FormattedMessage
              id='modals.borrow.collateralfrom'
              defaultMessage='Send collateral from'
            />
          </Text>
        </CustomFormLabel>
        <BorrowCoinDropdown {...props} name='collateral' />
        <CustomFormLabel>
          <Text color='grey600' weight={500} size='14px'>
            <FormattedMessage
              id='modals.borrow.enterloanamt'
              defaultMessage='Enter loan amount'
            />
          </Text>
        </CustomFormLabel>
        <AmountFieldContainer>
          <CustomField
            component={NumberBox}
            data-e2e='principalInput'
            name='principal'
            validate={[maximumAmount, minimumAmount]}
            {...{
              autoFocus: true,
              errorBottom: true,
              errorLeft: true,
              errorIcon: 'alert-filled'
            }}
          />
          <PrincipalCcyAbsolute>
            <Text color='grey400' size='14px' weight={600}>
              USD
            </Text>
          </PrincipalCcyAbsolute>
        </AmountFieldContainer>
      </Top>
      <Bottom>
        <>
          <Summary
            {...props}
            {...props.values}
            collateral={0}
            displayName={displayName}
          />
          <div>
            <TermsFormItem>
              <Field
                name='blockchain-loan-agreement'
                validate={[checkboxShouldBeChecked]}
                component={CheckBox}
                hideErrors
                data-e2e='blockchain-loan-agreement'
              >
                <Terms company='blockchain-loan-agreement' />
              </Field>
            </TermsFormItem>
            <TermsFormItem>
              <Field
                name='blockchain-loan-transfer'
                validate={[checkboxShouldBeChecked]}
                component={CheckBox}
                hideErrors
                data-e2e='blockchain-loan-transfer'
              >
                <Terms
                  company='blockchain-loan-transfer'
                  amount={coinToString({
                    value: props.values
                      ? props.values.principal
                        ? (Number(props.values.principal) /
                            (props.rates[props.offer.terms.principalCcy]
                              ? props.rates[props.offer.terms.principalCcy].last
                              : props.rates['USD'].last)) *
                          props.offer.terms.collateralRatio
                        : 0
                      : 0,
                    unit: { symbol: props.offer.terms.collateralCcy }
                  })}
                />
              </Field>
            </TermsFormItem>
          </div>
          <div>
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
            <ButtonContainer>
              <Button
                nature='empty'
                data-e2e='borrowCancel'
                onClick={props.handleClose}
              >
                <Text size='16px' weight={600} color='blue600'>
                  <FormattedMessage
                    id='modals.borrow.collateralform.cancel'
                    defaultMessage='Cancel'
                  />
                </Text>
              </Button>
              <Button
                nature='primary'
                type='submit'
                data-e2e='borrowSubmit'
                disabled={props.submitting || props.invalid}
              >
                {props.submitting ? (
                  <HeartbeatLoader height='16px' width='16px' color='white' />
                ) : (
                  <Text size='16px' weight={600} color='white'>
                    <FormattedMessage
                      id='modals.borrow.collateralform.create'
                      defaultMessage='Create Loan'
                    />
                  </Text>
                )}
              </Button>
            </ButtonContainer>
          </div>
        </>
      </Bottom>
    </CustomForm>
  )
}

const mapStateToProps = state => ({
  values: selectors.form.getFormValues('borrowForm')(state)
})

const enhance = compose<any>(
  reduxForm({ form: 'borrowForm', destroyOnUnmount: false }),
  connect(mapStateToProps)
)

export default enhance(Success)
