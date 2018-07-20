import React from 'react'
import styled from 'styled-components'
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter
} from 'blockchain-info-components'
import { FormattedMessage } from 'react-intl'
import { reduxForm } from 'redux-form'
import { Form } from 'components/Form'

const Wrapper = styled.div`
  font-weight: 300;
  color: ${props => props.theme['gray-5']};
  font-family: 'Montserrat', Helvetica, sans-serif;
`
const Cancel = styled.span`
  margin-right: 20px;
  font-size: 14px;
  cursor: pointer;
`

const ConfirmTemplate = ({
  position,
  total,
  close,
  submitting,
  invalid,
  message,
  handleCancel,
  handleSubmit
}) => (
  <Modal size='large' position={position} total={total}>
    <Form onSubmit={handleSubmit}>
      <Wrapper>
        <ModalBody>{message}</ModalBody>
        <ModalFooter align='right'>
          <Cancel onClick={handleCancel}>
            <FormattedMessage
              id='modals.confirm.button.cancel'
              defaultMessage='Cancel'
            />
          </Cancel>
          <Button type='submit' nature='primary' capitalize>
            <FormattedMessage id='modals.confirm.button' defaultMessage='OK' />
          </Button>
        </ModalFooter>
      </Wrapper>
    </Form>
  </Modal>
)

export default reduxForm({ form: 'confirmModal' })(ConfirmTemplate)
