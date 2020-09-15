import { Image } from 'blockchain-info-components'
import media from 'services/ResponsiveService'
import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: ${props => (props.flexEnd ? 'flex-end' : '')};
`

const Steps = styled.div`
  position: relative;
  flex: 1;
  padding-bottom: 15px;
  display: inline-flex;
  flex-direction: row;
  justify-content: center;
  border-bottom: 8px solid ${props => props.theme.grey200};
  max-width: calc(100% - 50px);
  &:after {
    left: 0;
    content: '';
    height: 8px;
    bottom: -8px;
    position: absolute;
    transition: width 0.3s, height 0.3s;
    width: ${props => props.width * 100}%;
    background: ${props => props.theme.blue900};
  }
  ${media.mobile`
    border-bottom: 0;
    padding-bottom: 0px;
    flex-direction: column;
    border-left: 8px solid ${props => props.theme.grey200};
    ${props =>
      !props.horizontalMobile &&
      `&:after {
      top: 0;
      left: -8px;
      width: 8px;
      bottom: initial;
      height: ${props => props.width * 100}%;
      background: ${props => props.theme.blue900};
    `}}
  `};
`

const Step = styled.span`
  font-size: 14px;
  min-width: ${props => props.minWidth || '80px'};
  max-width: ${props => props.maxWidth || '80px'};
  width: calc(100% / ${props => props.totalSteps});
  margin: 0 50px;
  overflow: hidden;
  text-align: center;
  white-space: nowrap;
  color: ${props => props.theme.blue900};
  ${media.tablet`
    margin: 0 20px;
  `};
  ${media.mobile`
    margin: 10px;
  `};
`

const Logo = styled(Image)`
  margin-right: 60px;
  ${media.mobile`
    margin-right: 0px;
    margin-left: 30px;
  `};
`

const StepIndicator = props => {
  const {
    adjuster,
    className,
    step,
    stepMap,
    minWidth,
    maxWidth,
    flexEnd,
    horizontalMobile
  } = props
  const steps = Object.keys(stepMap)
  const index = steps.indexOf(step) + 1
  const width = (index - adjuster) / steps.length

  return (
    <Wrapper className={className} flexEnd={flexEnd}>
      <Logo name='blockchain-icon' height='50px' />
      <Steps width={width} horizontalMobile={horizontalMobile}>
        {steps.map(step => (
          <Step
            key={step}
            minWidth={minWidth}
            maxWidth={maxWidth}
            totalSteps={steps.length}
          >
            {stepMap[step]}
          </Step>
        ))}
      </Steps>
    </Wrapper>
  )
}

StepIndicator.defaultProps = {
  adjuster: 0.5
}

export default StepIndicator
