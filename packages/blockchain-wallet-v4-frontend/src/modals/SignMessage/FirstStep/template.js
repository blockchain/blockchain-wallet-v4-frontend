import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { Field, reduxForm } from 'redux-form'

import { required } from 'services/FormHelper'
import { Button, Text } from 'blockchain-info-components'
import { Form, FormGroup, FormItem, FormLabel, TextArea } from 'components/Form'

const DetailRow = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;
  margin-bottom: 10px;
  > div:first-child { margin-right: 2px; }
`
const SubmitRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  width: 100%;
`
const ClickableText = styled(Text)`
  cursor: pointer;
  margin-right: 15px;
`

const FirstStep = props => {
  const { address, closeAll, submitting, invalid, handleSubmit } = props
  return (
    <Form onSubmit={handleSubmit}>
      <DetailRow>
        <Text size='14px' weight={400}>
          <FormattedMessage id='modals.signmessage.firststep.address' defaultMessage='Address:' />
        </Text>
        <Text size='14px' weight={300}>{address}</Text>
      </DetailRow>
      <FormGroup inline margin={'15px'}>
        <FormItem width={'100%'}>
          <FormLabel for='message'>
            <FormattedMessage id='modals.signmessage.firststep.message' defaultMessage='Message:' />
          </FormLabel>
          <Field name='message' component={TextArea} validate={[required]} placeholder='Thanks for accepting bitcoin!' />
        </FormItem>
      </FormGroup>
      <FormGroup>
        <SubmitRow>
          <ClickableText size='14px' weight={300} onClick={closeAll}>
            <FormattedMessage id='modals.signmessage.close' defaultMessage='Close' />
          </ClickableText>
          <Button type='submit' nature='primary' disabled={submitting || invalid}>
            <FormattedMessage id='modals.signmessage.firststep.sign' defaultMessage='Sign' />
          </Button>
        </SubmitRow>
      </FormGroup>
    </Form>
  )
}

FirstStep.propTypes = {
  invalid: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  address: PropTypes.string.isRequired,
  closeAll: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired
}

export default reduxForm({ form: 'signMessage', destroyOnUnmount: false })(FirstStep)
