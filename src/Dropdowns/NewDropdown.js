import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { Text } from '../Text'


const NewDropdownWrapper = styled.div`
  text-transform: uppercase;
`
const NewDropdownButton = styled(Text)`
  color: ${props => props.color === 'cyan' ? '#10ADE4' : 'white'};
  #background-color: ${props => props.color === 'cyan' ? '#e3eff5' : '#004a7c'};
  cursor: pointer;
  position: absolute;
`
const DropdownList = styled.ul`
  color: black;
  background-color: white;
  list-style: none;
  display: ${props => props.open ? 'block' : 'none'};
  border: 1px solid gray;
  border-radius: 3px;
  border-co
`

const DropdownItem = styled(Text)`
  cursor: pointer;
`

class NewDropdown extends React.Component {
  constructor (props) {
    super(props)
    this.state = {open: props.open}
    this.handleClick = this.handleClick.bind(this)
    this.items = props.items
    this.callback = props.callback
    this.id = props.id
    this.display = props.display
    this.color = props.color
  }

  handleClick () {
    this.setState({ open: !this.state.open })
  }

  render () {
    return(
      <NewDropdownWrapper>
        <NewDropdownButton color={this.color} id={this.id} onClick={this.handleClick}>{this.display}</NewDropdownButton>
        <DropdownList open={this.state.open}>
          { this.items.map(function (item, index) {
            return (<li><DropdownItem key={index} onClick={() => this.callback(item.value)}>{item.text}</DropdownItem></li>)
          })}
        </DropdownList>
      </NewDropdownWrapper>
    )
  }
}

NewDropdown.defaultProps = {
  color: 'cyan',
  dropdownOpen: false
}

NewDropdown.PropTypes = {
  id: PropTypes.string.isRequired,
  display: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(PropTypes.shape({
    text: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired
  })),
  callback: PropTypes.func.isRequired,
  dropdownOpen: PropTypes.bool,
  color: PropTypes.oneOf(['cyan', 'white'])
}

export default NewDropdown
