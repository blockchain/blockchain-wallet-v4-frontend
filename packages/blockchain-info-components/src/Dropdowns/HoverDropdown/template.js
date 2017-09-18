import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import { Palette } from '../../Colors'
import { keysIn } from 'ramda'

const Wrapper = styled.div`
  display: inline-flex;
  text-transform: ${props => props.uppercase ? 'uppercase' : 'none'};
  position: relative;
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
  background-clip: padding-box;
  background-color:  ${props => props.theme['navhoverbg']};
  display: ${props => props.toggled ? 'block' : 'none'};
  float: none;
  height: auto;
  width: inherit;
  line-height: 20px;
  list-style-image: none;
  list-style-position: outside;
  list-style-type: none;
  margin: 2px 0px;
  overflow: auto;
  padding: 5px 0px;
  position: absolute;
  right: 0;
  z-index: 10;
`

const DropdownItem = styled.div`
  color: ${props => props.theme['navhover']};
  cursor: pointer;
  padding: 3px 20px;
  font-family: 'Montserrat', Helvetica, sans-serif;
  font-size: 14px;
  font-weight: 300;
  text-align: left;
  text-size-adjust: 100%;
  white-space: nowrap;
`

const Dropdown = props => {
  const { color, uppercase, toggled, handleMouseOver, children } = props

  return (
    <Wrapper uppercase={uppercase}>
      <ButtonContainer color={color} onMouseOver={handleMouseOver}>
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
