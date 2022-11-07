import React from 'react'
import { PaletteColors } from '@blockchain-com/constellation'
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
  background: ${({ background }) => background ?? PaletteColors['grey-500']};
  border-radius: 8px;
  margin: 0;
  width: ${({ isFullWidth }) => (isFullWidth ? '100%' : 'fit-content')};
`

const getSwitchColor = (state: SwitchLabelState) => (props: SwitchLabelProps) => {
  if (props.disabled) {
    return PaletteColors['grey-400']
  }
  if (props.selected || state === 'hover') {
    return PaletteColors['white-800']
  }
  return PaletteColors['white-800']
}

const getSwitchBGColor = (state: SwitchLabelState) => (props: SwitchLabelProps) => {
  if (props.disabled) {
    return 'transparent'
  }

  if (props.selected) {
    if (state === 'active') {
      return PaletteColors['grey-900']
    }
    if (state === 'hover') {
      return PaletteColors['grey-800']
    }

    return PaletteColors['grey-900']
  }

  if (state === 'active') {
    return PaletteColors['grey-900']
  }

  if (state === 'hover') {
    return PaletteColors['grey-800']
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
