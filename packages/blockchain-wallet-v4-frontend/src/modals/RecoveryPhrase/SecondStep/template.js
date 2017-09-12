import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import { Button, Icon, Link, Modal, ModalHeader, ModalBody, ModalFooter, Text, TextGroup } from 'blockchain-info-components'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 200px;
  width: 100%;
`
const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  padding: 25px 0;
`
const Arrow = styled(Icon)`
  cursor: pointer;
  visibility: ${props => props.visible ? 'visible' : 'hidden'};
`
const Display = styled(Text)`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 300px;
`

const SecondStep = (props) => {
  const { previous, next, position, total, close, currentIndex, currentWord, nextWord, previousWord } = props
  console.log(currentWord)

  return (
    <Modal size='large' position={position} total={total}>
      <ModalHeader icon='bell' onClose={close}>
        <FormattedMessage id='modals.recoveryphrase.secondstep.title' defaultMessage='Backup recovery phrase' />
      </ModalHeader>
      <ModalBody>
        <TextGroup inline>
          <Icon name='pencil' size='18px' weight={300} />
          <Text size='18px' weight={300}>
            <FormattedMessage id='modals.recoveryphrase.secondstep.tip' defaultMessage='Write it down' />
          </Text>
        </TextGroup>
        <TextGroup inline>
          <Text size='13px' weight={300}>
            <FormattedMessage id='modals.recoveryphrase.secondstep.explain' defaultMessage='Use a pen to legibly write down the following 12 words onto your printed Recovery Sheet.' />
          </Text>
          <Text size='13px' weight={300}>
            <FormattedMessage id='modals.recoveryphrase.secondstep.explain2' defaultMessage='It is important that you write down the words exactly as they appear here and in this order.' />
          </Text>
        </TextGroup>
        <Wrapper>
          <Text size='20px' weight={300}>
            <FormattedMessage id='modals.recoveryphrase.secondstep.number' defaultMessage='Word {number}' values={{ number: currentIndex + 1 }} />
          </Text>
          <Container>
            <Arrow name='left-arrow' size='40px' onClick={previousWord} visible={currentIndex !== 0} />
            <Display size='40px'>{currentWord}</Display>
            <Arrow name='right-arrow' size='40px' onClick={nextWord} visible={currentIndex !== 11} />
          </Container>
        </Wrapper>
      </ModalBody>
      <ModalFooter align='spaced'>
        <Link size='13px' weight={300} onClick={previous}>
          <FormattedMessage id='modals.recoveryphrase.secondstep.back' defaultMessage='Back' />
        </Link>
        <Button nature='primary' onClick={next}>
          <FormattedMessage id='modals.recoveryphrase.secondstep.next' defaultMessage='Final step' />
        </Button>
      </ModalFooter>
    </Modal>
  )
}

export default SecondStep
