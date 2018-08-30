import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import { Field, reduxForm } from 'redux-form'
import { not, is } from 'ramda'

import { Text } from 'blockchain-info-components'
import { Form, FormGroup, FormItem, CheckBox, SelectBox, DateBoxDebounced } from 'components/Form'
import moment from 'services/MomentHelper'
import { recurringTimeHelper } from 'services/CoinifyService'

const RecurringWrapper = styled.div`
  position: relative;
  top: 30px;
`
const TermsWrapper = styled.div`
  display: flex;
  margin-bottom: 20px;
  margin-top: 20px;
`
const TermsLabel = styled.label`
  display: flex;
  align-items: center;
  opacity: ${props => props.disabled ? '0.5' : '1'};
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
`
const FieldsContainer = styled.div`
  display: flex;
  flex-direction: column;
`
const FrequencyText = styled(Text)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-top: 16px;
`

const isValidStartDate = current => {
  const yesterday = moment().subtract(1, 'day')
  return current.isAfter(yesterday)
}

const RecurringCheckout = props => {
  const { frequency, duration, frequencyElements, handleSubmit, disableRecurringCheckbox, showModal } = props
  return <RecurringWrapper>
    <TermsWrapper>
      <Field name='recurring' component={CheckBox} hideErrors disabled={disableRecurringCheckbox} checked={showModal} />
      <TermsLabel htmlFor='recurring' disabled={disableRecurringCheckbox}>
        <Text size='13px' weight={400}>
          <FormattedMessage id='scenes.buysell.coinify.recurring.makerecurringorder' defaultMessage='Make this a recurring order' />
        </Text>
      </TermsLabel>
    </TermsWrapper>
    {
      showModal
        ? <FieldsContainer>
          <Form onSubmit={handleSubmit}>
            <FormGroup inline>
              <FormItem width='150px'>
                <Text size='13px' weight={400}>
                  <FormattedMessage id='scenes.buysell.coinify.recurring.frequency' defaultMessage='Frequency:' />
                </Text>
                <Field
                  name='frequency'
                  component={SelectBox}
                  elements={frequencyElements}
                  searchEnabled={false}
                />
              </FormItem>
              <FrequencyText size='13px' weight={300}>
                <FormattedMessage id='scenes.buysell.coinify.recurring.frequencymessage' defaultMessage='Today and every {freq}' values={{ freq: recurringTimeHelper({ frequency: frequency }) }} />
              </FrequencyText>
            </FormGroup>
            <FormGroup inline>
              <FormItem width='150px'>
                <Text size='13px' weight={400}>
                  <FormattedMessage id='scenes.buysell.coinify.recurring.duration' defaultMessage='Duration:' />
                </Text>
                <Field
                  name='duration'
                  component={DateBoxDebounced}
                  // validate={[required, validStartDate]}
                  disableOnClickOutside={false}
                  isValidDate={isValidStartDate}
                  defaultValue='Until you cancel'
                />
              </FormItem>
              <FrequencyText size='13px' weight={300}>
                {
                  duration && not(is(String, duration))
                    ? <FormattedMessage id='scenes.buysell.coinify.recurring.repeatuntil' defaultMessage='This order will repeat until {endTime}' values={{ endTime: duration.format('DD MMM YYYY') }} />
                    : <FormattedMessage id='scenes.buysell.coinify.recurring.cancelanytime' defaultMessage='You can cancel anytime' />
                }
              </FrequencyText>
            </FormGroup>
          </Form>
        </FieldsContainer>
        : null
    }
  </RecurringWrapper>
}

RecurringCheckout.propTypes = {
  frequency: PropTypes.string.isRequired,
  duration: PropTypes.object,
  frequencyElements: PropTypes.array.isRequired
}

export const RecurringBuyCheckout = reduxForm({
  form: 'coinifyRecurringCheckout',
  destroyOnUnmount: false
})(RecurringCheckout)
