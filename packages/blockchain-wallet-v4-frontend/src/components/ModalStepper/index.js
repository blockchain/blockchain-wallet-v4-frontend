import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import { Text } from 'blockchain-info-components'

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

// TODO: this only supports totalSteps of 4 or 5
const Line = styled.div`
  &.animate {
    width: 1px;
    border-top: 2px solid rgba(255, 255, 255, 1);
    @keyframes increase {
      100% {
        width: ${props => (props.totalSteps === 5 ? '117px' : '155px')};
      }
    }
    -webkit-animation: increase 1s;
    -moz-animation: increase 1s;
    -o-animation: increase 1s;
    animation: increase 1s;
    animation-fill-mode: forwards;
  }

  width: ${props => (props.totalSteps === 5 ? '117px' : '155px')};
  z-index: 0;
  border-top: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid
    ${props =>
      props.currentStep > props.i && props.i !== props.currentStep
        ? 'rgba(255, 255, 255, 1)'
        : 'rgba(255, 255, 255, 0.3)'};
  position: absolute;
  top: 6px;
  left: ${props => (props.totalSteps === 5 ? '-26px' : '-35px')};
`
const Circle = styled.div`
  width: 14px;
  height: 14px;
  line-height: 14px;
  border-radius: 15px;
  background-color: ${props =>
    props.currentStep > props.i || props.i === 1
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

class ModalStepper extends React.PureComponent {
  render () {
    const { currentStep, totalSteps } = this.props

    return (
      <StepHeader>
        {[...Array(totalSteps)].map((r, i) => {
          i += 1
          return (
            <React.Fragment key={i}>
              <Step>
                <Text size='12px' weight={400} color='white'>
                  <FormattedMessage
                    id='components.modalstepper.step'
                    defaultMessage='Step {number}'
                    values={{ number: i }}
                  />
                </Text>
                <Circle
                  currentStep={currentStep}
                  i={i}
                  className={currentStep === i ? 'animate' : ''}
                />
              </Step>
              {i !== totalSteps && (
                <LineWrapper>
                  <Line
                    currentStep={currentStep}
                    i={i}
                    totalSteps={totalSteps}
                    className={
                      currentStep !== 1 && i === currentStep - 1
                        ? 'animate'
                        : ''
                    }
                  />
                </LineWrapper>
              )}
            </React.Fragment>
          )
        })}
      </StepHeader>
    )
  }
}

ModalStepper.propTypes = {
  totalSteps: PropTypes.number.isRequired,
  currentStep: PropTypes.number.isRequired
}

export default ModalStepper
