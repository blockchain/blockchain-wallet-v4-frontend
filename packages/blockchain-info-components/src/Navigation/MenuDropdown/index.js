import React, { PureComponent } from 'react'
import onClickOutside from 'react-onclickoutside'
import styled from 'styled-components'

import ButtonGroup from '../ButtonGroup'
import DropdownLink from './DropdownLink'
import DropdownTip from './DropdownTip'

const DropdownContainer = styled.div`
  flex-direction: column;
  padding: 0.75rem 1.5rem;
  background-color: #fff;
  position: absolute;
  left: 0;
  top: ${props => props.dropdownTop}px;
  transform: translateX(${props => props.x}px) translateY(${props => props.y}px);
  transition: all 0.3s ease-in-out;
  border-radius: var(--lgBorderRadius);
  z-index: 1000;
  box-shadow: 0 10px 60px -10px rgba(0, 0, 0, 0.25),
    0 8px 16px rgba(0, 0, 0, 0.1);
  min-width: 15rem;
`

const Dropdown = props => {
  if (props.kind in props.map) {
    let component = props.map[props.kind].component

    return (
      <DropdownContainer
        dropdownTop={props.dropdownTop}
        x={props.x || 0}
        y={props.y || 0}
      >
        {typeof component === 'object'
          ? component
          : React.createElement(component)}
      </DropdownContainer>
    )
  } else {
    return null
  }
}

class MenuDropdown extends PureComponent {
  constructor(props) {
    super(props)
    this.mouseX = 0
    this.mouseY = 0
    this.ref = React.createRef()
  }

  state = {
    dropDown: null,
    products: {
      left: 0,
      top: 0,
      height: 0
    },
    markets: {
      left: 0,
      top: 0,
      height: 0
    }
  }

  componentDidMount() {
    if (document) {
      document.addEventListener('mousemove', this.handleMouseMove)
    }
  }

  componentWillUnmount() {
    if (document) {
      document.removeEventListener('mousemove', this.handleMouseMove)
    }
  }

  handleMouseMove = e => {
    this.mouseX = e.clientX
    this.mouseY = e.clientY
  }

  handleMouseLeave = e => {
    if (window) {
      window.setTimeout(this.checkPointer, 500)
    }
  }

  checkPointer = () => {
    let elem = document && document.elementFromPoint(this.mouseX, this.mouseY)
    if (elem && this.ref && this.ref.current) {
      if (!this.ref.current.contains(elem)) {
        this.setState({ dropDown: null })
      }
    }
  }

  handleClickOutside = evt => {
    this.setState({ dropDown: null })
  }

  toggleDropdown(name, onlyOn) {
    return e => {
      let dropDownVal = null
      if (typeof name === 'string') {
        if (this.state.dropDown === name && !onlyOn) {
          dropDownVal = null
        } else {
          dropDownVal = name
        }
      } else {
        dropDownVal = null
      }
      if (dropDownVal && this.state.dropDown !== dropDownVal) {
        if (
          dropDownVal in this.props.map &&
          this.props.map[dropDownVal].onActive
        ) {
          this.props.map[dropDownVal].onActive()
        }
      }
      this.setState({ dropDown: dropDownVal })
    }
  }

  getLink(kind, name) {
    return (
      <li key={kind}>
        <DropdownLink
          callback={({ height, left, top }) => {
            this.setState({ [kind]: { left, top, height } })
          }}
          onClick={this.toggleDropdown(kind)}
          onMouseOver={this.toggleDropdown(kind, true)}
        >
          {name}
        </DropdownLink>
      </li>
    )
  }

  render() {
    let dropX = 0
    let dropY = 0
    let dropdownTip = null
    let dropdownTop = this.props.dropdownTop

    if (this.state.dropDown !== null) {
      let kind = this.state.dropDown
      dropX = this.state[kind].left
      dropY = this.state[kind].top + this.state[kind].height + 10
      dropdownTip = (
        <DropdownTip dropdownTop={dropdownTop} x={dropX + 24} y={dropY - 4} />
      )
    }

    return (
      <div ref={this.ref} onMouseLeave={this.handleMouseLeave}>
        <ButtonGroup>
          <ul>
            {Object.keys(this.props.map).map(name => {
              let vals = this.props.map[name]
              return this.getLink(name, vals.linkText)
            })}
          </ul>
        </ButtonGroup>
        {dropdownTip}
        <Dropdown
          x={dropX}
          y={dropY}
          dropdownTop={dropdownTop}
          kind={this.state.dropDown}
          map={this.props.map}
        />
      </div>
    )
  }
}

export default onClickOutside(MenuDropdown)
