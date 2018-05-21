import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import { Icon, Text } from 'blockchain-info-components'

const Header = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  margin-top: 15px;
  background-color: ${props => props.theme['brand-quaternary']};
  border: 1px solid ${props => props.theme['gray-1']};
  *:hover {
    cursor: pointer;
  }
  -webkit-animation: fadeIn 1.25s ease-in 1 forwards;
  animation: fadeIn 1.25s ease-in 1 forwards;
  opacity: 0;
  @-webkit-keyframes fadeIn {
    to {
      opacity: 1;
    }
  }
  @keyframes fadeIn {
    to {
      opacity: 1;
    }
  }
`
const LeftColumn = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  height: 100px;
  flex-basis: 45%;
  padding: 0 15px;
  @media(max-width: 992px) { 
    flex-basis: 100%;
    justify-content: space-evenly; 
  }
`
const RightColumn = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
  height: 100px;
  flex-basis: 55%;
  flex-grow: 1;
  padding: 0 15px;
  @media(max-width: 992px) { display: none; }
`
const Step = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  flex-grow: 1;
  flex-wrap: wrap;
`
const ArrowWrapper = styled.div`
  position: relative;
  width: 100%;
`
const Arrow = styled.div`
  width: 100%; 
  border-top: 1px solid  #727272;
  position: absolute;
  top: -10px;
  left: 0px;

  &:before {
    content: '';
    position: absolute;
    right: -2px;
    background: #727272;
    height: 1px;
    width: 12px;
    top: -5px;
    transform: rotate(45deg);
  }

  &:after {
    content: '';
    position: absolute;
    right: -2px;
    background:  #727272;
    height: 1px;
    width: 12px;
    top: 3px;
    transform: rotate(-45deg);
  }
`
const Circle = styled.div`
  width: 30px;
  height: 30px;
  line-height: 30px;
  border-radius: 15px;
  background: #757575;
  margin-bottom: 10px;
  flex-wrap: nowrap;
  
  &.step-complete {
    background: ${props => props.theme['brand-secondary']};
  }
  
  & > span:first-child {
    padding-left: 8px;
  }
`

const getStepTitle = (step) => {
  switch (step) {
    case 1: return <FormattedMessage id='scenes.home.exchangeStepper.step1' defaultMessage='Create Account' />
    case 2: return <FormattedMessage id='scenes.home.exchangeStepper.step2' defaultMessage='Verify Identity' />
    case 3: return <FormattedMessage id='scenes.home.exchangeStepper.step3' defaultMessage='Upload Documents' />
    case 4: return <FormattedMessage id='scenes.home.exchangeStepper.step4' defaultMessage='Link Bank' />
    default: return <div />
  }
}

const BuySellStepper = (props) => {
  const { currentStep, goToBuySell } = props

  return (
    <Header onClick={() => { goToBuySell() }}>
      <LeftColumn>
        <Icon name='cart' color='gray-5' size='54px' style={{ paddingRight: 15 }} />
        <Text size='18px' weight={200}>
          <FormattedMessage id='scenes.home.exchangeStepper.title' defaultMessage='Complete the following steps to buy & sell bitcoin.' />
        </Text>
      </LeftColumn>
      <RightColumn>
        {[...Array(4)].map((r, i) => {
          let rStep = i + 1
          return (
            <React.Fragment key={i}>
              <Step>
                <Circle className={currentStep >= i ? 'step-complete' : ''}>
                  {currentStep > i && <Icon name='checkmark' size='13px' color='white-blue' weight={600}/>}
                  {currentStep <= i && <Text color='white-blue' weight={200}>{rStep}</Text>}
                </Circle>
                <Text size='12px' weight={300} color={currentStep >= i ? 'brand-secondary' : 'gray-5'}>
                  {getStepTitle(rStep)}
                </Text>
              </Step>
              {i !== 3 && <ArrowWrapper><Arrow/></ArrowWrapper>}
            </React.Fragment>
          )
        })}
      </RightColumn>
    </Header>
  )
}

BuySellStepper.propTypes = {
  currentStep: PropTypes.number.isRequired,
  goToBuySell: PropTypes.func.isRequired
}

export default BuySellStepper
