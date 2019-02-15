import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import { Icon } from '../../Icons'
import { Palette } from '../../Colors'
import { keysIn } from 'ramda'

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
`
const Button = styled.div`
  display: inline;
`
const DropdownIcon = styled(Icon)`
  cursor: pointer;
  padding-left: 4px;
`
const DropdownList = styled.ul`
  background-clip: padding-box;
  background-color: ${props => props.theme['white']};
  border: 1px solid ${props => props.theme['gray-1']};
  border-radius: 4px;
  bottom: 0px;
  box-sizing: border-box;
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
  min-width: 20px;
  overflow: auto;
  padding: 5px;
  position: absolute;
  right: 0;
  ${props =>
    props.down
      ? 'top: 25px; bottom: auto;'
      : 'top: auto; bottom: 25px;'} z-index: 10;
`

const DropdownItem = styled.li`
  color: ${props => props.theme['gray-5']};
  cursor: pointer;
  font-family: 'Montserrat', Helvetica, sans-serif;
  font-size: 14px;
  font-weight: 300;
  text-align: left;
  text-size-adjust: 100%;
  white-space: nowrap;
`

const Dropdown = props => {
  const {
    color,
    down,
    uppercase,
    toggled,
    selectedComponent,
    components,
    handleClick,
    handleCallback
  } = props

  return (
    <Wrapper uppercase={uppercase}>
      <DropdownList toggled={toggled} down={down} data-e2e={props['data-e2e']}>
        {components.map((comp, index) => {
          return (
            <DropdownItem key={index} onClick={handleCallback.bind(null, comp)}>
              {comp}
            </DropdownItem>
          )
        })}
      </DropdownList>
      <ButtonContainer color={color} onClick={handleClick}>
        <Button>{selectedComponent}</Button>
        <DropdownIcon
          name='down-arrow'
          size='12px'
          data-e2e='dropdownToggleButton'
        />
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
  selectedValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  callback: PropTypes.func.isRequired,
  toggled: PropTypes.bool,
  color: PropTypes.oneOf(keysIn(Palette())),
  uppercase: PropTypes.bool,
  down: PropTypes.bool
}

export default Dropdown
