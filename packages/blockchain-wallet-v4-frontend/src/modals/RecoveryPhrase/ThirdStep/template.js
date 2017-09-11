import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import { Button, ButtonGroup, Icon, Modal, ModalHeader, ModalBody, ModalFooter, Separator, Text, TextGroup } from 'blockchain-info-components'

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 10px 0;
`

const FirstStep = (props) => {
  const { next, close } = props

  return (
    <Modal size='large'>
      <ModalHeader icon='bell' onClose={close}>
        <FormattedMessage id='modals.recoveryphrase.title' defaultMessage='Backup recovery phrase' />
      </ModalHeader>
      <ModalBody>
        <TextGroup inline>
          <Icon name='safe' size='18px' weight={300} color='error' />
          <Text size='18px' weight={400} color='error'>
            <FormattedMessage id='modals.recoveryphrase.tip' defaultMessage='Security tip' />
          </Text>
        </TextGroup>
        <TextGroup inline>
          <Text size='14px' weight={300} color='error'>
            <FormattedMessage id='modals.recoveryphrase.explain' defaultMessage='Do not store your Recovery Phrase on your computer or online.' />
          </Text>
          <Text size='14px' weight={300} color='error'>
            <FormattedMessage id='modals.recoveryphrase.explain2' defaultMessage='It is very important to keep your Recovery Phrase offline in a safe and private place.' />
          </Text>
          <Text size='14px' weight={500} color='error'>
            <FormattedMessage id='modals.recoveryphrase.explain3' defaultMessage='Anyone with access to your Recovery Phrase has access to your funds.' />
          </Text>
        </TextGroup>
        <Separator />
        <TextGroup inline>
          <Text size='14px' weight={300}>
            <FormattedMessage id='modals.recoveryphrase.explain4' defaultMessage='We have created a printable Recovery Sheet to help you conveniently keep your Recovery Phrase safe.' />
          </Text>
          <Text size='14px' weight={300}>
            <FormattedMessage id='modals.recoveryphrase.explain5' defaultMessage='Print the blank Recovery Sheet and then move onto the next step to fill it in.' />
          </Text>
        </TextGroup>
        <ButtonContainer>
          <Button nature='primary'>
            <FormattedMessage id='modals.recoveryphrase.print' defaultMessage='Print recovery sheet' />
          </Button>
        </ButtonContainer>
      </ModalBody>
      <ModalFooter>
        <ButtonGroup>
          <Button>
            <FormattedMessage id='modals.recoveryphrase.cancel' defaultMessage='Cancel' />
          </Button>
          <Button nature='secondary' onClick={next}>
            <FormattedMessage id='modals.recoveryphrase.logout' defaultMessage='Next step' />
          </Button>
        </ButtonGroup>
      </ModalFooter>
    </Modal>
  )
}

FirstStep.propTypes = {
  handleClose: PropTypes.func.isRequired,
  next: PropTypes.func.isRequired
}

export default FirstStep
