import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const BaseText = styled.div`
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
    Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  font-weight: ${props => props.weight};
  font-size: ${props => props.size};
  line-height: ${props => props.lineHeight};
  text-transform: ${props =>
    props.uppercase ? 'uppercase' : props.capitalize ? 'capitalize' : 'none'};
  font-style: ${props => (props.italic ? 'italic' : 'normal')};
  color: ${props => props.theme[props.color]};
  cursor: ${props => props.cursor};
  flex-direction: ${props => (props.flexRow ? 'row' : null)};
  display: ${props => (props.flexRow ? 'flex' : 'block')};
  opacity: ${props => props.opacity};
`

const Text = ({ children, ...props }) => {
  return (
    <BaseText data-e2e={props['data-e2e']} {...props}>
      {children}{' '}
    </BaseText>
  )
}

Text.propTypes = {
  weight: PropTypes.oneOf([100, 200, 300, 400, 500, 600, 700, 800, 900]),
  size: PropTypes.string,
  uppercase: PropTypes.bool,
  capitalize: PropTypes.bool,
  lineHeight: PropTypes.string,
  italic: PropTypes.bool,
  altFont: PropTypes.bool,
  cursor: PropTypes.string,
  opacity: PropTypes.number
}

Text.defaultProps = {
  weight: 400,
  size: '16px',
  uppercase: false,
  capitalize: false,
  lineHeight: 'inherit',
  italic: false,
  color: 'grey700',
  altFont: false,
  cursor: 'inherit',
  opacity: 1
}

export default Text
