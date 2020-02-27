import { BorrowFormValuesType } from 'data/types'
import { Button, HeartbeatLoader, Icon, Text } from 'blockchain-info-components'
import { CheckBox, Form, FormItem } from 'components/Form'
import {
  coinToString,
  fiatToString
} from 'blockchain-wallet-v4/src/exchange/currency'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { Field, InjectedFormProps, reduxForm } from 'redux-form'
import { FlyoutWrapper } from 'components/Flyout'
import { FormattedHTMLMessage, FormattedMessage } from 'react-intl'
import { LinkDispatchPropsType, OwnProps, SuccessStateType } from '.'
import { selectors } from 'data'
import React from 'react'
import styled from 'styled-components'
import Terms from 'components/Terms'

const CustomForm = styled(Form)`
  height: 100%;
  display: flex;
  flex-direction: column;
`

const Top = styled(FlyoutWrapper)`
  height: 100%;
`

const TopText = styled(Text)`
  display: flex;
  width: 100%;
  align-items: center;
`

const Bottom = styled(FlyoutWrapper)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

const TermsContainer = styled.div`
  padding-top: 40px;
  border-top: 1px solid ${props => props.theme.grey100};
`

const BasicTerms = styled(Text)`
  font-weight: 500;
  line-height: 28px;
  margin: 40px 0;
  color: ${props => props.theme.grey600};
  b {
    color: ${props => props.theme.grey800};
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

const TermsFormItem = styled(FormItem)`
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  .Container {
    height: auto;
  }
`

const checkboxShouldBeChecked = value => (value ? undefined : true)

type LinkStatePropsType = {
  values?: BorrowFormValuesType
}

type FormProps = {
  onSubmit: () => void
}

type Props = OwnProps &
  SuccessStateType &
  LinkDispatchPropsType &
  LinkStatePropsType &
  FormProps

const Success: React.FC<InjectedFormProps<{}, Props> & Props> = props => {
  const principalAmt = fiatToString({
    value: props.values ? Number(props.values.principal) : 0,
    unit: { symbol: '$' }
  })

  const collateralAmt = coinToString({
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
  })

  return (
    <CustomForm onSubmit={props.handleSubmit}>
      <Top>
        <TopText color='grey900' size='20px' weight={600}>
          <Icon
            cursor
            style={{ marginRight: '24px' }}
            name='arrow-left'
            size='20px'
            color='grey600'
            onClick={() =>
              props.borrowActions.setStep({
                step: 'CHECKOUT',
                offer: props.offer
              })
            }
          />
          <FormattedMessage
            id='modals.borrow.confirm'
            defaultMessage='Confirm Loan'
          />
        </TopText>
        <BasicTerms>
          <FormattedHTMLMessage
            id='modals.borrow.basicterms'
            defaultMessage='You are requesting to borrow <b>{principalAmt}</b> and using <b>{collateralAmt}</b> as your collateral.'
            values={{
              principalAmt,
              collateralAmt
            }}
          />
        </BasicTerms>
        <TermsContainer>
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
                amount={collateralAmt}
              />
            </Field>
          </TermsFormItem>
        </TermsContainer>
      </Top>
      <Bottom>
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
                id='modals.borrow.confirm.create'
                defaultMessage='Create Loan'
              />
            </Text>
          )}
        </Button>
      </Bottom>
    </CustomForm>
  )
}

const mapStateToProps = state => ({
  values: selectors.form.getFormValues('borrowForm')(state)
})

const enhance = compose(
  reduxForm<{}, Props>({ form: 'borrowForm', destroyOnUnmount: false }),
  connect(mapStateToProps)
)

export default enhance(Success) as React.FunctionComponent<Props>
