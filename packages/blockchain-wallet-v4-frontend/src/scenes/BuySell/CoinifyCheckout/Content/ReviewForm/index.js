import React from 'react'
import styled from 'styled-components'
import { Field, reduxForm } from 'redux-form'
import { FormattedMessage } from 'react-intl'
import { HeartbeatLoader, Text, Link } from 'blockchain-info-components'
import { Remote } from 'blockchain-wallet-v4/src'

import { CenteredWrapper } from 'components/IdentityVerification'
import { SubmitButton } from 'components/BuySell/styled'
import { CheckBox } from 'components/Form'
import { required } from 'services/FormHelper'
import media from 'services/ResponsiveService'

const OrderSubmitForm = styled.form`
  width: 450px;
  padding-bottom: 30px;
  margin: 0 auto;
  ${media.mobile`
    width: 90%;
  `}
`
const TermsWrapper = styled.div`
  display: flex;
  margin-bottom: 30px;
`
const TermsLabel = styled.label`
  padding-top: 3px;
`
const MarginCenteredWrapper = styled(CenteredWrapper)`
  margin-bottom: 50px;
`

const ReviewForm = props => {
  const { invalid, submitting, busy, onSubmit, quoteR } = props

  return (
    <OrderSubmitForm>
      <TermsWrapper>
        <Field
          name='terms'
          validate={[required]}
          component={CheckBox}
          hideErrors
        />
        <TermsLabel htmlFor='terms'>
          <Text size='11px' weight={400}>
            <FormattedMessage
              id='scenes.buysell.coinify.sell.orderreview.accept_terms'
              defaultMessage="By clicking here, I accept that Coinify will process my order upon receipt of funds, and that the order will be executed at the available exchange rate at that time, which may differ from the displayed rate. I also accept Coinify's {terms}."
              values={{
                terms: (
                  <Link
                    size='11px'
                    weight={400}
                    href='https://www.coinify.com/legal'
                    target='_blank'
                    rel='noreferrer noopener'
                  >
                    <FormattedMessage
                      id='components.terms.coinify.tos'
                      defaultMessage='Terms of Service'
                    />
                  </Link>
                )
              }}
            />
          </Text>
        </TermsLabel>
      </TermsWrapper>
      <MarginCenteredWrapper>
        <SubmitButton
          nature='primary'
          fullwidth
          disabled={submitting || invalid || !Remote.Success.is(quoteR) || busy}
          onClick={onSubmit}
        >
          {busy ? (
            <HeartbeatLoader height='20px' width='20px' color='white' />
          ) : (
            <FormattedMessage id='submit' defaultMessage='Submit' />
          )}
        </SubmitButton>
      </MarginCenteredWrapper>
    </OrderSubmitForm>
  )
}

export default reduxForm({ form: 'reviewForm' })(ReviewForm)
