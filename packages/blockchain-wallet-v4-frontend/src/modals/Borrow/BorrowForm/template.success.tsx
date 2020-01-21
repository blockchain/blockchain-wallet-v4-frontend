import { Field } from 'redux-form'
import { Form, FormLabel, NumberBox, SelectBoxBtcAddresses } from 'components/Form'
import { FormattedMessage } from 'react-intl'
import { LinkDispatchPropsType } from '.'
import { maximumAmount } from './validation'
import { PaymentType } from 'data/types'
import { Text } from 'blockchain-info-components'
import FiatDisplay from 'components/Display/FiatDisplay'
import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  padding: 40px;
  background: ${props => props.theme.grey000};
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

type Props = LinkDispatchPropsType & PaymentType

const Success: React.FC<Props> = (props) => {
  return (
    <Wrapper>
      {/* TODO: Borrow - make dynamic */}
      <Text color='grey900' size='24px' weight={600}><FormattedMessage id='modals.borrow.borrowusd' defaultMessage='Borrow USD' /></Text>
      <Form>
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
      </Form>
    </Wrapper>
  )
}

export default Success
