import React from 'react'
import { reduxForm } from 'redux-form'
import styled from 'styled-components'

import {
  Button,
  Image,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Text
} from 'blockchain-info-components'
import { Form } from 'components/Form'

import {
  selectCancel,
  selectConfirm,
  selectMessage,
  selectTitle
} from './helpers'

const Wrapper = styled.div`
  font-weight: 400;
  color: ${props => props.theme.grey700};
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
    Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
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
  cancel,
  close,
  confirm,
  handleSubmit,
  hideCancel,
  image,
  message,
  messageValues,
  nature,
  position,
  title,
  total
}) => (
  <Modal size='medium' position={position} total={total}>
    <Form onSubmit={handleSubmit}>
      <Wrapper>
        <ModalHeader onClose={close}>{selectTitle(title)}</ModalHeader>
        <ModalBody>
          {image && <ModalImage name={image} />}
          <Text size={'16px'} weight={400}>
            {selectMessage(message, messageValues)}
          </Text>
        </ModalBody>
        <ModalFooter align='right'>
          {!hideCancel && (
            <Cancel data-e2e='cancelConfirmModalLink' onClick={close}>
              {selectCancel(cancel)}
            </Cancel>
          )}
          <Button
            type='submit'
            nature={nature || 'primary'}
            capitalize
            data-e2e='confirmModalSubmitButton'
          >
            {selectConfirm(confirm)}
          </Button>
        </ModalFooter>
      </Wrapper>
    </Form>
  </Modal>
)

export default reduxForm({ form: 'confirmModal' })(ConfirmTemplate)
