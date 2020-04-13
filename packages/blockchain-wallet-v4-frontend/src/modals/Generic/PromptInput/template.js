import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader
} from 'blockchain-info-components'
import { Field, reduxForm } from 'redux-form'
import {
  Form,
  FormGroup,
  FormItem,
  PasswordBox,
  TextBox
} from 'components/Form'
import { FormattedMessage } from 'react-intl'
import { required } from 'services/FormHelper'
import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  font-weight: 400;
  color: ${props => props.theme.grey700};
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
    Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
`

const PromptTemplate = ({
  position,
  total,
  close,
  submitting,
  invalid,
  title,
  secret,
  handleSubmit,
  maxLength,
  validations,
  pristine
}) => {
  return (
    <Modal size='large' position={position} total={total}>
      <Form onSubmit={handleSubmit}>
        <Wrapper>
          <ModalHeader icon='pencil' onClose={close}>
            {title}
          </ModalHeader>
          <ModalBody>
            <FormGroup>
              <FormItem data-e2e='inputModalInputField'>
                <Field
                  name='value'
                  validate={[required, ...validations]}
                  component={secret ? PasswordBox : TextBox}
                  maxLength={maxLength}
                />
              </FormItem>
            </FormGroup>
          </ModalBody>
          <ModalFooter align='right'>
            <Button
              type='submit'
              nature='primary'
              capitalize
              disabled={submitting || invalid || pristine}
              data-e2e='inputModalSubmitButton'
            >
              <FormattedMessage
                id='modals.prompt.button'
                defaultMessage='Submit'
              />
            </Button>
          </ModalFooter>
        </Wrapper>
      </Form>
    </Modal>
  )
}

export default reduxForm({ form: 'promptInputModal' })(PromptTemplate)
