import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { Icon } from '../../Icons'

const SelectBoxInput = styled.div`
  position: relative;
  display: block;
  width: 100%;
`
const Display = styled.button.attrs({ type: 'button' })`
  width: 100%;
  height: 40px;
  cursor: inherit;
  white-space: nowrap;
  user-select: none;
  cursor: pointer;
  border: 1px solid ${props => props.errorState === 'initial' ? '#CCCCCC' : props.errorState === 'invalid' ? '#990000' : '#006600'};
  border-radius: 0;
  background-color: ${props => props.disabled ? props.theme['gray-1'] : props.theme['white']};
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};

  &:focus { outline: none; }
`
const DefaultDisplay = styled.div`
  width: 100%;
  padding: 0.5rem 1rem;
  box-sizing: border-box;
  font-family: 'Montserrat', sans-serif;
  font-size: 14px;
  font-weight: 300;
  text-align: left;
  color: ${props => props.theme['gray-5']};

`
const Search = styled.input.attrs({ type: 'text' })`
  width: 100%;
  height: 40px;
  font-family: 'Montserrat', sans-serif;
  font-size: 14px;
  font-weight: normal;
  box-shadow: none;
  color: ${props => props.theme['gray-3']};
  background-color: ${props => props.theme['white']};
  border: 1px solid ${props => props.theme['gray-2']};
  box-sizing: border-box;
  padding: 0.5rem 1rem;

  &:focus {
    border-radius: none;
    border: 1px solid ${props => props.theme['gray-2']};
    outline: none;
  }
`
const Header = styled.div`
  width: 100%;
`
const DefaultHeader = styled.div`
  width: 100%;
  padding: 0.5rem 1rem;
  box-sizing: border-box;
  font-family: 'Montserrat', sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: ${props => props.theme['gray-4']};
  background-color: ${props => props.theme['gray-2']};
  cursor: not-allowed;

  &:hover { color: ${props => props.theme['gray-4']}; }
`
const List = styled.div`
  position: absolute;
  display: ${props => props.expanded ? 'flex' : 'none'};
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  order: 1;
  width: 100%;
  height: auto;
  max-height: 140px;
  overflow-x: hidden;
  background-color: ${props => props.theme['white']};
  border: 1px solid ${props => props.theme['gray-2']};
  box-sizing: border-box;
  z-index: 10;
`
const Item = styled.div`
  width: 100%;
`
const DefaultItem = styled.div`
  width: 100%;
  padding: 0.5rem 1rem;
  box-sizing: border-box;
  font-family: 'Montserrat', sans-serif;
  font-weight: 300;
  font-size: 14px;
  color: ${props => props.theme['gray-4']};
  cursor: pointer;

  &:hover {
    color: ${props => props.theme['gray-4']};
    background-color: ${props => props.theme['gray-1']};
  }
`
const Arrow = styled(Icon)`
  position: absolute;
  top: 15px;
  right: 15px;
`

const SelectInput = (props) => {
  const { items, selected, disabled, defaultDisplay, expanded, searchEnabled, handleBlur, handleChange, handleClick, handleFocus, templateDisplay, templateHeader, templateItem, errorState } = props
  const display = selected || { text: defaultDisplay, value: undefined }

  return (
    <SelectBoxInput>
      {!expanded || !searchEnabled
        ? <Display onBlur={handleBlur} onFocus={handleFocus} disabled={disabled} errorState={errorState}>
          {templateDisplay ? templateDisplay(display) : <DefaultDisplay>{display.text}</DefaultDisplay>}
        </Display>
        : <Search autoFocus={expanded} onChange={handleChange} />
      }
      <Arrow name='down-arrow' size='10px' />
      <List expanded={expanded}>
        { items.map((item, index) => item.value == null
          ? <Header key={index}>{templateHeader ? templateHeader(item) : <DefaultHeader>{item.text}</DefaultHeader>}</Header>
          : <Item key={index} onMouseDown={() => handleClick(item)}>{templateItem ? templateItem(item) : <DefaultItem>{item.text}</DefaultItem>}</Item>)
        }
      </List>
    </SelectBoxInput>
  )
}

SelectInput.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
    text: PropTypes.oneOfType([PropTypes.string.isRequired, PropTypes.object.isRequired]),
    value: PropTypes.oneOfType([PropTypes.string.isRequired, PropTypes.number.isRequired, PropTypes.object.isRequired])
  })).isRequired,
  selected: PropTypes.shape({
    text: PropTypes.oneOfType([PropTypes.string.isRequired, PropTypes.object.isRequired]),
    value: PropTypes.oneOfType([PropTypes.string.isRequired, PropTypes.number.isRequired, PropTypes.object.isRequired])
  }),
  expanded: PropTypes.bool,
  searchEnabled: PropTypes.bool,
  opened: PropTypes.bool,
  disabled: PropTypes.bool,
  handleBlur: PropTypes.func,
  handleChange: PropTypes.func,
  handleClick: PropTypes.func,
  handleFocus: PropTypes.func,
  templateHeader: PropTypes.func,
  templateItem: PropTypes.func
}

export default SelectInput
