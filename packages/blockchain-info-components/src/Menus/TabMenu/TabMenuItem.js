import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const BaseTabMenuItem = styled.span`
  position: relative;
  padding: 6px 8px;
  font-family: 'Montserrat', sans-serif;
  font-weight: 500;
  font-size: 14px;
  text-align: center;
  color: ${props =>
    props.selected ? props.theme['gray-5'] : props.theme['gray-3']};
  cursor: pointer;

  &:not(:last-child) {
    margin-right: 15px;
  }

  &:hover {
    color: ${props => props.theme['gray-5']};
  }

  &.active {
    color: ${props => props.theme['gray-5']};
    & :after {
      position: absolute;
      content: '';
      top: 40px;
      left: 0;
      width: 100%;
      border-bottom: 4px solid ${props => props.theme['brand-secondary']};
    }
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
