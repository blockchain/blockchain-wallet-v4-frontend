import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import { Button, ButtonGroup, Icon, Modal, Separator, Text, TextGroup } from 'blockchain-info-components'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-content: flex-start;
  border-bottom: 1px solid ${props => props.theme['gray-2']};
`
const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 10px 0;
`
const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
`

const FirstStep = (props) => {
  const { handleClose, next, ...rest } = props

  return (
    <Modal {...rest} icon='bell' title='Backup recovery phrase' closeButton={handleClose}>
      <Container>
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
      </Container>
      <Footer>
        <ButtonGroup>
          <Button onClick={handleClose}>
            <FormattedMessage id='modals.recoveryphrase.cancel' defaultMessage='Cancel' />
          </Button>
          <Button nature='secondary' onClick={next}>
            <FormattedMessage id='modals.recoveryphrase.logout' defaultMessage='Next step' />
          </Button>
        </ButtonGroup>
      </Footer>
    </Modal>
  )
}

export default FirstStep
