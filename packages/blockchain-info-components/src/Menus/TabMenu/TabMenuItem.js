import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'

const BaseTabMenuItem = styled.span`
  position: relative;
  padding: 12px 20px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
    Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  font-weight: 500;
  font-size: 14px;
  text-align: center;
  border-radius: 8px;
  margin: 2px;
  color: ${props =>
    props.selected ? props.theme.blue600 : props.theme.grey400};
  cursor: pointer;
  ${props =>
    props.selected &&
    `
    background-color: ${props.theme.white};
    color: ${props.theme.blue600};
  `}

  @media (max-width: 767px) {
    font-size: 13px;
    padding: 10px 16px;
  }
`

const TabMenuItem = props => {
  const { children, selected, className, ...rest } = props
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
