import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import { Icon, Text } from 'blockchain-info-components'

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

const Step3 = props => (
  <Wrapper>
    <Circle status={props.status}>
      <Icon name='checkmark' size='40px' color={props.status === 'disabled' ? 'gray-2' : 'brand-primary'} />
    </Circle>
    <Text size='13px' weight={500} capitalize>
      <FormattedMessage id='components.exchangetimeline.trade' defaultMessage='Trade complete' />
    </Text>
  </Wrapper>
)

Step3.propTypes = {
  status: PropTypes.oneOf(['disabled', 'active'])
}

Step3.defaultProps = {
  status: 'disabled'
}

export default Step3
