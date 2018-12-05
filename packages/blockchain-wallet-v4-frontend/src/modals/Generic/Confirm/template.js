import React from 'react'
import styled from 'styled-components'
import {
  Button,
  Image,
  Modal,
  Text,
  ModalBody,
  ModalHeader,
  ModalFooter
} from 'blockchain-info-components'
import { reduxForm } from 'redux-form'
import { Form } from 'components/Form'
import {
  selectTitle,
  selectMessage,
  selectCancel,
  selectConfirm
} from './helpers'

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
const ModalImage = styled(Image)`
  display: block;
  margin: 0px auto 20px auto;
`

const ConfirmTemplate = ({
  position,
  total,
  close,
  submitting,
  invalid,
  confirm,
  cancel,
  title,
  image,
  nature,
  message,
  messageValues,
  handleCancel,
  handleSubmit
}) => (
  <Modal size='large' position={position} total={total}>
    <Form onSubmit={handleSubmit}>
      <Wrapper>
        <ModalHeader onClose={close}>{selectTitle(title)}</ModalHeader>
        <ModalBody>
          {image && <ModalImage name={image} />}
          <Text size={'16px'} weight={300}>
            {selectMessage(message, messageValues)}
          </Text>
        </ModalBody>
        <ModalFooter align='right'>
          <Cancel onClick={close}>{selectCancel(cancel)}</Cancel>
          <Button type='submit' nature={nature || 'primary'} capitalize>
            {selectConfirm(confirm)}
          </Button>
        </ModalFooter>
      </Wrapper>
    </Form>
  </Modal>
)

export default reduxForm({ form: 'confirmModal' })(ConfirmTemplate)
