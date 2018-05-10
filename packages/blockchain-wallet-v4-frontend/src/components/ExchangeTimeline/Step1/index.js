import React from 'react'
import PropTypes from 'prop-types'
import styled, { keyframes } from 'styled-components'
import { FormattedMessage } from 'react-intl'

import { Icon, Text } from 'blockchain-info-components'

const animation = keyframes`
  from { transform: translate(-200%, 100%); }
  to { transform: translate(100%, -200%); }
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
  border: 1px solid ${props => props.theme['brand-primary']};
  box-sizing: border-box;
  overflow: hidden;
`
const AnimatedIcon = styled(Icon)`
  position: absolute;
  top: 50%;
  left: 50%;
  animation: ${animation} 2s infinite ease-in;
  animation-play-state: running;
`

const Step1 = props => (
  <Wrapper>
    <Circle>
      { props.status === 'active'
        ? <AnimatedIcon name='paper-airplane' size='40px' color='brand-primary' />
        : <Icon name='paper-airplane' size='40px' color='brand-primary' />
      }
    </Circle>
    <Text size='13px' weight={500} capitalize>
      <FormattedMessage id='components.exchangetimeline.funds' defaultMessage='Funds sent' />
    </Text>
  </Wrapper>
)

Step1.propTypes = {
  status: PropTypes.oneOf(['active', 'inactive'])
}

Step1.defaultProps = {
  status: 'active'
}

export default Step1
