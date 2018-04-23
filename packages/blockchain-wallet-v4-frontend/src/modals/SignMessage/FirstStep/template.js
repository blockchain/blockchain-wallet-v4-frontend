import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { Field, reduxForm } from 'redux-form'

import { Button, Separator, Text } from 'blockchain-info-components'
import { Form, FormGroup, FormItem, FormLabel, TextArea } from 'components/Form'

const FormRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
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
`

const FirstStep = props => {
  const { address, closeAll, disabled, handleSubmit, invalid, submitting } = props

  return (
    <Form override onSubmit={handleSubmit}>
      <FormRow>
        <Text weight={300}>
          <FormattedMessage id='modals.signmessage.firststep.address' defaultMessage='Address:' />
        </Text>
        <Text weight={200}>{address}</Text>
      </FormRow>
      <FormGroup inline margin={'15px'}>
        <FormItem width={'100%'}>
          <FormRow>
            <FormLabel for='message'>
              <FormattedMessage id='modals.signmessage.firststep.message' defaultMessage='Message:' />
            </FormLabel>
            <Field name='message' component={TextArea} placeholder='Thanks for accepting bitcoin!' />
          </FormRow>
        </FormItem>
      </FormGroup>
      <Separator/>
      <FormGroup>
        <SubmitRow>
          <ClickableText weight={300} onClick={closeAll}>
            <FormattedMessage id='modals.signmessage.close' defaultMessage='Close' />
          </ClickableText>
          <Button type='submit' nature='primary' uppercase disabled={disabled}>
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
  handleSubmit: PropTypes.func.isRequired
}

export default reduxForm({ form: 'signMessage', destroyOnUnmount: false })(FirstStep)
