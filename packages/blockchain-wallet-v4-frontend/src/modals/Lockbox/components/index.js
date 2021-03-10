import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { Icon, Text } from 'blockchain-info-components'

const StepHeader = styled.div`
  background-color: ${props => props.theme.white};
  justify-content: space-evenly;
  padding: 30px 30px 0px 30px;
  border-radius: 4px 4px 0 0;
  flex-direction: row;
  align-items: center;
  display: flex;
`
const Step = styled.div`
  flex-direction: column;
  align-items: center;
  text-align: center;
  display: flex;
`
const Line = styled.div`
  width: 100%;
  position: relative;
  border-top: 4px solid ${props => props.theme.grey000};
  &:before {
    content: '';
    left: 0;
    width: 0%;
    height: 4px;
    bottom: 0px;
    position: absolute;
    background: ${props => props.theme.blue600};
    transition: width 0.5s 0.3s;
  }
  &.complete {
    &:before {
      width: 100%;
    }
  }
`
const Circle = styled.div`
  width: 22px;
  height: 22px;
  z-index: 10;
  display: flex;
  border-radius: 15px;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  overflow: hidden;
  border: 2px solid ${props => props.theme.grey000};
  transition: border 0.3s, background-color 0.2s;
  &.active,
  &.complete {
    border: 2px solid ${props => props.theme.blue600};
  }
  &.complete {
    background-color: ${props => props.theme.blue600};
  }
`
const CircleContent = styled.div`
  top: 10px;
  position: relative;
  transition: top 0.5s;
  &.complete {
    top: -12px;
  }
`
const CheckIcon = styled(Icon)`
  margin-top: 10px;
`

class ModalStepper extends React.PureComponent {
  render() {
    // currentStep & totalSteps do not follow zero-based numbering
    const { currentStep, totalSteps } = this.props

    return (
      <StepHeader>
        {[...Array(totalSteps)].map((r, i) => {
          i += 1
          const active = currentStep === i ? 'active' : null
          const complete = currentStep > i ? 'complete' : null
          return (
            <React.Fragment key={i}>
              <Step>
                <Circle className={active + ' ' + complete}>
                  <CircleContent className={active + ' ' + complete}>
                    <Text
                      size='13px'
                      color={
                        active ? 'blue600' : complete ? 'white' : 'grey000'
                      }
                    >
                      {i}
                    </Text>
                    <CheckIcon
                      name='checkmark'
                      size='10px'
                      weight='600'
                      color='white'
                    />
                  </CircleContent>
                </Circle>
              </Step>
              {i !== totalSteps && <Line className={complete} />}
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
