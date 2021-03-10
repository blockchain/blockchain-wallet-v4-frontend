import React from 'react'
import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'
import { prop } from 'ramda'
import styled from 'styled-components'

import {
  Image,
  Modal,
  ModalBody,
  ModalHeader,
  Text
} from 'blockchain-info-components'

import ModalStepper from '../components'
import { CONFIRM_STEPS } from './model'

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
  const { onClose, position, total, ...rest } = props
  const { appName, currentConnection, isTx, marquees } = rest
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
          id='modals.lockbox.connectionprompt.title'
          defaultMessage='Lockbox Connection'
        />
      </ModalHeader>
      <ModalStepper currentStep={currentStep} totalSteps={isTx ? 3 : 2} />
      <ModalBody>
        <Title>
          <Text>{CONFIRM_STEPS[step].title(appName, isTx)}</Text>
        </Title>
        <Content>
          <Text color='grey500'>
            {CONFIRM_STEPS[step].content(appName, isTx)}
          </Text>
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
                <Text size='12px' weight={400}>
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
