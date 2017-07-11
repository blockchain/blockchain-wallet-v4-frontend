import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const DropdownWrapper = styled.div`
  position: relative;
  display: block;
  width: 100%;
  z-index: 1;
`
const DropdownButton = styled.button.attrs({ type: 'button' })`
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
  border: 1px solid #CCCCCC;
  font-family: 'Montserrat', 'Helvetica', sans-serif !important;
  font-size: 0.9rem;
  font-weight: 300;
  text-transform: capitalize;
  cursor: pointer;
`
const DropdownHeader = styled.a`
  width: 100%;
  padding: 0.5rem 1rem;
  color: #5F5F5F;
  background-color: #CCCCCC;
  cursor: not-allowed;

  &:hover { color: #5F5F5F; }
`
const DropdownSearch = styled.input.attrs({
  type: 'text',
  autoFocus: true
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
const DropdownItem = styled.a`
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
const DropdownList = styled.div`
  position: absolute;
  display: ${props => props.opened ? 'flex' : 'none'};
  flex-direction: column;
  justify-content: flex-start;
  align-items: left;
  order: 1;
  width: 100%;
  height: auto;
  max-height: 200px;
  overflow-x: hidden;
  background-color: #FFFFFF;
  border: 1px solid #CCCCCC;
  z-index: 100;
`
const Dropdown = (props) => (
  <DropdownWrapper className={props.className}>
    {!props.opened || !props.searchEnabled
      ? (<DropdownButton onClick={props.toggle}>{props.display}</DropdownButton>)
      : (<DropdownSearch onChange={props.change} />)}
    <DropdownList opened={props.opened}>
      {props.items.map((item, index) => item.value == null
          ? (<DropdownHeader key={index}>{item.text}</DropdownHeader>)
          : (<DropdownItem key={index} onClick={() => props.click(item.value)}>{item.text}</DropdownItem>))}
    </DropdownList>
  </DropdownWrapper>
)

Dropdown.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
    text: PropTypes.string.isRequired,
    value: PropTypes.string,
    group: PropTypes.string
  })),
  display: PropTypes.string.isRequired,
  opened: PropTypes.bool.isRequired,
  searchEnabled: PropTypes.bool.isRequired,
  change: PropTypes.func.isRequired,
  click: PropTypes.func.isRequired,
  toggle: PropTypes.func.isRequired,
  className: PropTypes.string
}

export default Dropdown
