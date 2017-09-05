import React from 'react'
import styled from 'styled-components'

import { TextGroup } from '../Text'

const TooltipWrapper = styled.div`
  display: block;
  position: relative;
  width: 22px;
`
const TooltipIcon = styled.div`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 20px;
  height: 20px;
  border-radius: 10px;
  background-color: ${props => props.theme[props.backgroundColor]};
  color: ${props => props.theme[props.color]};
  border: 1px solid ${props => props.theme[props.borderColor]};
  cursor: pointer;
  font-weight: 300;
`
const TooltipBox = styled(TextGroup)`
  position: absolute;
  bottom: 150%;
  left: -115px;
  width: 250px;
  display: ${props => props.displayed ? 'block' : 'none'};
  background-color: ${props => props.theme['grey']};
  color: ${props => props.theme['text']};
  border: 1px solid ${props => props.theme['bordergrey']};
  border-radius: 5px;
  padding: 10px;
  box-sizing: border-box;
  cursor: pointer;
  font-size: 13px;
  font-weight: 300;
  font-family: "GillSans", sans serif;

  &:before {
    content: '';
    display: block;
    position: absolute;
    left: 115px;
    top: 100%;
    width: 0;
    height: 0;
    border: 10px solid transparent;
    border-top-color: ${props => props.theme['bordergrey']};
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
    border-top-color: ${props => props.theme['grey']};
  }
`

const selectColors = displayed => displayed
  ? { color: 'white', backgroundColor: 'blue', borderColor: 'strongblue' }
  : { color: 'text', backgroundColor: 'white', borderColor: 'bordergrey' }

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
    const icon = this.state.displayed ? 'X' : '?'
    const colors = selectColors(this.state.displayed)

    return (
      <TooltipWrapper>
        <TooltipIcon displayed={this.state.displayed} colors={colors} onClick={this.handleClick}>{icon}</TooltipIcon>
        <TooltipBox displayed={this.state.displayed} colors={colors} onClick={this.handleClick}>{this.props.children}</TooltipBox>
      </TooltipWrapper>
    )
  }
}

export default Tooltip
