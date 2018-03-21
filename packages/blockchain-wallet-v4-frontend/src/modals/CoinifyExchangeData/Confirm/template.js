import React from 'react'
import PropTypes from 'prop-types'
import { reduxForm } from 'redux-form'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'
import { spacing } from 'services/StyleService'

import { Button, HeartbeatLoader, Text } from 'blockchain-info-components'
import { Form, ColLeft, InputWrapper, PartnerHeader, PartnerSubHeader, ColRight } from 'components/BuySell/Signup'

const SummaryWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px;
  background-color: #F5F7F9;
  border: 0.5px solid #DDDDDD;
`
const SummaryRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  border-bottom: ${props => props.borderBottom ? '1px solid #DDDDDD' : ''};
  padding: 9px;
`

const Confirm = (props) => {
  const { ui, onSubmit, busy, invalid, submitting, quote, medium } = props
  const { quoteAmount, baseAmount, baseCurrency, paymentMediums } = quote
  const { total, fee } = paymentMediums[medium]

  return (
    <Form onSubmit={onSubmit}>
      <ColLeft>
        <InputWrapper style={spacing('mb-20')}>
          <PartnerHeader>
            <FormattedMessage id='coinifyexchangedata.confirm.header' defaultMessage='Confirm Buy Order' />
          </PartnerHeader>
          <PartnerSubHeader>
            <FormattedMessage id='coinifyexchangedata.confirm.subheader' defaultMessage='Please confirm your order details before we redirect you to our secure payment provider.' />
          </PartnerSubHeader>
        </InputWrapper>
        <SummaryWrapper>
          <SummaryRow borderBottom>
            <Text size='13px'>
              BTC
            </Text>
            <Text size='13px'>
              { quoteAmount / 1e8 }
            </Text>
          </SummaryRow>
          <SummaryRow>
            <Text size='13px'>
              <FormattedMessage id='coinifyexchangedata.confirm.amount' defaultMessage='Amount' />
            </Text>
            <Text size='13px'>
              { baseAmount * -1 }
            </Text>
          </SummaryRow>
          <SummaryRow borderBottom>
            <Text size='13px'>
              <FormattedMessage id='coinifyexchangedata.confirm.fee' defaultMessage='Payment Fee' />
            </Text>
            <Text size='13px'>
              { fee }
            </Text>
          </SummaryRow>
          <SummaryRow>
            <Text size='13px'>
              <FormattedMessage id='coinifyexchangedata.confirm.totalcost' defaultMessage='Total Cost' />
            </Text>
            <Text size='13px'>
              { total }
            </Text>
          </SummaryRow>
        </SummaryWrapper>
      </ColLeft>
      <ColRight>
        <Button uppercase nature='primary' fullwidth type='submit' disabled={invalid || submitting || busy}>
          {
            !busy
              ? <FormattedMessage id='coinifyexchangedata.confirm.confirm' defaultMessage='confirm' />
              : <HeartbeatLoader height='20px' width='20px' color='white' />
          }
        </Button>
        {/* <Helper1 />
        <Helper2 /> */}
      </ColRight>
    </Form>
  )
}

export default reduxForm({ form: 'coinifyConfirm' })(Confirm)
