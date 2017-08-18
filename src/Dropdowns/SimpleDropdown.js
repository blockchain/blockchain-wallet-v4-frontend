import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { Icon } from '../Icons'

const SimpleDropdownWrapper = styled.div`
  text-transform: ${props => props.uppercase ? 'uppercase' : 'none'};
  position: relative;
`
const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  cursor: pointer;
  align-items: center;
  color: ${props => props.color === 'cyan' ? '#10ADE4' : 'white'};
  background-color: ${props => props.color === 'cyan' ? '#e3eff5' : '#004a7c'};
  width: min-content;
`
const SimpleDropdownButton = styled.div`
  display: inline-block;
`

const DropdownIcon = styled(Icon)`
  padding-left: 2px;
  font-size: 8px;
`

const DropdownList = styled.ul`
  background-clip: padding-box;
  background-color: white;
  border: 1px solid rgba(0, 0, 0, 0.15);
  border-radius: 4px;
  bottom: 0px;
  #box-sizing: border-box;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.175);
  display: ${props => props.opened ? 'block' : 'none'};
  float: none;
  height: auto;
  line-height: 20px;
  list-style-image: none;
  list-style-position: outside;
  list-style-type: none;
  margin: 2px 0px;
  max-height: 450px;
  min-width: 20px;
  overflow: scroll;
  padding: 5px 0px;
  position: absolute;
  ${props => props.down ? 'top: 25px; bottom: auto;'
                        : 'top: auto; bottom: 25px;'}
  z-index: 1000;
  -webkit-box-direction: normal;
  -webkit-margin-after: 2px;
  -webkit-margin-start: 0px;
  -webkit-padding-start: 0px;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
`

const DropdownItem = styled.div`
  color: rgb(51, 51, 51);
  cursor: pointer;
  padding: 3px 20px;
  font-family: 'Montserrat', Helvetica, sans-serif;
  font-size: 14px;
  font-weight: 300;
  text-align: left;
  text-size-adjust: 100%;
  white-space: nowrap;
`

class SimpleDropdown extends React.Component {
  constructor (props) {
    super(props)
    this.items = props.items
    this.state = {
      opened: props.opened,
      display: this.items.filter(item => item.value === props.selectedValue)[0]
    }
    this.handleClick = this.handleClick.bind(this)
    this.handleCallback = this.handleCallback.bind(this)
    this.color = props.color
    this.uppercase = props.uppercase
    this.down = props.down
  }

  handleClick () {
    this.setState({ opened: !this.state.opened, display: this.state.display })
  }

  handleCallback (item) {
    if (this.props.callback) { this.props.callback(item) }
    this.setState({ opened: false, display: item })
  }

  render () {
    return (
      <SimpleDropdownWrapper uppercase={this.uppercase}>
        <DropdownList opened={this.state.opened} down={this.down}>
          { this.items.map((item, index) => {
            return (
              <li key={index} onClick={this.handleCallback.bind(this, item)}>
                <DropdownItem>{item.text}</DropdownItem>
              </li>
            )
          })}
        </DropdownList>
        <ButtonContainer color={this.color} onClick={this.handleClick}>
          <SimpleDropdownButton>
            {this.state.display.text}
          </SimpleDropdownButton>
          <DropdownIcon name='down_arrow' />
        </ButtonContainer>
      </SimpleDropdownWrapper>
    )
  }
}

SimpleDropdown.defaultProps = {
  color: 'cyan',
  opened: false,
  selectedValue: 0,
  uppercase: true,
  down: false
}

SimpleDropdown.PropTypes = {
  selectedValue: PropTypes.number,
  items: PropTypes.arrayOf(PropTypes.shape({
    text: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired
  })),
  callback: PropTypes.func.isRequired,
  opened: PropTypes.bool,
  color: PropTypes.oneOf(['cyan', 'white']),
  uppercase: PropTypes.bool,
  down: PropTypes.bool
}

export default SimpleDropdown
