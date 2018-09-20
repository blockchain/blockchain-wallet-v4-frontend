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
  width: 117px;
  border-top: 2px solid
    ${props =>
      props.step > props.i
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
    props.step >= props.i
      ? 'rgba(255, 255, 255, 1)'
      : 'rgba(255, 255, 255, 0.3)'};
  margin-top: 15px;
  z-index: 10;

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
          return (
            <React.Fragment key={i}>
              <Step>
                <Text size='12px' weight={400} color='white'>
                  <FormattedMessage
                    id='modals.lockboxfirmware.header.step'
                    defaultMessage='Step {number}'
                    values={{ number: i + 1 }}
                  />
                </Text>
                <Circle step={step} i={i} />
              </Step>
              {i !== totalSteps - 1 && (
                <LineWrapper>
                  <Line step={step} i={i} />
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
