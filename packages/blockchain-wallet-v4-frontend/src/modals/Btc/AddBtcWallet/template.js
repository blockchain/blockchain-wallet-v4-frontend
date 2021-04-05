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
import { required } from 'services/forms'

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

const AddBtcWallet = ({
  close,
  handleSubmit,
  invalid,
  position,
  submitting,
  total,
  uniqueWalletName
}) => {
  return (
    <Modal size='large' position={position} total={total}>
      <Form onSubmit={handleSubmit}>
        <Wrapper>
          <ModalHeader icon='arrow-up-circle' onClose={() => close()}>
            <FormattedMessage
              id='modals.addbitcoinwallet.title'
              defaultMessage='Add New Bitcoin Wallet'
            />
          </ModalHeader>
          <ModalBody>
            <FormGroup>
              <FormItem>
                <Label htmlFor='wallet'>
                  <FormattedMessage
                    id='modals.addbitcoinwallet.wallet'
                    defaultMessage='Wallet Name'
                  />
                </Label>
                <Field
                  name='wallet'
                  autoFocus
                  validate={[required, uniqueWalletName]}
                  component={TextBox}
                  maxLength={30}
                  data-e2e='newWalletNameInput'
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
              data-e2e='createNewBitcoinWalletButton'
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
