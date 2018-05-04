import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import { Button, Icon, Image, Link, Modal, ModalHeader, ModalBody, ModalFooter, Separator, Text, TextGroup } from 'blockchain-info-components'
import { spacing } from 'services/StyleService'
import recoveryPdf from './recovery.pdf'

const PrintContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 20px 0;
`

const FirstStep = (props) => {
  const { nextStep, position, total, close } = props

  return (
    <Modal size='large' position={position} total={total}>
      <ModalHeader icon='bell' onClose={close} >
        <FormattedMessage id='modals.recoveryphrase.firststep.title' defaultMessage='Backup recovery phrase' />
      </ModalHeader>
      <ModalBody>
        <TextGroup inline>
          <Icon name='safe' size='18px' weight={300} />
          <Text size='18px' weight={300}>
            <FormattedMessage id='modals.recoveryphrase.firststep.tip' defaultMessage='Security tip' />
          </Text>
        </TextGroup>
        <TextGroup inline>
          <Text size='13px' weight={300}>
            <FormattedMessage id='modals.recoveryphrase.firststep.explain' defaultMessage='Do not store your Recovery Phrase on your computer or online.' />
          </Text>
          <Text size='13px' weight={300}>
            <FormattedMessage id='modals.recoveryphrase.firststep.explain2' defaultMessage='It is very important to keep your Recovery Phrase offline in a safe and private place.' />
          </Text>
          <Text size='13px' weight={500}>
            <FormattedMessage id='modals.recoveryphrase.firststep.explain3' defaultMessage='Anyone with access to your Recovery Phrase has access to your funds.' />
          </Text>
        </TextGroup>
        <Separator />
        <TextGroup inline>
          <Text size='14px' weight={300}>
            <FormattedMessage id='modals.recoveryphrase.firststep.explain4' defaultMessage='We have created a printable Recovery Sheet to help you conveniently keep your Recovery Phrase safe.' />
          </Text>
          <Text size='14px' weight={300}>
            <FormattedMessage id='modals.recoveryphrase.firststep.explain5' defaultMessage='Print the blank Recovery Sheet and then move onto the next step to fill it in.' />
          </Text>
        </TextGroup>
        <PrintContainer>
          <Link href={recoveryPdf} download='recovery.pdf'>
            <Button nature='empty'>
              <Image name='printer' height='20px' width='20px' style={spacing('mr-5')} />
              <FormattedMessage id='modals.recoveryphrase.firststep.print' defaultMessage='Print Recovery Sheet' />
            </Button>
          </Link>
        </PrintContainer>
      </ModalBody>
      <ModalFooter align='spaced'>
        <Link size='13px' weight={300} onClick={close}>
          <FormattedMessage id='modals.recoveryphrase.firststep.cancel' defaultMessage='Cancel' />
        </Link>
        <Button nature='primary' onClick={nextStep}>
          <FormattedMessage id='modals.recoveryphrase.firststep.logout' defaultMessage='Next step' />
        </Button>
      </ModalFooter>
    </Modal>
  )
}

export default FirstStep
