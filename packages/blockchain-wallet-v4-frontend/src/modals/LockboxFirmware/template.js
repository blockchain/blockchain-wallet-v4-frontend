import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import { Modal, ModalBody, Text } from 'blockchain-info-components'

const StepHeader = styled.div`
  background-color: ${props => props.theme['brand-secondary']};
  border-radius: 4px 4px 0 0;
  height: 70px;
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
  padding: 0 5px 10px 5px;
`
const ContentWrapper = styled(ModalBody)`
  padding: 20px;
  height: 300px;
`
const Step = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`
const LineWrapper = styled.div`
  position: relative;
  width: 100%;
  margin-top: 16px;
`

const Line = styled.div`
  &.animate {
    width: 1px;
    border-top: 2px solid rgba(255, 255, 255, 1);
    @keyframes increase {
      100% {
        width: 117px;
      }
    }
    -webkit-animation: increase 1s;
    -moz-animation: increase 1s;
    -o-animation: increase 1s;
    animation: increase 1s;
    animation-fill-mode: forwards;
  }

  width: 117px;
  border-top: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid
    ${props =>
      props.step > props.i && props.i !== props.step
        ? 'rgba(255, 255, 255, 1)'
        : 'rgba(255, 255, 255, 0.3)'};
  position: absolute;
  top: 6px;
  left: -26px;
`
const Circle = styled.div`
  width: 14px;
  height: 14px;
  line-height: 14px;
  border-radius: 15px;
  background-color: ${props =>
    props.step > props.i || props.i === 1
      ? 'rgba(255, 255, 255, 1)'
      : 'rgba(255, 255, 255, 0.3)'};
  margin-top: 15px;
  z-index: 10;

  &.animate {
    transition-property: background-color;
    background-color: rgba(255, 255, 255, 1);
    transition-delay: 1.1s;
  }

  & > span:first-child {
    padding-left: 8px;
  }
`

const LockboxFirmware = props => {
  const { children, position, total, step, totalSteps } = props
  return (
    <Modal size='large' position={position} total={total}>
      <StepHeader>
        {[...Array(totalSteps)].map((r, i) => {
          i += 1
          return (
            <React.Fragment key={i}>
              <Step>
                <Text size='12px' weight={400} color='white'>
                  <FormattedMessage
                    id='modals.lockboxfirmware.header.step'
                    defaultMessage='Step {number}'
                    values={{ number: i }}
                  />
                </Text>
                <Circle
                  step={step}
                  i={i}
                  className={step === i ? 'animate' : ''}
                />
              </Step>
              {i !== totalSteps && (
                <LineWrapper>
                  <Line
                    step={step}
                    i={i}
                    className={step !== 1 && i === step - 1 ? 'animate' : ''}
                  />
                </LineWrapper>
              )}
            </React.Fragment>
          )
        })}
      </StepHeader>
      <ContentWrapper>{children}</ContentWrapper>
    </Modal>
  )
}

LockboxFirmware.propTypes = {
  position: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  closeAll: PropTypes.func.isRequired
}

export default LockboxFirmware
