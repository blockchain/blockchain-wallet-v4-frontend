import React from 'react'
import { reduxForm, Field } from 'redux-form'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'
import { spacing } from 'services/StyleService'

import { Button, HeartbeatLoader, Text, Link } from 'blockchain-info-components'
import {
  Form,
  ColLeft,
  InputWrapper,
  PartnerHeader,
  PartnerSubHeader,
  ColRight
} from 'components/IdentityVerification'
import { getRateFromQuote } from 'services/CoinifyService'

const SummaryWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px;
  background-color: ${props => props.theme['white-blue']};
  border: 0.5px solid #dddddd;
`
const SummaryRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  border-bottom: ${props => (props.borderBottom ? '1px solid #DDDDDD' : '')};
  padding: 9px;
`
const RateContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
`
const EditAmountContainer = styled(RateContainer)
const Unit = styled.div`
  position: absolute;
  font-size: 11px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 20px;
`

const withinLimits = (val, allValues, { medium, value: { limits, quote } }) => {
  const curr = quote.baseCurrency
  return val >= limits[medium].minimumInAmounts[curr] &&
    val <= limits[medium].inRemaining[curr]
    ? undefined
    : 'nope'
}

const Confirm = props => {
  const {
    value,
    handleSubmit,
    busy,
    invalid,
    submitting,
    medium,
    toggleEdit,
    editingAmount,
    isEditing,
    limitsError
  } = props
  const { quote, mediums, limits } = value
  const { quoteAmount, baseAmount, baseCurrency } = quote
  const { total, fee } = mediums[medium]

  const subHeaderHelper = () => {
    const curr = quote.baseCurrency
    if (editingAmount < limits[medium].minimumInAmounts[curr]) {
      return (
        <Text color='error'>
          <FormattedMessage
            id='coinifyexchangedata.confirm.underlimit'
            defaultMessage='Under the limit'
          />
        </Text>
      )
    }
    if (editingAmount > limits[medium].inRemaining[curr]) {
      return (
        <Text color='error'>
          <FormattedMessage
            id='coinifyexchangedata.confirm.overlimit'
            defaultMessage='Over the limit'
          />
        </Text>
      )
    }
    return (
      <FormattedMessage
        id='coinifyexchangedata.confirm.subheader'
        defaultMessage='Please confirm your order details before we redirect you to our secure payment provider.'
      />
    )
  }

  return (
    <Form onSubmit={handleSubmit}>
      <ColLeft>
        <InputWrapper style={spacing('mb-20')}>
          <PartnerHeader>
            <FormattedMessage
              id='coinifyexchangedata.confirm.header'
              defaultMessage='Confirm Buy Order'
            />
          </PartnerHeader>
          <PartnerSubHeader>{subHeaderHelper()}</PartnerSubHeader>
        </InputWrapper>
        <RateContainer style={spacing('mb-10')}>
          {quote ? (
            <Text size='12px' weight={300}>
              {getRateFromQuote(quote)}
            </Text>
          ) : (
            <span>Loading...</span>
          )}
        </RateContainer>
        <SummaryWrapper>
          <SummaryRow borderBottom>
            <Text size='13px' weight={300}>
              BTC
            </Text>
            <Text size='13px' weight={300}>
              {quoteAmount / 1e8}
            </Text>
          </SummaryRow>
          <SummaryRow>
            <Text size='13px' weight={300}>
              <FormattedMessage
                id='coinifyexchangedata.confirm.amount'
                defaultMessage='Amount'
              />
            </Text>
            {!isEditing ? (
              <Text size='13px' weight={300}>
                {baseAmount * -1}
              </Text>
            ) : (
              <EditAmountContainer>
                <Field
                  name='amount'
                  component='input'
                  type='number'
                  validate={withinLimits}
                />
                <Unit>{baseCurrency}</Unit>
              </EditAmountContainer>
            )}
          </SummaryRow>
          <SummaryRow borderBottom>
            <Text size='13px' weight={300}>
              <FormattedMessage
                id='coinifyexchangedata.confirm.fee'
                defaultMessage='Payment Fee'
              />
            </Text>
            <Text size='13px' weight={300}>
              {fee}
            </Text>
          </SummaryRow>
          <SummaryRow>
            <Text size='13px' weight={300}>
              <FormattedMessage
                id='coinifyexchangedata.confirm.totalcost'
                defaultMessage='Total Cost'
              />
            </Text>
            <Text size='13px' weight={300}>
              {total}
            </Text>
          </SummaryRow>
        </SummaryWrapper>
        <RateContainer style={spacing('mt-10')}>
          <Link size='12px' weight={300} onClick={toggleEdit}>
            {!isEditing ? (
              <FormattedMessage
                id='coinifyexchangedata.confirm.editorder'
                defaultMessage='Edit Order'
              />
            ) : (
              <FormattedMessage
                id='coinifyexchangedata.confirm.canceledit'
                defaultMessage='Cancel'
              />
            )}
          </Link>
        </RateContainer>
      </ColLeft>
      <ColRight>
        <Button
          nature='primary'
          fullwidth
          type='submit'
          disabled={
            invalid ||
            submitting ||
            busy ||
            (isEditing && (limitsError || !editingAmount))
          }
        >
          {!busy && !isEditing ? (
            <FormattedMessage
              id='coinifyexchangedata.confirm.confirm'
              defaultMessage='Confirm'
            />
          ) : isEditing ? (
            <FormattedMessage
              id='coinifyexchangedata.confirm.update'
              defaultMessage='Update'
            />
          ) : (
            <HeartbeatLoader height='20px' width='20px' color='white' />
          )}
        </Button>
      </ColRight>
    </Form>
  )
}

export default reduxForm({ form: 'coinifyConfirm' })(Confirm)
