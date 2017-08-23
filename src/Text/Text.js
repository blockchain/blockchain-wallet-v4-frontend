import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { DefaultColor } from '../Colors'

const BaseText = styled.div`
  font-family: ${props => props.altFont ? "'GillSans', sans-serif" : "'Montserrat', sans-serif"};
  font-weight: ${props => props.weight};
  font-size: ${props => props.size};
  text-transform: ${props =>
    props.uppercase ? 'uppercase'
      : props.capitalize ? 'capitalize' : 'none'};
  font-style: ${props => props.italic ? 'italic' : 'normal'};
  color: ${props => props.color};
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
  color: PropTypes.oneOf([DefaultColor.mahogany, DefaultColor.white, DefaultColor.iris, DefaultColor.balihai, DefaultColor.bittersweet, DefaultColor.irisgreen, DefaultColor.blue, DefaultColor.text]),
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
