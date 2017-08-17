import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

const BaseLink = styled.a`
  cursor : pointer;
  text-decoration: none;
  font-weight: ${props => props.bold ? 700 : 400};
  color: ${props =>
    props.color === 'cyan' ? '#00aee6'
    : props.color === 'gray' ? '#799eb2' : '#004a7c'};
  text-transform: ${props => props.uppercase ? 'uppercase' : 'none'};

  &:hover { 
    color: ${props =>
    props.color === 'cyan' ? '#00aee6'
    : props.color === 'gray' ? '#799eb2' : '#00aee6'};
  }
  &:focus { text-decoration: none; }
`

const Link = ({...props, children}) => {
  return (
    <BaseLink {...props}>
      {children}
    </BaseLink>
  )
}

Link.propTypes = {
  bold: PropTypes.bool,
  uppercase: PropTypes.bool,
  color: PropTypes.oneOf(['cyan', 'gray', 'navy'])
}

Link.defaultProps = {
  color: 'cyan',
  bold: false,
  uppercase: false
}

export default Link
