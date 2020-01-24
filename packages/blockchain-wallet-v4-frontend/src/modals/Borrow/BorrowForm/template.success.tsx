import { BorrowFormValuesType } from 'data/components/borrow/types'
import { Button, HeartbeatLoader, Text } from 'blockchain-info-components'
import {
  CheckBox,
  Form,
  FormItem,
  FormLabel,
  NumberBox,
  SelectBoxBtcAddresses
} from 'components/Form'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { Field, InjectedFormProps, reduxForm } from 'redux-form'
import { FormattedMessage } from 'react-intl'
import { LinkDispatchPropsType, SuccessStateType } from '.'
import { maximumAmount, minimumAmount } from './validation'
import { selectors } from 'data'
import FiatDisplay from 'components/Display/FiatDisplay'
import React from 'react'
import styled from 'styled-components'
import Summary from '../Summary'
import Terms from 'components/Terms'

const CustomForm = styled(Form)`
  height: 100%;
  display: flex;
  flex-direction: column;
`
const Padded = styled.div`
  padding: 40px;
`

const Top = styled(Padded)`
  background: ${props => props.theme.grey000};
`

const Bottom = styled(Padded)`
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
  width: 50%;
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
  justify-content: center;
  align-items: center;
  display: flex;
  width: 45%;
`

const InlineText = styled(Text)`
  * {
    display: inline-flex;
  }
`

const TermsFormItem = styled(FormItem)`
  display: flex;
  align-items: center;
`

type LinkStatePropsType = {
  values: BorrowFormValuesType
}

type Props = SuccessStateType & LinkDispatchPropsType & LinkStatePropsType

const checkboxShouldBeChecked = value => (value ? undefined : true)

const Success: React.FC<InjectedFormProps & Props> = props => {
  const offer = props.offers.find(
    offer =>
      offer.terms.collateralCcy === props.coin &&
      offer.terms.principalCcy === 'PAX'
  )

  const displayName = props.supportedCoins['PAX'].displayName

  return (
    <CustomForm onSubmit={props.handleSubmit}>
      <Top>
        {/* TODO: Borrow - make dynamic */}
        <Text color='grey900' size='24px' weight={600}>
          <FormattedMessage
            id='modals.borrow.borrowusd'
            defaultMessage='Borrow {displayName}'
            values={{ displayName }}
          />
        </Text>
        <CustomFormLabel>
          <Text color='grey600' weight={500} size='14px'>
            <FormattedMessage
              id='modals.borrow.iwanttoborrow'
              defaultMessage='I want to borrow'
            />
          </Text>
        </CustomFormLabel>
        <AmountFieldContainer>
          <CustomField
            // @ts-ignore
            autoFocus
            component={NumberBox}
            data-e2e='principalInput'
            name='principal'
            validate={[maximumAmount, minimumAmount]}
          />
          <PrincipalCcyAbsolute>
            <Text color='grey400' size='14px' weight={600}>
              USD
            </Text>
          </PrincipalCcyAbsolute>
          <MaxAmountContainer>
            <InlineText color='grey600' weight={500} size='12px'>
              <FormattedMessage
                id='modals.borrow.canborrow'
                defaultMessage='You can borrow up to'
              />
              <br />
              <FiatDisplay
                onClick={() => props.borrowActions.handleMaxCollateralClick()}
                cursor='pointer'
                color='blue600'
                size='12px'
                weight={500}
                coin='BTC'
              >
                {props.payment.effectiveBalance}
              </FiatDisplay>{' '}
              {displayName}
            </InlineText>
          </MaxAmountContainer>
        </AmountFieldContainer>
        <CustomFormLabel>
          <Text color='grey600' weight={500} size='14px'>
            <FormattedMessage
              id='modals.borrow.collateralfrom'
              defaultMessage='Send collateral from'
            />
          </Text>
        </CustomFormLabel>
        {/* TODO: Borrow - handle other coins */}
        <Field
          component={SelectBoxBtcAddresses}
          includeAll={false}
          name='collateral'
        />
      </Top>
      <Bottom>
        {offer ? (
          <>
            <Summary
              {...props}
              {...props.values}
              collateral={0}
              displayName={displayName}
              offer={offer}
            />
            {/* <div>
              <TermsFormItem>
                <Field
                  name='blockchain-loan-agreement'
                  validate={[checkboxShouldBeChecked]}
                  component={CheckBox}
                  data-e2e='blockchain-loan-agreement'
                />
                <Terms company='blockchain-loan-agreement' />
              </TermsFormItem>
              <TermsFormItem>
                <Field
                  name='blockchain-loan-transfer'
                  validate={[checkboxShouldBeChecked]}
                  component={CheckBox}
                  data-e2e='blockchain-loan-transfer'
                />
                <Terms company='blockchain-loan-transfer' amount={props.values} />
              </TermsFormItem>
            </div> */}
            <div>
              <Button
                nature='primary'
                type='submit'
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
            </div>
          </>
        ) : (
          <Text color='grey700' weight={600} size='16px'>
            There is no loan offer for {props.coin} to {displayName}
          </Text>
        )}
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
