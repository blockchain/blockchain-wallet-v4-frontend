import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import { Icon, Text } from 'blockchain-info-components'

const Header = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  width: 100%;
  height: 100px;
  margin-top: 15px;
  background-color: ${props => props.theme['brand-quaternary']};
  border: 1px solid ${props => props.theme['gray-1']};
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
const Step = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

// .step-arrow {
//     border-top: 1px solid  #727272;
//     position: relative;
//
//   &:before {
//       content: '';
//       position: absolute;
//       right: -2px;
//       background: #727272;
//       height: 1px;
//       width: 12px;
//       top: -5px;
//       transform: rotate(45deg);
//     }
//
//   &:after {
//       content: '';
//       position: absolute;
//       right: -2px;
//       background:  #727272;
//       height: 1px;
//       width: 12px;
//       top: 3px;
//       transform: rotate(-45deg);
//     }
//   }
//   span.f-14 {
//     width: 30px;
//     height: 30px;
//     line-height: 30px;
//     border-radius: 15px;
//     background: $basic-grey;
//   }
// .primary {
//     span.f-14 {
//       background: $primary;
//     }
//   }
// .border-top {
//     height: 5px;
//   }
// }

const ExchangeStepper = (props) => {
  const { currentStep, steps } = props

  return (
    <Header>
      <Icon name='cart' color='gray-5' size='54px' />
      <Text>
        <FormattedMessage id='scenes.home.exchangeStepper.title' defaultMessage='Complete the following steps to buy & sell bitcoin.' />
      </Text>
      <Step>
        <Icon name='checkmark-in-circle-filled' color='brand-secondary' size='42px' />
        <Text size='12px' weight={300} color='gray-5'>
          <FormattedMessage id='scenes.home.exchangeStepper.step1' defaultMessage='Create Account' />
        </Text>
      </Step>
      <Step>
        <Icon name='checkmark-in-circle-filled' color='brand-secondary' size='42px' />
        <Text size='12px' weight={300} color='gray-5'>
          <FormattedMessage id='scenes.home.exchangeStepper.step2' defaultMessage='Verify Identity' />
        </Text>
      </Step>
      <Step>
        <Icon name='checkmark-in-circle-filled' color='brand-secondary' size='42px' />
        <Text size='12px' weight={300} color='gray-5'>
          <FormattedMessage id='scenes.home.exchangeStepper.step3' defaultMessage='Upload Documents' />
        </Text>
      </Step>
      <Step>
        <Icon name='checkmark-in-circle-filled' color='brand-secondary' size='42px' />
        <Text size='12px' weight={300} color='gray-5'>
          <FormattedMessage id='scenes.home.exchangeStepper.step4' defaultMessage='Link Bank' />
        </Text>
      </Step>
    </Header>
  )
}

ExchangeStepper.propTypes = {
  currentStep: PropTypes.number.isRequired,
  steps: PropTypes.number.isRequired
}

export default ExchangeStepper
