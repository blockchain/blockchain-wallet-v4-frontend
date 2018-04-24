import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { spacing } from 'services/StyleService'

import { Button, Icon, Modal, ModalHeader, ModalBody, ModalFooter, Text, ButtonGroup } from 'blockchain-info-components'

const Wrapper = styled.div`
  display: flex;
  justify-content: ${props => props.extraCopy ? null : 'center'};
`
const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: ${props => props.extraCopy ? null : 'center'};
  align-items: ${props => props.extraCopy ? null : 'center'};
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

const ConfirmDisable2FA = (props) => {
  const { position, total, close, handleContinue, extraCopy, authName, ...rest } = props
  const { closeAll } = rest

  return (
    <Modal size='large' position={position} total={total}>
      <ModalHeader onClose={close}>
        <FormattedMessage id='modals.disable2fa.title' defaultMessage='Disable Two Factor' />
      </ModalHeader>
      <ModalBody>
        <Wrapper extraCopy={extraCopy}>
          <Container extraCopy={extraCopy}>
            <Text size='14px' weight={300}>
              <FormattedMessage id='modals.disable2fa.sure' defaultMessage='Are you sure you wish to disable the' />
              {` ${authName}?`}
            </Text>
            {
              extraCopy
                ? <Text style={spacing('mt-10')} size='14px' weight={300}>{extraCopy}</Text>
                : <Icon name='alert' size='40px' color='error' />
            }
          </Container>
        </Wrapper>
      </ModalBody>
      <ModalFooter align='right'>
        <Buttons>
          <Text size='12px' weight={200} cursor='pointer' onClick={closeAll}>
            Close
          </Text>
          <Button nature='logout' onClick={handleContinue}>
            <FormattedMessage id='modals.disable2fa.disable' defaultMessage='Disable' />
          </Button>
        </Buttons>
      </ModalFooter>
    </Modal>
  )
}

export default ConfirmDisable2FA
