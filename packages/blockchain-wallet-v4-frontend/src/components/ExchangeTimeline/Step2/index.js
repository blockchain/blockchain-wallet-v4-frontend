import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'

import { Icon, Text } from 'blockchain-info-components'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 30%;
  background-color: ${props => props.theme.white};

  & > :first-child {
    margin-bottom: 20px;
  }
  & > :last-child {
    height: 40px;
  }
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
  border: 1px solid
    ${props =>
      props.status === 'disabled' ? props.theme.grey200 : props.theme.blue900};
  box-sizing: border-box;
  overflow: hidden;
`
const SmallCircle = styled(Circle)`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 20px;
  height: 20px;
  margin-left: -10px;
  margin-top: -10px;
  background-color: ${props => props.theme.white};
  border: none;
`

const Step2 = props => (
  <Wrapper>
    <Circle status={props.status}>
      <Icon
        name='arrow-switch-thick'
        size='50px'
        color={props.status === 'disabled' ? 'grey200' : 'blue900'}
        status={props.status}
      />
      <SmallCircle>
        <Icon
          name='stack-of-coins'
          color={props.status === 'disabled' ? 'grey200' : 'blue900'}
        />
      </SmallCircle>
    </Circle>
    <Text size='13px' weight={500} capitalize>
      <FormattedMessage
        id='components.exchangetimeline.exchange.inprogress'
        defaultMessage='Exchange In Progress'
      />
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
