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
  padding: 0;
  border: 1px solid ${props => props.errorState === 'initial' ? '#CCCCCC' : props.errorState === 'invalid' ? '#990000' : '#006600'};
  border-radius: 0;
  background-color: ${props => props.disabled ? props.theme['gray-1'] : props.theme['white']};
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  border-left: ${props => props.borderLeft === 'none' ? '0px' : ''};

  &:focus { outline: none; }
`
const DefaultDisplay = styled.div`
  width: 100%;
  box-sizing: border-box;
  padding: 5px 10px 5px 10px;
  font-family: 'Montserrat', sans-serif;
  font-size: ${props => props.fontSize === 'small' ? '12px' : '14px'};
  font-weight: 300;
  text-align: ${props => props.textAlign === 'center' ? 'center' : 'left'};
  overflow: hidden;
  text-overflow: ellipsis;
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
  border-left: ${props => props.borderLeft === 'none' ? '0px' : ''};

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
  border-top: 0px;
  z-index: 10;
  border-left: ${props => props.borderLeft === 'none' ? 'none' : ''};
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
  font-size: ${props => props.fontSize === 'small' ? '12px' : '14px'};
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
  font-size: ${props => props.size || '10px'};
`

const SelectInput = (props) => {
  const { items, selected, disabled, defaultDisplay, expanded, searchEnabled, handleBlur, handleChange, handleClick, handleFocus, hideArrow, templateDisplay, templateHeader, templateItem, errorState, fontSize } = props
  const display = selected || { text: defaultDisplay, value: undefined }
  const showArrow = !hideArrow

  return (
    <SelectBoxInput>
      {!expanded || !searchEnabled
        ? <Display onClick={handleFocus} onBlur={handleBlur} disabled={disabled} errorState={errorState} borderLeft={props.borderLeft}>
          {templateDisplay ? templateDisplay(display) : <DefaultDisplay textAlign={props.textAlign} fontSize={fontSize}>{display.text}</DefaultDisplay>}
        </Display>
        : <Search borderLeft={props.borderLeft} autoFocus={expanded} onChange={handleChange} />
      }
      {showArrow && <Arrow name='down-arrow' size={props.arrowSize} />}
      <List expanded={expanded}>
        { items.map((item, index) => item.value == null
          ? <Header key={index}>{templateHeader ? templateHeader(item) : <DefaultHeader>{item.text}</DefaultHeader>}</Header>
          : <Item key={index} onMouseDown={() => handleClick(item)}>{templateItem ? templateItem(item) : <DefaultItem fontSize={fontSize}>{item.text}</DefaultItem>}</Item>)
        }
      </List>
    </SelectBoxInput>
  )
}

SelectInput.propTypes = {
  items: PropTypes.array.isRequired,
  selected: PropTypes.object.isRequired,
  expanded: PropTypes.bool,
  searchEnabled: PropTypes.bool,
  opened: PropTypes.bool,
  disabled: PropTypes.bool,
  handleBlur: PropTypes.func,
  handleChange: PropTypes.func,
  handleClick: PropTypes.func,
  handleFocus: PropTypes.func,
  templateHeader: PropTypes.func,
  templateItem: PropTypes.func,
  fontSize: PropTypes.string
}

export default SelectInput
