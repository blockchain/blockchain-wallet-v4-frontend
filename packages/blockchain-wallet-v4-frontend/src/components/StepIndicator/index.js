import React from 'react'
import styled from 'styled-components'
import { Image } from 'blockchain-info-components'

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  justify-content: ${props => props.coinify ? 'flex-end' : ''};

  @media(max-width: 991px) {
    flex-direction: row-reverse;
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
    transition: width 0.3s, height .3s;
    width: ${props => props.width * 100}%;
    background: ${props => props.theme['brand-primary']};
  }
  @media (max-width: 991px) {
    border-bottom: 0;
    padding-bottom: 0px;
    flex-direction: column;
    border-left: 8px solid ${props => props.theme['gray-2']};
    &:after {
      top: 0;
      left: -8px;
      width: 8px;
      bottom: initial;
      height: ${props => props.width * 100}%;
      background: ${props => props.theme['brand-primary']};
    }
  }
`

const Step = styled.span`
  font-size: 14px;
  min-width: ${props => props.coinify ? '135px' : '70px'};
  max-width: ${props => props.coinify ? '135px' : '70px'};
  margin-left: 50px;
  margin-right: 50px;
  overflow: hidden;
  text-align: center;
  white-space: nowrap;
  color: ${props => props.theme['brand-primary']};
  @media (max-width: 991px) {
    margin-top: 10px;
    margin-left: 10px;
    margin-right: 10px;
    margin-bottom: 10px;
  }
`

const Logo = styled(Image)`
  margin-right: 60px;
  @media (max-width: 991px) {
    margin-right: 0px;
    margin-left: 30px;
  }
`

const StepIndicator = (props) => {
  const { step, stepMap, coinify } = props
  const steps = Object.keys(stepMap)
  const index = steps.indexOf(step) + 1
  const width = index / steps.length

  return (
    <Wrapper coinify={coinify}>
      <Logo name='blue-logo' height='50px' />
      <Steps width={width - 0.1}>
        { steps.map((s) => <Step coinify={coinify}>{stepMap[s]}</Step>) }
      </Steps>
    </Wrapper>
  )
}

export default StepIndicator
