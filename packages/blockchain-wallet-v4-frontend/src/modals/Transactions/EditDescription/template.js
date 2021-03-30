import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Field, reduxForm } from 'redux-form'
import styled from 'styled-components'

import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader
} from 'blockchain-info-components'
import { Form, FormGroup, FormItem, TextBox } from 'components/Form'

const Wrapper = styled.div`
  font-weight: 400;
  color: ${props => props.theme.grey700};
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
    Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
`
const Label = styled.label`
  display: block;
  font-size: 12px;
  margin-bottom: 5px;
`

const EditTxDescription = props => {
  const { closeAll, handleSubmit, invalid, position, submitting } = props

  return (
    <Modal size='large' position={position}>
      <Form onSubmit={handleSubmit}>
        <Wrapper>
          <ModalHeader icon='pencil' onClose={closeAll}>
            <FormattedMessage
              id='modals.edittransactiondesc.title'
              defaultMessage='Edit Transaction Description'
            />
          </ModalHeader>
          <ModalBody>
            <FormGroup>
              <FormItem data-e2e='editTransactionDescriptionInput'>
                <Label htmlFor='description'>
                  <FormattedMessage
                    id='modals.edittransactiondesc.description'
                    defaultMessage='Description'
                  />
                </Label>
                <Field name='description' component={TextBox} maxLength={100} />
              </FormItem>
            </FormGroup>
          </ModalBody>
          <ModalFooter align='right'>
            <Button
              type='submit'
              nature='primary'
              capitalize
              disabled={submitting || invalid}
              data-e2e='saveTransactionDescriptionButton'
            >
              <FormattedMessage
                id='modals.edittransactiondesc.button'
                defaultMessage='Change Description'
              />
            </Button>
          </ModalFooter>
        </Wrapper>
      </Form>
    </Modal>
  )
}

export default reduxForm({ form: 'editTransactionDescription' })(
  EditTxDescription
)
