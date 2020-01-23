import {
  BorrowFormValuesType,
  OfferType,
  PaymentType
} from 'data/components/borrow/types'
import { Button, HeartbeatLoader, Text } from 'blockchain-info-components'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { Field, InjectedFormProps, reduxForm } from 'redux-form'
import {
  Form,
  FormLabel,
  NumberBox,
  SelectBoxBtcAddresses
} from 'components/Form'
import { FormattedMessage } from 'react-intl'
import { LinkDispatchPropsType, SuccessStateType } from '.'
import { maximumAmount } from './validation'
import { selectors } from 'data'
import { values } from 'ramda'
import FiatDisplay from 'components/Display/FiatDisplay'
import React from 'react'
import styled from 'styled-components'
import Summary from '../Summary'

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
`

const AmountFieldContainer = styled.div`
  display: flex;
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

type LinkStatePropsType = {
  values: BorrowFormValuesType
}

type Props = SuccessStateType & LinkDispatchPropsType & LinkStatePropsType

const Success: React.FC<InjectedFormProps & Props> = props => {
  return (
    <CustomForm onSubmit={props.handleSubmit}>
      <Top>
        {/* TODO: Borrow - make dynamic */}
        <Text color='grey900' size='24px' weight={600}>
          <FormattedMessage
            id='modals.borrow.borrowusd'
            defaultMessage='Borrow USD'
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
            component={NumberBox}
            data-e2e='principalInput'
            name='principal'
            validate={[maximumAmount]}
          />
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
              USD Pax
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
        <Summary
          rates={props.rates}
          collateral={0}
          principal={props.values.principal}
          offer={props.offers[0]}
        />
        <div>
          <Button nature='primary' type='submit' disabled={props.submitting}>
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
