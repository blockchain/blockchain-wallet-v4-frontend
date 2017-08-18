import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

const BaseText = styled.div`
  font-family: ${props => props.altFont ? "'GillSans', sans-serif" : "'Montserrat', sans-serif"};
  font-weight: ${props => props.weight};
  font-size: ${props => props.size};
  text-transform: ${props =>
    props.uppercase ? 'uppercase'
      : props.capitalize ? 'capitalize' : 'none'};
  font-style: ${props => props.italic ? 'italic' : 'normal'};
  color: ${props =>
    props.color === 'cyan' ? '#10ADE4'
    : props.color === 'white' ? '#FFFFFF'
    : props.color === 'red' ? '#CA3A3C' : '#5F5F5F'};
`

const Text = ({ ...props, children }) => {
  return (
    <BaseText {...props}>
      {children}
    </BaseText>
  )
}

Text.propTypes = {
  weight: PropTypes.oneOf([100, 200, 300, 400, 500, 600, 700, 800, 900]),
  size: PropTypes.string,
  uppercase: PropTypes.bool,
  capitalize: PropTypes.bool,
  italic: PropTypes.bool,
  color: PropTypes.oneOf(['red', 'white', 'cyan']),
  altFont: PropTypes.bool
}

Text.defaultProps = {
  weight: 400,
  size: '16px',
  uppercase: false,
  capitalize: false,
  italic: false,
  altFont: false
}

export default Text
