import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import { Icon } from '../../Icons'
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
const Button = styled.div`
  display: inline;
  font-family: 'Montserrat', Helvetica, sans-serif;

`
const DropdownIcon = styled(Icon)`
  padding-left: 2px;
`
const DropdownList = styled.ul`
  background-clip: padding-box;
  background-color:  ${props => props.theme['white']};;
  border: 1px solid ${props => props.theme['gray-1']};
  border-radius: 4px;
  bottom: 0px;
  #box-sizing: border-box;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.175);
  display: ${props => props.toggled ? 'block' : 'none'};
  float: none;
  height: auto;
  width: inherit;
  line-height: 20px;
  list-style-image: none;
  list-style-position: outside;
  list-style-type: none;
  margin: 2px 0px;
  max-height: 400px;
  min-width: 20px;
  overflow: auto;
  padding: 5px 0px;
  position: absolute;
  right: 0;
  ${props => props.down ? 'top: 25px; bottom: auto;' : 'top: auto; bottom: 25px;'}
  z-index: 10;
`

const DropdownItem = styled.li`
  color: ${props => props.theme['gray-5']};
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
  const { color, down, uppercase, toggled, selectedItem, items, handleClick, handleCallback } = props

  return (
    <Wrapper uppercase={uppercase}>
      <DropdownList toggled={toggled} down={down}>
        { items.map((item, index) => {
          return (<DropdownItem key={index} onClick={handleCallback.bind(null, item)}>{ item.text }</DropdownItem>)
        })}
      </DropdownList>
      <ButtonContainer color={color} onClick={handleClick}>
        <Button>{selectedItem.text}</Button>
        <DropdownIcon name='down-arrow' size='8px' />
      </ButtonContainer>
    </Wrapper>
  )
}

Dropdown.defaultProps = {
  color: 'brand-secondary',
  toggled: false,
  selectedValue: 0,
  uppercase: true,
  down: false
}

Dropdown.propTypes = {
  selectedValue: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  items: PropTypes.arrayOf(PropTypes.shape({
    text: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired
  })),
  callback: PropTypes.func.isRequired,
  toggled: PropTypes.bool,
  color: PropTypes.oneOf(keysIn(Palette())),
  uppercase: PropTypes.bool,
  down: PropTypes.bool
}

export default Dropdown
