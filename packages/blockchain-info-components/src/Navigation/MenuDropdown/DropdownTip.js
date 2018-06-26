import React from "react"
import styled from "styled-components"

const DropdownTipContainer = styled.div`
  left: 0;
  top: ${props => props.dropdownTop}px;
  transform: translateX(${props => props.x}px) translateY(${props => props.y}px);
  transition: all 0.35s ease-in-out;
  position: absolute;
  z-index: 1001;
`

const DropdownTip = styled.div`
  height: 1.25rem;
  width: 1.25rem;
  background-color: #fff;
  transform: rotate(45deg);
  border-radius: var(--smBorderRadius);
`

export default props => (
  <DropdownTipContainer dropdownTop={props.dropdownTop} x={props.x} y={props.y}>
    <DropdownTip />
  </DropdownTipContainer>
)
