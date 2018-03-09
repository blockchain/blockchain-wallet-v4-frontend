import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;

  @media(max-width: 991px) {
    flex-direction: column;
  }
`

const Steps = styled.div`
  position: relative;
  padding-bottom: 15px;
  display: inline-flex;
  flex-direction: row;
  justify-content: center;
  border-bottom: 8px solid ${props => props.theme['gray-2']};
  &:after {
    left: 0;
    content: '';
    height: 8px;
    bottom: -8px;
    position: absolute;
    transition: width 0.3s;
    width: ${props => props.width * 100}%;
    background: ${props => props.theme['brand-primary']};
  }
`

const Step = styled.span`
  font-size: 14px;
  min-width: 60px;
  margin-left: 50px;
  margin-right: 50px;
  text-align: center;
  color: ${props => props.theme['brand-primary']};
`

const StepIndicator = (props) => {
  const { step, stepMap } = props
  const steps = Object.keys(stepMap)
  const index = steps.indexOf(step) + 1
  const width = index / steps.length

  return (
    <Wrapper>
      <Steps width={width - 0.1}>
        { steps.map((s) => <Step>{stepMap[s]}</Step>) }
      </Steps>
    </Wrapper>
  )
}

export default StepIndicator
