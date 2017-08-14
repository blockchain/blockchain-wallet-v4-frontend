import React from 'react'
import styled from 'styled-components'

import { TextGroup } from 'components'

const TooltipWrapper = styled.div`
  position: relative;
`
const TooltipIcon = styled.div`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 20px;
  height: 20px;
  border-radius: 10px;
  background-color: ${props => props.displayed ? '#004A7C' : '#FFFFFF'};
  color: ${props => props.displayed ? '#FFFFFF' : 'E0E0E0'};
  border: 1px solid ${props => props.displayed ? '#004AC7' : '#E0E0E0'};
  cursor: pointer;
  font-weight: 300;
`
const TooltipBox = styled(TextGroup)`
  position: absolute;
  bottom: 150%;
  left: -115px;
  width: 250px;
  display: ${props => props.displayed ? 'block' : 'none'};
  background-color: #F5F7F9;
  color: #E0E0E0;
  border: 1px solid #E0E0E0;
  border-radius: 5px;
  padding: 5px;
  cursor: pointer;

  &:before {
    content: '';
    display: block;  
    position: absolute;
    left: 115px;
    top: 100%;
    width: 0;
    height: 0;
    border: 10px solid transparent;
    border-top-color: #E0E0E0;
  }

  &:after {
    content: '';
    display: block;  
    position: absolute;
    left: 116px;
    top: 100%;
    width: 0;
    height: 0;
    border: 9px solid transparent;
    border-top-color: #F5F7F9;
  }
`

class Tooltip extends React.Component {
  constructor (props) {
    super(props)
    this.state = { displayed: false }
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick () {
    this.setState({ displayed: !this.state.displayed })
  }

  render () {
    const icon = this.state.displayed ? 'x' : '?'
    return (
      <TooltipWrapper>
        <TooltipIcon displayed={this.state.displayed} onClick={this.handleClick}>{icon}</TooltipIcon>
        <TooltipBox displayed={this.state.displayed} onClick={this.handleClick}>{this.props.children}</TooltipBox>
      </TooltipWrapper>
    )
  }
}

export { Tooltip }
