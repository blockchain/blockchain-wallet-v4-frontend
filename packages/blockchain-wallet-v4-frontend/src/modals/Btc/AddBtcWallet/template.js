import React from 'react'
import { prop, map } from 'ramda'
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

const unique = (value, allValues, { wallets }) => {
  return map(prop('label'), wallets).indexOf(value) > -1
    ? 'Wallet name is already taken.'
    : undefined
}

const AddBtcWallet = props => {
  const { close, handleSubmit, invalid, position, submitting, total } = props

  return (
    <Modal size='large' position={position} total={total}>
      <Form onSubmit={handleSubmit}>
        <Wrapper>
          <ModalHeader icon='up-arrow-in-circle' onClose={close}>
            <FormattedMessage
              id='modals.addbitcoinwallet.title'
              defaultMessage='Add New Bitcoin Wallet'
            />
          </ModalHeader>
          <ModalBody>
            <FormGroup>
              <FormItem>
                <Label for='wallet'>
                  <FormattedMessage
                    id='modals.addbitcoinwallet.wallet'
                    defaultMessage='Wallet Name'
                  />
                </Label>
                <Field
                  name='wallet'
                  autoFocus
                  validate={[required, unique]}
                  component={TextBox}
                  maxLength={30}
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
                id='modals.addbitcoinwallet.button'
                defaultMessage='Create New Bitcoin Wallet'
              />
            </Button>
          </ModalFooter>
        </Wrapper>
      </Form>
    </Modal>
  )
}

export default reduxForm({ form: 'addBtcWallet' })(AddBtcWallet)
