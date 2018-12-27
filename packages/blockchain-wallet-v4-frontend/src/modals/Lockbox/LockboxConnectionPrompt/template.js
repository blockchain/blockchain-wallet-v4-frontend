import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import ModalStepper from 'components/ModalStepper'
import { CONFIRM_STEPS } from './model'
import { prop } from 'ramda'

import {
  Image,
  Modal,
  ModalBody,
  ModalHeader,
  Text
} from 'blockchain-info-components'

const Title = styled.div`
  text-align: center;
  margin-bottom: 20px;
`

const Content = styled.div`
  text-align: center;
  margin-bottom: 20px;
`

const ImageContainer = styled.div`
  position: relative;
`
const MarqueeContainer = styled.marquee.attrs({
  scrollamount: 3,
  behavior: 'alternate'
})`
  position: absolute;
  padding: 4px;
  width: 32%;
  left: 43%;
  top: 50%;
`

const LockboxConnectionPrompt = props => {
  const { position, total, onClose, ...rest } = props
  const { coin, currentConnection, marquees, isTx } = rest
  const { error, ready, success } = currentConnection

  let step
  if (error) {
    step = prop('name', CONFIRM_STEPS.error)
  } else if (success) {
    step = prop('name', CONFIRM_STEPS.success)
  } else if (ready) {
    step = prop('name', CONFIRM_STEPS.ready)
  } else {
    step = prop('name', CONFIRM_STEPS.connect)
  }

  let currentStep = prop('index', CONFIRM_STEPS[step])

  return (
    <Modal size='small' position={position} total={total}>
      <ModalHeader onClose={onClose}>
        <FormattedMessage
          id='modals.promptforlockbox.title'
          defaultMessage='Lockbox Connection'
        />
      </ModalHeader>
      <ModalStepper currentStep={currentStep} totalSteps={isTx ? 3 : 2} />
      <ModalBody>
        <Title>
          <Text>{CONFIRM_STEPS[step].title(coin, isTx)}</Text>
        </Title>
        <Content>
          <Text color='gray-4'>{CONFIRM_STEPS[step].content(coin, isTx)}</Text>
        </Content>
        <ImageContainer>
          <Image
            width='100%'
            name={CONFIRM_STEPS[step].image()}
            srcset={CONFIRM_STEPS[step].srcset()}
          />
          <MarqueeContainer>
            {step === 'ready' &&
              marquees.map((marquee, i) => (
                <Text size='12px' weight={300}>
                  {i + 1 + '. ' + marquee}
                </Text>
              ))}
          </MarqueeContainer>
        </ImageContainer>
      </ModalBody>
    </Modal>
  )
}

LockboxConnectionPrompt.propTypes = {
  coin: PropTypes.string
}

export default LockboxConnectionPrompt
