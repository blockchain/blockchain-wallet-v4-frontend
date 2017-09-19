import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import { Palette } from '../../Colors'
import { keysIn } from 'ramda'

const Wrapper = styled.div`
  display: inline-flex;
  text-transform: ${props => props.uppercase ? 'uppercase' : 'none'};
  position: relative;
  background-color:  ${props => props.toggled ? props.theme['navhoverbg'] : 'none'};
`
const ButtonContainer = styled.div`
  display: inline-flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  width: inherit;

  & > * {
    color: ${props => props.theme[props.color]}!important;
  }
`

const DropdownList = styled.div`
  display: ${props => props.toggled ? 'block' : 'none'};
  height: auto;
  width: inherit;
  list-style-image: none;
  list-style-position: outside;
  list-style-type: none;
  overflow: auto;
  position: absolute;
  margin-top: 20px;
  z-index: 10;
`

const DropdownItem = styled.div`
  color: ${props => props.theme['navhover']};
  cursor: pointer;
  white-space: nowrap;
`

const Dropdown = props => {
  const { color, uppercase, toggled, handleMouseOver, children, handleMouseOut } = props

  return (
    <Wrapper uppercase={uppercase} onMouseOver={handleMouseOver} onMouseOut={handleMouseOut} toggled={toggled}>
      <ButtonContainer color={color}>
        {children[0]}
      </ButtonContainer>
      <DropdownList toggled={toggled}>
        {children.map((child, index) => {
          if (index > 0) {
            return (
              <DropdownItem key={index}>
                {child}
              </DropdownItem>
            )
          }
        })}
      </DropdownList>
    </Wrapper>
  )
}

Dropdown.defaultProps = {
  color: 'white',
  toggled: false,
  uppercase: true
}

Dropdown.PropTypes = {
  callback: PropTypes.func,
  toggled: PropTypes.bool,
  color: PropTypes.oneOf(keysIn(Palette())),
  uppercase: PropTypes.bool
}

export default Dropdown
