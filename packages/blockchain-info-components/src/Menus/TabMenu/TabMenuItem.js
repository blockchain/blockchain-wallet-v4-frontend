import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const BaseTabMenuItem = styled.span`
  position: relative;
  padding: 12px 20px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
    Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  font-weight: 600;
  font-size: 14px;
  text-align: center;
  border-radius: 8px;
  white-space: nowrap;
  width: ${props => props.width || 'auto'};
  margin: 2px;
  color: ${props =>
    props.selected ? props.theme.blue600 : props.theme.grey400};
  cursor: ${props => (props.disabled ? 'not-allowed' : 'pointer')};
  ${props =>
    props.selected &&
    `
    border-radius: 6px;
    background-color: ${props.theme.white};
    color: ${props.theme.blue600};
    box-shadow: 0px 4px 8px rgba(5, 24, 61, 0.1);
  `}
  transition: color 0.3s, background-color 0.3s;

  &:hover {
    color: ${props => !props.disabled && props.theme.blue600};
  }

  @media (max-width: 767px) {
    font-size: 13px;
    padding: 10px 16px;
  }
`

const TabMenuItem = props => {
  const { children, className, selected, ...rest } = props
  const isSelectedOrActive = selected || className === 'active'

  return (
    <BaseTabMenuItem selected={isSelectedOrActive} {...rest}>
      {children}
    </BaseTabMenuItem>
  )
}

TabMenuItem.propTypes = {
  selected: PropTypes.bool
}

export default TabMenuItem
