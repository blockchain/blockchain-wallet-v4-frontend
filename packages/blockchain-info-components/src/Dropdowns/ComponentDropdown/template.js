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
  width: 100%;
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
  background-color: ${props => props.theme.white};
  border-radius: 8px;
  bottom: 0;
  box-sizing: border-box;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  display: ${props => (props.toggled ? 'block' : 'none')};
  float: none;
  height: auto;
  width: ${props => (props.width ? props.width : 'inherit')};
  line-height: 24px;
  list-style-image: none;
  list-style-position: outside;
  list-style-type: none;
  margin: ${props => (props.margin ? props.margin : '2px 0')};
  min-width: 20px;
  overflow: auto;
  padding: 5px;
  position: absolute;
  right: 0;
  z-index: 10;
  ${props =>
    props.down ? 'top: 25px; bottom: auto;' : 'top: auto; bottom: 25px;'};
`

const DropdownItem = styled.li`
  color: ${props => props.theme['grey900']};
  cursor: pointer;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
    Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  font-size: 14px;
  font-weight: 500;
  text-align: ${props => (props.textAlign ? props.textAlign : 'left')};
  white-space: nowrap;

  > div:hover {
    color: ${props => props.theme.blue600};
  }
`

const Dropdown = props => {
  const {
    color,
    components,
    down,
    handleCallback,
    handleClick,
    margin,
    selectedComponent,
    textAlign,
    toggled,
    uppercase,
    width
  } = props

  return (
    <Wrapper uppercase={uppercase}>
      <DropdownList
        data-e2e={props['data-e2e']}
        down={down}
        margin={margin}
        toggled={toggled}
        width={width}
      >
        {components.map((comp, index) => {
          return (
            <DropdownItem
              key={index}
              onClick={handleCallback.bind(null, comp)}
              textAlign={textAlign}
            >
              {comp}
            </DropdownItem>
          )
        })}
      </DropdownList>
      <ButtonContainer color={color} onClick={handleClick}>
        <Button>{selectedComponent}</Button>
        <DropdownIcon
          name={toggled ? 'chevron-up' : 'chevron-down'}
          size='18px'
          data-e2e='dropdownToggleButton'
        />
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
  callback: PropTypes.func,
  color: PropTypes.oneOf(keysIn(Palette())),
  down: PropTypes.bool,
  margin: PropTypes.string,
  selectedValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  textAlign: PropTypes.string,
  toggled: PropTypes.bool,
  uppercase: PropTypes.bool,
  width: PropTypes.string
}

export default Dropdown
