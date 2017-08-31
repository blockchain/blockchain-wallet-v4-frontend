import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Color from 'color'

import { DefaultColor } from '../Colors'
import { Icon } from '../Icons'
import { Text } from '../Text'

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  background: ${props => props.backgroundColor};
  border: 1px solid ${props => props.borderColor};
  border-radius: 4px;
  padding: 5px 10px;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;

  & > :first-child { margin-right: 8px; }
`

const selectStyle = type => {
  switch (type) {
    case 'success': return { color: 'success', uppercase: false, icon: 'success' }
    case 'warning': return { color: 'error', uppercase: true, icon: 'alert' }
    case 'alert': return { color: 'iris', uppercase: false, icon: 'bell' }
    default: return { color: 'iris', uppercase: false, icon: null }
  }
}

const Banner = props => {
  const { type, children } = props
  const style = selectStyle(type)
  const { color, uppercase, icon } = style

  const backgroundColor = Color(DefaultColor[color]).fade(0.9).toString()
  const borderColor = Color(DefaultColor[color]).fade(0.8).toString()

  return (
    <Container backgroundColor={backgroundColor} borderColor={borderColor}>
      { icon && <Icon name={icon} size='12px' weight={400} color={color} /> }
      <Text size='12px' weight={400} color={color} uppercase={uppercase}>
        { children }
      </Text>
    </Container>
  )
}

Banner.propTypes = {
  type: PropTypes.oneOf(['success', 'warning', 'alert']),
  children: PropTypes.node.isRequired
}

export default Banner
