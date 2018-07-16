import React from 'react'
import styled from 'styled-components'
import { required } from 'services/FormHelper'
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from 'blockchain-info-components'
import { FormattedMessage } from 'react-intl'
import { Field, reduxForm } from 'redux-form'
import {
  Form,
  FormGroup,
  FormItem,
  TextBox,
  PasswordBox
} from 'components/Form'

const Wrapper = styled.div`
  font-weight: 300;
  color: ${props => props.theme['gray-5']};
  font-family: 'Montserrat', Helvetica, sans-serif;
`

const PromptTemplate = ({
  position,
  total,
  close,
  submitting,
  invalid,
  title,
  secret = false,
  handleSubmit
}) => (
  <Modal size='large' position={position} total={total}>
    <Form onSubmit={handleSubmit}>
      <Wrapper>
        <ModalHeader icon='pencil' onClose={close}>
          {title}
        </ModalHeader>
        <ModalBody>
          <FormGroup>
            <FormItem>
              <Field
                name='value'
                validate={[required]}
                component={secret ? PasswordBox : TextBox}
              />
            </FormItem>
          </FormGroup>
        </ModalBody>
        <ModalFooter align='right'>
          <Button
            type='submit'
            nature='primary'
            capitalize
            disabled={submitting || invalid}
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

export default reduxForm({ form: 'promptInputModal' })(PromptTemplate)
