import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { transparentize } from 'polished'

import { Text } from '../Text'
import { Link } from '../Links'

const Container = styled.div`
  box-shadow: 0 2px 4px rgba(0, 0, 0, .2);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  background: ${props => transparentize(0.9, (props.theme[props.color]))};
  border-top: 6px solid ${props => transparentize(0.8, (props.theme[props.color]))};
  height: 65px;
  padding: 0 20px;
  width: 500px;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;

  & > :first-child { margin-right: 8px; }
`

const selectStyle = type => {
  switch (type) {
    case 'success': return { color: 'success'}
    case 'error': return { color: 'error' }
    default: return { color: 'brand-secondary' }
  }
}

const Toast = props => {
  const { action, title, type, children } = props
  const style = selectStyle(type)
  const { color, uppercase } = style
  const actionStyle = {
    alignSelf: 'flex-end'
  }
  const messageStyle = {
    alignSelf: 'flex-start'
  }

  return (
    <Container color={color}>
      <Text size='14px' weight={500} color={color} uppercase>
        { title }
      </Text>
      <Link color={color} size='14px' style={actionStyle} weight={400} uppercase>Dismiss</Link>
      <Text size='14px' weight={400} style={messageStyle} color={color}>
        { children }
      </Text>
    </Container>
  )
}

Toast.propTypes = {
  action: PropTypes.node.isRequired,
  children: PropTypes.node.isRequired,
  type: PropTypes.oneOf(['success', 'warning', 'default'])
}

export default Toast
