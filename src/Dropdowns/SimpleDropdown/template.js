import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import { Icon } from '../../Icons'

const Wrapper = styled.div`
  text-transform: ${props => props.uppercase ? 'uppercase' : 'none'};
  position: relative;
`
const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  cursor: pointer;
  align-items: center;
  color: ${props => props.color === 'cyan' ? '#10ADE4' : 'white'};
  #background-color: ${props => props.color === 'cyan' ? '#e3eff5' : '#004a7c'};
  width: min-content;
  height: auto;
`
const Button = styled.div`
  display: inline-block;
`
const DropdownIcon = styled(Icon)`
  padding-left: 2px;
  font-size: 8px;
`
const DropdownList = styled.ul`
  background-clip: padding-box;
  background-color: white;
  border: 1px solid rgba(0, 0, 0, 0.15);
  border-radius: 4px;
  bottom: 0px;
  #box-sizing: border-box;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.175);
  display: ${props => props.toggled ? 'block' : 'none'};
  float: none;
  height: auto;
  line-height: 20px;
  list-style-image: none;
  list-style-position: outside;
  list-style-type: none;
  margin: 2px 0px;
  max-height: 450px;
  min-width: 20px;
  overflow: auto;
  padding: 5px 0px;
  position: absolute;
  ${props => props.down ? 'top: 25px; bottom: auto;'
                        : 'top: auto; bottom: 25px;'}
  z-index: 10;
`

const DropdownItem = styled.li`
  color: rgb(51, 51, 51);
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
          return <DropdownItem key={index} onClick={handleCallback.bind(null, item)}>{item.text}</DropdownItem>
        })}
      </DropdownList>
      <ButtonContainer color={color} onClick={handleClick}>
        <Button>{selectedItem.text}</Button>
        <DropdownIcon name='down_arrow' />
      </ButtonContainer>
    </Wrapper>
  )
}

Dropdown.defaultProps = {
  color: 'cyan',
  toggled: false,
  selectedValue: 0,
  uppercase: true,
  down: false
}

Dropdown.PropTypes = {
  selectedValue: PropTypes.number,
  items: PropTypes.arrayOf(PropTypes.shape({
    text: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired
  })),
  callback: PropTypes.func.isRequired,
  toggled: PropTypes.bool,
  color: PropTypes.oneOf(['cyan', 'white']),
  uppercase: PropTypes.bool,
  down: PropTypes.bool
}

export default Dropdown
