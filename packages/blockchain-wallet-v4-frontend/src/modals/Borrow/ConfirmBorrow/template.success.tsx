import React from 'react'
import { FormattedHTMLMessage, FormattedMessage } from 'react-intl'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { Field, InjectedFormProps, reduxForm } from 'redux-form'
import styled from 'styled-components'

import { Button, HeartbeatLoader, Icon, Text } from 'blockchain-info-components'
import { fiatToString } from 'blockchain-wallet-v4/src/exchange/currency'
import CoinDisplay from 'components/Display/CoinDisplay'
import { FlyoutWrapper } from 'components/Flyout'
import { CheckBox, Form, FormItem } from 'components/Form'
import Terms from 'components/Terms'
import { selectors } from 'data'
import { BorrowFormValuesType } from 'data/types'

import { LinkDispatchPropsType, OwnProps, SuccessStateType } from '.'

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
  * {
    display: inline;
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
  label {
    align-items: start;
    &:before {
      margin-top: 2px;
    }
    &:after {
      top: 9px;
    }
  }
`

const checkboxShouldBeChecked = value => (value ? undefined : true)

const Success: React.FC<InjectedFormProps<{}, Props> & Props> = props => {
  const principalAmt = fiatToString({
    value: props.values ? Number(props.values.principal) : 0,
    unit: 'USD'
  })

  const collateralAmt =
    props.payment.coin === 'BTC'
      ? props.payment.amount
        ? props.payment.amount.reduce((x, y) => x + y)
        : 0
      : 0

  const networkFee =
    props.payment.coin === 'BTC'
      ? props.payment.selection
        ? props.payment.selection.fee
        : 0
      : 0

  const total = collateralAmt + networkFee

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
            id='modals.borrow.basicterms1'
            defaultMessage='You are requesting to borrow <b>{principalAmt}</b> and using'
            values={{
              principalAmt
            }}
          />{' '}
          <CoinDisplay
            coin={props.offer.terms.collateralCcy}
            color='grey800'
            weight={600}
          >
            {collateralAmt}
          </CoinDisplay>
          <FormattedMessage
            id='modals.borrow.basicterms2'
            defaultMessage='as your collateral. The network fee to send your collateral is'
          />{' '}
          <CoinDisplay
            coin={props.offer.terms.collateralCcy}
            color='grey800'
            weight={600}
          >
            {networkFee}
          </CoinDisplay>
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
                total={total}
                collateralAmt={collateralAmt}
                coin={props.offer.terms.collateralCcy}
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

export default enhance(Success) as React.FunctionComponent<Props>
