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
  border: 1px solid ${props => props.theme.grayLighter};
  font-family: 'Montserrat', 'Helvetica', sans-serif !important;
  font-size: 0.9rem;
  font-weight: 300;
  color: ${props => props.theme.text};
  text-transform: capitalize;
  cursor: pointer;

  &:after {
    width: 0;
    height: 0;
    margin-left: 0.3em;
    vertical-align: middle;
    content: "";
    border-top: 0.3em solid;
    border-right: 0.3em solid transparent;
    border-left: 0.3em solid transparent;
  }
`
const DropdownHeader = styled.a`
  width: 100%;
  padding: 0.5rem 1rem;
  background-color: ${props => props.theme.grayLighter};
  font-weight: normal;
  cursor: not-allowed;
`
const DropdownSearch = styled.input.attrs({ type: 'text', autoFocus: true })`
  border: 1px solid ${props => props.theme.grayLighter};
  font-size: 0.9rem;
  font-weight: normal;
  box-shadow: none;

  &:focus {
    border-radius: none;
    border: 1px solid ${props => props.theme.grayLighter};
    outline: none;
  }
`
const DropdownItem = styled.a`
  width: 100%;
  padding: 0.5rem 1rem;
  font-weight: 300;
  cursor: pointer;

  &:hover {
    background-color: ${props => props.theme.grayLightest};
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
  margin-top: -1px;
  background-color: white;
  border: 1px solid ${props => props.theme.grayLighter};
  z-index: 100;
`
const Dropdown = (props) => (
  <DropdownWrapper className={props.className}>
    {!props.opened || !props.searchEnabled
      ? (<DropdownButton onClick={props.toggle}>{props.display}</DropdownButton>)
      : (<DropdownSearch onChange={props.change} />)}
    <DropdownList opened={props.opened}>
      {props.items.map((item, index) =>
        item.value == null
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
