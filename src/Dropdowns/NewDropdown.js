import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { Text } from '../Text'


const NewDropdownWrapper = styled.div`
  text-transform: uppercase;
`
const NewDropdownButton = styled.div`
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
  position: absolute;
  bottom: 0px;
`

const DropdownItem = styled.div`
  cursor: pointer;
`

class NewDropdown extends React.Component {
  constructor (props) {
    super(props)
    this.items = props.items
    this.state = {open: props.open,
                  display: this.items.filter(item => item.value === props.display)[0]
                 }
    this.handleClick = this.handleClick.bind(this)
    this.handleCallback = this.handleCallback.bind(this)
    this.color = props.color
  }

  handleClick () {
    this.setState({ open: !this.state.open, display: this.state.display })
  }

  handleCallback (item) {
    if(this.props.callback) {
      this.props.callback(item)
      this.setState({ open: this.state.open, display: item})
    }
  }

  render () {
    return(
      <NewDropdownWrapper>
        <DropdownList open={this.state.open}>
          { this.items.map((item, index) => {
            return (<li  key={index} onClick={this.handleCallback.bind(this, item)}>
                      <DropdownItem>
                        {item.text}
                      </DropdownItem>
                    </li>)
          })}
        </DropdownList>
        <NewDropdownButton color={this.color} onClick={this.handleClick}>
          {this.state.display.text}
        </NewDropdownButton>
      </NewDropdownWrapper>
    )
  }
}

NewDropdown.defaultProps = {
  color: 'cyan',
  open: false,
  display: 0
}

NewDropdown.PropTypes = {
  display: PropTypes.number,
  items: PropTypes.arrayOf(PropTypes.shape({
    text: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired
  })),
  callback: PropTypes.func.isRequired,
  open: PropTypes.bool,
  color: PropTypes.oneOf(['cyan', 'white'])
}

export default NewDropdown
