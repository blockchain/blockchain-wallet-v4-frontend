import React from 'react'
import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'
import { Field, reduxForm } from 'redux-form'
import styled from 'styled-components'

import { Button, Text } from 'blockchain-info-components'
import { Form, FormGroup, FormItem, FormLabel, TextArea } from 'components/Form'
import { required } from 'services/forms'

const DetailRow = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;
  margin-bottom: 10px;
  > div:first-child {
    margin-right: 2px;
  }
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
  const { address, closeAll, handleSubmit, invalid, submitting } = props
  return (
    <Form onSubmit={handleSubmit}>
      <DetailRow>
        <Text size='14px' weight={500}>
          <FormattedMessage
            id='modals.signmessage.firststep.address'
            defaultMessage='Address:'
          />
        </Text>
        <Text size='14px' weight={400} data-e2e='signMessageAddressValue'>
          {address}
        </Text>
      </DetailRow>
      <FormGroup inline margin={'15px'}>
        <FormItem width={'100%'}>
          <FormLabel htmlFor='message'>
            <FormattedMessage
              id='modals.signmessage.firststep.message'
              defaultMessage='Message:'
            />
          </FormLabel>
          <Field
            name='message'
            component={TextArea}
            validate={[required]}
            placeholder='Thanks for accepting bitcoin!'
            data-e2e='signMessageInputField'
          />
        </FormItem>
      </FormGroup>
      <FormGroup>
        <SubmitRow>
          <ClickableText
            size='14px'
            weight={400}
            onClick={closeAll}
            data-e2e='signMessageCloseButton'
          >
            <FormattedMessage id='buttons.close' defaultMessage='Close' />
          </ClickableText>
          <Button
            type='submit'
            nature='primary'
            disabled={submitting || invalid}
            data-e2e='signMessageButton'
          >
            <FormattedMessage
              id='modals.signmessage.firststep.sign'
              defaultMessage='Sign'
            />
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

export default reduxForm({ form: 'signMessage', destroyOnUnmount: false })(
  FirstStep
)
