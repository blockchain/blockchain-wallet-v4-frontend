import React from 'react'
import PropTypes from 'prop-types'
import styled, { keyframes } from 'styled-components'
import { FormattedMessage } from 'react-intl'

import { Icon, Text } from 'blockchain-info-components'

const animation = keyframes`
  0% { transform: rotate(0deg); }
  50% { transform: rotate(-180deg); }
  100% { transform: rotate(-360deg); }
`
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 30%;
  background-color: ${props => props.theme['white']};

  & > :first-child { margin-bottom 20px; }
  & > :last-child { height: 40px; }
`
const Circle = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 80px;
  height: 80px;
  border-radius: 40px;
  border: 1px solid ${props => props.status === 'disabled' ? props.theme['gray-2'] : props.theme['brand-primary']};
  box-sizing: border-box;
  overflow: hidden;
`
const AnimatedIcon = styled(Icon)`
  animation: ${animation} 1.5s infinite linear;
  animation-play-state: ${props => props.status === 'active' ? 'running' : 'paused'};
`
const SmallCircle = styled(Circle)`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 20px;
  height: 20px;
  margin-left: -10px;
  margin-top: -10px;
  background-color: ${props => props.theme['white']};
  border: none;
`

const Step2 = props => (
  <Wrapper>
    <Circle status={props.status}>
      <AnimatedIcon name='exchange' size='50px' color={props.status === 'disabled' ? 'gray-2' : 'brand-primary'} status={props.status} />
      <SmallCircle>
        <Icon name='stack-of-coins-2' color={props.status === 'disabled' ? 'gray-2' : 'brand-primary'} />
      </SmallCircle>
    </Circle>
    <Text size='13px' weight={500} capitalize>
      <FormattedMessage id='components.exchangetimeline.exchange' defaultMessage='Exchange In Progress' />
    </Text>
  </Wrapper>
)

Step2.propTypes = {
  status: PropTypes.oneOf(['disabled', 'active', 'inactive'])
}

Step2.defaultProps = {
  status: 'disabled'
}

export default Step2
