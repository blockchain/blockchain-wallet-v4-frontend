import React from 'react'
import { colors } from '@blockchain-com/constellation'
import styled from 'styled-components'

import { SwitchLabelProps, SwitchLabelState, SwitchProps, SwitchWrapperProps } from './types'

const SwitchWrapper = styled.div<SwitchWrapperProps>`
  position: relative;
  font-weight: 500;
  font-size: 13px;
  line-height: 20px;
  display: flex;
  flex-shrink: 0;
  align-items: center;
  background: ${({ background }) => background ?? colors.grey700};
  border-radius: 8px;
  margin: 0;
  width: ${({ isFullWidth }) => (isFullWidth ? '100%' : 'fit-content')};
`

const getSwitchColor = (state: SwitchLabelState) => (props: SwitchLabelProps) => {
  if (props.disabled) {
    return colors.grey400
  }
  if (props.selected || state === 'hover') {
    return colors.white900
  }
  return colors.white900
}

const getSwitchBGColor = (state: SwitchLabelState) => (props: SwitchLabelProps) => {
  if (props.disabled) {
    return 'transparent'
  }

  if (props.selected) {
    if (state === 'active') {
      return colors.grey900
    }
    if (state === 'hover') {
      return colors.grey800
    }

    return colors.grey900
  }

  if (state === 'active') {
    return colors.grey900
  }

  if (state === 'hover') {
    return colors.grey800
  }
  return 'transparent'
}

const SwitchLabel = styled.div<SwitchLabelProps>`
  flex: 1;
  text-align: center;
  cursor: ${({ disabled }) => (disabled ?? false ? 'not-allowed' : 'pointer')};
  line-height: 150%;
  font-weight: 600;
  font-size: 16px;
  border-radius: 6px;
  margin: 2px;
  padding: 0.5rem;
  background-color: ${getSwitchBGColor('regular')};
  color: ${getSwitchColor('regular')};
  transition: background-color 300, color 300;
  width: fit-content;
  &:hover {
    color: ${getSwitchColor('hover')};
    background-color: ${getSwitchBGColor('hover')};
  }
  &:active {
    background-color: ${getSwitchBGColor('active')};
  }
`

const Switch = ({
  disabled,

  firstItem,

  handleFirstItemClicked,

  handleSecondItemClicked,
  isFirstItemActive,
  isFullWidth,
  secondItem
}: SwitchProps) => {
  return (
    <SwitchWrapper isFullWidth={isFullWidth}>
      <SwitchLabel
        onClick={handleFirstItemClicked}
        disabled={disabled}
        selected={isFirstItemActive}
      >
        {firstItem}
      </SwitchLabel>
      <SwitchLabel
        onClick={handleSecondItemClicked}
        disabled={disabled}
        selected={!isFirstItemActive}
      >
        {secondItem}
      </SwitchLabel>
    </SwitchWrapper>
  )
}

export default Switch
