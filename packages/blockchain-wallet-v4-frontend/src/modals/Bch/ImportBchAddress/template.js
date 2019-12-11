import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader
} from 'blockchain-info-components'
import { Form } from 'components/Form'
import { FormattedMessage } from 'react-intl'
import { reduxForm } from 'redux-form'

import ImportBchAddressForm from './form.js'
import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  font-weight: 400;
  color: ${props => props.theme['gray-5']};
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
    Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
`

const ImportBchAddress = props => {
  const { close, submitting, invalid, handleSubmit, position } = props

  return (
    <Modal size='large' position={position}>
      <Form onSubmit={handleSubmit}>
        <Wrapper>
          <ModalHeader icon='up-arrow-in-circle' onClose={close}>
            <FormattedMessage
              id='modals.bch.importbchaddress.title'
              defaultMessage='Import Existing Bitcoin Cash Address'
            />
          </ModalHeader>
          <ModalBody>
            <ImportBchAddressForm />
          </ModalBody>
          <ModalFooter align='right'>
            <Button
              type='submit'
              nature='primary'
              capitalize
              disabled={submitting || invalid}
              data-e2e='importButton'
            >
              <FormattedMessage
                id='modals.bch.importbchaddress.button'
                defaultMessage='Import'
              />
            </Button>
          </ModalFooter>
        </Wrapper>
      </Form>
    </Modal>
  )
}

export default reduxForm({
  form: 'importBchAddress'
})(ImportBchAddress)
