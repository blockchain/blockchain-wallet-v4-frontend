import React from 'react'
import PropTypes from 'prop-types'
import { keysIn } from 'ramda'
import styled from 'styled-components'

import { Palette } from '../../Colors/index.ts'
import { Icon } from '../../Icons'

const Wrapper = styled.div`
  display: inline-flex;
  text-transform: ${props => (props.uppercase ? 'uppercase' : 'none')};
  position: relative;
`
const ButtonContainer = styled.div`
  display: inline-flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  width: inherit;
  font-size: ${props => props.size};
  font-weight: 600;

  & > * {
    color: ${props => props.theme[props.color]}!important;
  }
`
const Button = styled.div`
  display: inline;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
    Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
`
const DropdownIcon = styled(Icon)`
  margin-left: 4px;
  font-weight: 600;
`
const DropdownList = styled.ul`
  background-clip: padding-box;
  background-color: ${props => props.theme.white};
  border: 1px solid ${props => props.theme.grey000};
  border-radius: 4px;
  bottom: 0px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.175);
  display: ${props => (props.toggled ? 'block' : 'none')};
  float: none;
  height: auto;
  width: inherit;
  line-height: 20px;
  list-style-image: none;
  list-style-position: outside;
  list-style-type: none;
  margin: 2px 0px;
  max-height: 230px;
  min-width: 20px;
  overflow: auto;
  padding: 5px 0px;
  position: absolute;
  left: 0;
  ${props =>
    props.down
      ? 'top: 25px; bottom: auto;'
      : 'top: auto; bottom: 25px;'} z-index: 10;
`

const DropdownItem = styled.li`
  color: ${props => props.theme['grey800']};
  cursor: pointer;
  padding: 3px 20px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
    Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  font-size: 14px;
  font-weight: 400;
  text-align: left;
  text-size-adjust: 100%;
  white-space: nowrap;

  &:hover {
    color: ${props => props.theme.blue600};
  }
`

const Dropdown = props => {
  const {
    color,
    down,
    handleCallback,
    handleClick,
    items,
    selectedItem,
    size,
    toggled,
    uppercase
  } = props

  return (
    <Wrapper uppercase={uppercase}>
      <DropdownList toggled={toggled} down={down}>
        {items.map((item, index) => {
          return (
            <DropdownItem key={index} onClick={handleCallback.bind(null, item)}>
              {item.text}
            </DropdownItem>
          )
        })}
      </DropdownList>
      <ButtonContainer size={size} color={color} onClick={handleClick}>
        <Button>{selectedItem.text}</Button>
        <DropdownIcon name='chevron-down-large' size='12px' />
      </ButtonContainer>
    </Wrapper>
  )
}

Dropdown.defaultProps = {
  color: 'blue600',
  toggled: false,
  selectedValue: 0,
  uppercase: true,
  down: false
}

Dropdown.propTypes = {
  selectedValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  items: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired
    })
  ),
  callback: PropTypes.func.isRequired,
  toggled: PropTypes.bool,
  color: PropTypes.oneOf(keysIn(Palette())),
  uppercase: PropTypes.bool,
  down: PropTypes.bool
}

export default Dropdown
