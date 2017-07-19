import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { Icon } from 'components/generic/Icon'

const SelectBoxContainer = styled.div`
  position: relative;
  width: 100%;
  height: auto;
`
const SelectBoxInput = styled.div`
  position: relative;
  display: block;
  width: 100%;
`
const Button = styled.button.attrs({
  type: 'button'
})`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  white-space: nowrap;
  user-select: none;
  padding: 0.5rem 1rem;
  transition: all 0.2s ease-in-out;
  background: white;
  font-family: 'Montserrat', 'Helvetica', sans-serif !important;
  font-size: 0.9rem;
  font-weight: 300;
  cursor: pointer;
  border: 1px solid ${props => props.errorState === 'initial' ? '#CCCCCC' : props.errorState === 'invalid' ? '#990000' : '#006600'};

  &:focus {
    outline: none;
  }
`
const Search = styled.input.attrs({
  type: 'text'
})`
  border: 1px solid #CCCCCC;
  font-size: 0.9rem;
  font-weight: normal;
  box-shadow: none;
  width: 100%;
  height: 40px;

  &:focus {
    border-radius: none;
    border: 1px solid #CCCCCC;
    outline: none;
  }
`
const List = styled.div`
  position: absolute;
  display: ${props => props.expanded ? 'flex' : 'none'};
  flex-direction: column;
  justify-content: flex-start;
  align-items: left;
  order: 1;
  width: 100%;
  height: auto;
  max-height: 140px;
  overflow-y: scroll;
  overflow-x: hidden;
  background-color: #FFFFFF;
  border: 1px solid #CCCCCC;
  z-index: 100;
`
const ListItem = styled.a`
  width: 100%;
  padding: 0.5rem 1rem;
  font-weight: 300;
  color: #5F5F5F;
  cursor: pointer;

  &:hover {
    color: #5F5F5F;
    background-color: #F5F5F5;
  }
`
const Header = styled.a`
  width: 100%;
  padding: 0.5rem 1rem;
  color: #5F5F5F;
  background-color: #CCCCCC;
  cursor: not-allowed;

  &:hover { color: #5F5F5F; }
`
const SelectBoxError = styled.label`
  position: absolute;
  top: -18px;
  right: 0;
  display: block;
  height: 15px;
  font-size: 13px;
  font-weight: 300;
  color: #FF0000;
`
const Arrow = styled(Icon).attrs({
  name: 'icon-down_arrow'
})`
  position: absolute;
  top: 15px;
  right: 15px;
  font-size: 0.6rem;
`

const SelectBox = (props) => {
  const { items, display, expanded, searchEnabled, handleBlur, handleChange, handleClick, handleFocus, meta } = props
  const { touched, invalid, error } = meta
  const errorState = !touched ? 'initial' : (invalid ? 'invalid' : 'valid')

  return (
    <SelectBoxContainer>
      <SelectBoxInput onBlur={handleBlur} onFocus={handleFocus}>
        { !expanded || !searchEnabled
          ? (<Button errorState={errorState}>{display}</Button>)
          : (<Search autoFocus={expanded} onChange={handleChange} />)
        }
        <Arrow />
        <List expanded={expanded}>
          { items.map((item, index) => item.value == null
            ? (<Header key={index}>{item.text}</Header>)
            : (<ListItem key={index} onMouseDown={() => handleClick(item.value)}>{item.text}</ListItem>))
          }
        </List>
      </SelectBoxInput>
      {touched && error && <SelectBoxError>{error}</SelectBoxError>}
    </SelectBoxContainer>
  )
}

SelectBox.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
    text: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string.isRequired, PropTypes.number.isRequired])
  })).isRequired,
  display: PropTypes.string.isRequired,
  expanded: PropTypes.bool.isRequired,
  searchEnabled: PropTypes.bool.isRequired,
  handleBlur: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleClick: PropTypes.func.isRequired,
  handleFocus: PropTypes.func.isRequired
}

export default SelectBox
