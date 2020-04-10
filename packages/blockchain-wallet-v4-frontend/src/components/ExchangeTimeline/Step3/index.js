import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'

import { Color, Icon, Text } from 'blockchain-info-components'

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
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 80px;
  height: 80px;
  border-radius: 40px;
  border: 1px solid ${props => getColor(props.status)};
  box-sizing: border-box;
  overflow: hidden;
`

const getColor = status => {
  switch (status) {
    case 'disabled':
      return Color('grey200')
    case 'refunded':
      return Color('error')
    default:
      return Color('blue900')
  }
}

const Step3 = props => {
  const { status } = props

  return (
    <Wrapper>
      <Circle status={status}>
        {status === 'refunded' ? (
          <Icon name='alert-filled' size='40px' color='error' />
        ) : (
          <Icon
            name='checkmark'
            size='40px'
            color={status === 'disabled' ? 'grey200' : 'blue900'}
          />
        )}
      </Circle>
      <Text size='13px' weight={500} capitalize>
        {status === 'refunded' ? (
          <FormattedMessage
            id='components.exchangetimeline.refunded'
            defaultMessage='Trade refunded'
          />
        ) : (
          <FormattedMessage
            id='components.exchangetimeline.trade'
            defaultMessage='Trade complete'
          />
        )}
      </Text>
    </Wrapper>
  )
}

Step3.propTypes = {
  status: PropTypes.oneOf(['disabled', 'active'])
}

Step3.defaultProps = {
  status: 'disabled'
}

export default Step3
