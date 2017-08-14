import React from 'react'
import styled from 'styled-components'

const BaseTypography = styled.div`
  font-family: ${props => props.altFont ? "'GillSans', Helvetica, sans-serif" : "'Montserrat', Helvetica, sans-serif"};
  font-weight: ${props =>
    props.lightest ? '100'
    : props.lighter ? '200'
    : props.light ? '300'
    : props.regular ? '400'
    : props.medium ? '500'
    : props.bold ? '600'
    : props.bolder ? '700'
    : props.boldest ? '800'
    : props.black ? '900' : '400'};
  font-size: ${props =>
    props.smallest ? '0.6rem'
    : props.smaller ? '0.8rem'
    : props.small ? '0.9rem'
    : props.big ? '1.1rem'
    : props.bigger ? '1.3rem'
    : props.biggest ? '1.5rem'
    : props.giant ? '2rem'
    : props.gianter ? '2.2rem'
    : props.giantest ? '2.5rem' : '1rem'};
  text-transform: ${props =>
    props.uppercase ? 'uppercase'
    : props.capitalize ? 'capitalize' : 'none'};
  font-style: ${props => props.italic ? 'italic' : 'normal'};
  color: ${props =>
    props.white ? '#FFFFFF'
    : props.cyan ? '#10ADE4'
    : props.red ? '#CA3A3C'
    : '#5F5F5F'};
  margin-right: ${props => props.spaceRight ? '5px' : '0'};
`

const Typography = ({ ...props, children }) => {
  return (
    <BaseTypography {...props}>
      {children}
    </BaseTypography>
  )
}

export { Typography }
