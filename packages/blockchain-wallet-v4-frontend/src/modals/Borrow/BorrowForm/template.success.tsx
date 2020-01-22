import { Button, Text } from 'blockchain-info-components'
import { Field } from 'redux-form'
import { Form, FormLabel, NumberBox, SelectBoxBtcAddresses } from 'components/Form'
import { FormattedMessage } from 'react-intl'
import { LinkDispatchPropsType } from '.'
import { maximumAmount } from './validation'
import { PaymentType } from 'data/components/borrow/types'
import { Summary } from '../Summary'
import FiatDisplay from 'components/Display/FiatDisplay'
import React, { FormEventHandler } from 'react'
import styled from 'styled-components'

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

type OwnProps = {
  // handleSubmit: (e: FormEventHandler) => void,
  onSubmit: (e: FormEventHandler) => void
}

type Props = OwnProps & LinkDispatchPropsType & PaymentType

const Success: React.FC<Props> = (props) => {
  return (
    <CustomForm onSubmit={props.onSubmit}>
      <Top>
        {/* TODO: Borrow - make dynamic */}
        <Text color='grey900' size='24px' weight={600}><FormattedMessage id='modals.borrow.borrowusd' defaultMessage='Borrow USD' /></Text>
        <CustomFormLabel>
          <Text color='grey600' weight={500} size='14px'>
            <FormattedMessage id='modals.borrow.iwanttoborrow' defaultMessage='I want to borrow' />
          </Text>
        </CustomFormLabel>
        <AmountFieldContainer>
          <CustomField component={NumberBox} errorBottom name='principal' autofocus max={props.effectiveBalance} validate={[maximumAmount]} />
          <MaxAmountContainer>
            <InlineText color='grey600' weight={500} size='12px'>
              <FormattedMessage id='modals.borrow.canborrow' defaultMessage='You can borrow up to' />
              <br />
              <FiatDisplay onClick={() => props.borrowActions.handleMaxCollateralClick()} cursor='pointer' color='blue600' size='12px' weight={500} coin='BTC'>{props.effectiveBalance}</FiatDisplay>
              {' '}USD Pax
              </InlineText>
          </MaxAmountContainer>
        </AmountFieldContainer>
        <CustomFormLabel>
          <Text color='grey600' weight={500} size='14px'>
            <FormattedMessage id='modals.borrow.collateralfrom' defaultMessage='Send collateral from' />
          </Text>
        </CustomFormLabel>
        {/* TODO: Borrow - handle other coins */}
        <Field component={SelectBoxBtcAddresses} includeAll={false} name='collateral' />
      </Top>
      <Bottom>
        <Summary />
        <div>
          <Button nature='primary'>
            <Text size='16px' weight={600} color='white'>
              <FormattedMessage id='modals.borrow.collateralform.create' defaultMessage='Create Loan' />
            </Text>
          </Button>
        </div>
      </Bottom>
    </CustomForm>
  )
}

export default Success
