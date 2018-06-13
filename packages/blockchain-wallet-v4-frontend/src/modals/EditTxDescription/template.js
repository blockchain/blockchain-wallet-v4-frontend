import React from 'react'
import styled from 'styled-components'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'blockchain-info-components'
import { FormattedMessage } from 'react-intl'
import { Field, reduxForm } from 'redux-form'
import { Form, FormGroup, FormItem, TextBox } from 'components/Form'

const Wrapper = styled.div`
  font-weight: 300;
  color: ${props => props.theme['gray-5']};
  font-family: 'Montserrat', Helvetica, sans-serif;
`
const Label = styled.label`
  display: block;
  font-size: 12px;
  margin-bottom: 5px;
`

const EditTxDescription = (props) => {
  const { position, close, submitting, handleSubmit, invalid } = props

  return (
    <Modal size='large' position={position}>
      <Form onSubmit={handleSubmit}>
        <Wrapper>
          <ModalHeader icon='pencil' onClose={close}>
            <FormattedMessage id='modals.edittransactiondesc.title' defaultMessage='Edit Transaction Description' />
          </ModalHeader>
          <ModalBody>
            <FormGroup>
              <FormItem>
                <Label for='description'>
                  <FormattedMessage id='modals.edittransactiondesc.description' defaultMessage='Description' />
                </Label>
                <Field name='description' component={TextBox} />
              </FormItem>
            </FormGroup>
          </ModalBody>
          <ModalFooter align='right'>
            <Button type='submit' nature='primary' capitalize disabled={submitting || invalid}>
              <FormattedMessage id='modals.edittransactiondesc.button' defaultMessage='Change Description' />
            </Button>
          </ModalFooter>
        </Wrapper>
      </Form>
    </Modal>
  )
}

export default reduxForm({ form: 'editTransactionDescription' })(EditTxDescription)
