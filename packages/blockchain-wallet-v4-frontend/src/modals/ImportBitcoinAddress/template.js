import React from 'react'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'blockchain-info-components'
import { FormattedMessage } from 'react-intl'
import { Field, reduxForm } from 'redux-form'
import { validBitcoinAddress } from 'services/FormHelper'
import { Form, TextBox } from 'components/Form'

const ImportBitcoinAddress = (props) => {
  const { position, close, submitting, invalid, ...rest } = props
  const { onSubmit } = rest

  return (
    <Modal size='large' position={position}>
      <Form onSubmit={onSubmit}>
        <ModalHeader icon='up-arrow-in-circle' onClose={close}>
          <FormattedMessage id='modals.importbitcoinaddress.title' defaultMessage='Import Existing Bitcoin Address' />
        </ModalHeader>
        <ModalBody>
          <Field name='address' validate={[validBitcoinAddress]} component={TextBox} />
        </ModalBody>
        <ModalFooter align='right'>
          <Button type='submit' nature='primary' capitalize disabled={submitting || invalid}>
            <FormattedMessage id='modals.importbitcoinaddress.button' defaultMessage='Import' />
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  )
}

export default reduxForm({ form: 'importBitcoinAddress' })(ImportBitcoinAddress)
