import React from "react"
import styled from "styled-components"

const DropdownTipContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  transform: translateX(${props => props.x}px) translateY(${props => props.y}px);
  transition: all 0.35s ease-in-out;
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
  <DropdownTipContainer x={props.x} y={props.y}>
    <DropdownTip />
  </DropdownTipContainer>
)
