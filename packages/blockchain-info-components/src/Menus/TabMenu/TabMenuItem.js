import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const BaseTabMenuItem = styled.span`
  padding: 10px;
  text-decoration: ${props => (props.selected ? 'underline' : 'none')};
  text-transform: uppercase;
  font-family: 'Montserrat', sans-serif;
  font-weight: 500;
  font-size: 16px;
  text-align: center;
  color: ${props =>
    props.selected ? props.theme['gray-5'] : props.theme['gray-3']};
  cursor: pointer;

  &.active {
    text-decoration: underline;
    color: ${props => props.theme['gray-5']};
  }
  @media (max-width: 480px) {
    font-size: 13px;
  }
`

const TabMenuItem = props => {
  const { children, selected, ...rest } = props

  return (
    <BaseTabMenuItem selected={selected} {...rest}>
      {children}
    </BaseTabMenuItem>
  )
}

TabMenuItem.propTypes = {
  selected: PropTypes.bool
}

export default TabMenuItem
