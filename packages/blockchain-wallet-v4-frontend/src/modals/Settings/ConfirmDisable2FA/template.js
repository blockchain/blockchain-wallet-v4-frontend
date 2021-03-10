import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import {
  Button,
  ButtonGroup,
  Icon,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Text
} from 'blockchain-info-components'
import { flex, spacing } from 'services/styles'

const Wrapper = styled.div`
  display: flex;
  justify-content: ${props => (props.extraCopy ? null : 'center')};
`
const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: ${props => (props.extraCopy ? null : 'center')};
  align-items: ${props => (props.extraCopy ? null : 'center')};
  height: 100%;
  padding: 0;
  box-sizing: border-box;
  span {
    margin-top: 30px;
  }
`

const Buttons = styled(ButtonGroup)`
  button {
    margin-left: 25px;
  }
`

const ConfirmDisable2FA = props => {
  const {
    authName,
    extraCopy,
    handleContinue,
    position,
    total,
    ...rest
  } = props
  const { closeAll } = rest

  return (
    <Modal size='large' position={position} total={total}>
      <ModalHeader onClose={closeAll}>
        <div style={flex('row align/center')}>
          <Icon name='lock' size='20px' style={spacing('pr-5')} />
          <FormattedMessage
            id='modals.disable2fa.title'
            defaultMessage='Disable Two-Step'
          />
        </div>
      </ModalHeader>
      <ModalBody>
        <Wrapper extraCopy={extraCopy}>
          <Container extraCopy={extraCopy}>
            <Text size='14px' weight={400}>
              <FormattedMessage
                id='modals.disable2fa.sure'
                defaultMessage='Are you sure you wish to disable the'
              />
              {` ${authName}?`}
            </Text>
            {extraCopy ? (
              <Text style={spacing('mt-10')} size='14px' weight={400}>
                {extraCopy}
              </Text>
            ) : (
              <Icon name='alert-filled' size='40px' color='error' />
            )}
          </Container>
        </Wrapper>
      </ModalBody>
      <ModalFooter align='right'>
        <Buttons>
          <Text size='12px' weight={400} cursor='pointer' onClick={closeAll}>
            Close
          </Text>
          <Button nature='warning' onClick={handleContinue}>
            <FormattedMessage
              id='modals.disable2fa.disable'
              defaultMessage='Disable'
            />
          </Button>
        </Buttons>
      </ModalFooter>
    </Modal>
  )
}

export default ConfirmDisable2FA
