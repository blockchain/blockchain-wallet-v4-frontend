import React from 'react'
import styled from 'styled-components'
import { transparentize } from 'polished'
import { TextGroup } from '../Text'

const TooltipWrapper = styled.div`
  display: inline-flex;
  position: relative;
  width: 22px;
  margin: 2px;
`
const TooltipIcon = styled.div`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 16px;
  height: 16px;
  border-radius: 10px;
  background-color: ${props => props.theme[props.colors.backgroundColor]};
  color: ${props => props.theme[props.colors.foreColor]};
  border: 1px solid ${props => props.theme[props.colors.borderColor]};
  cursor: pointer;
  font-size: 12px;
  font-weight: 300;
`
const TooltipBox = styled(TextGroup)`
  position: absolute;
  bottom: 150%;
  left: -115px;
  width: 250px;
  display: ${props => props.displayed ? 'block' : 'none'};
  background-color: ${props => props.theme['gray-1']};
  color: ${props => props.theme['gray-5']};
  border: 1px solid ${props => props.theme['gray-2']};
  border-radius: 5px;
  padding: 10px;
  box-sizing: border-box;
  box-shadow: ${props => transparentize(0.65, props.theme['gray-6'])} 0px 3px 8px 0px;
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
    border-top-color: ${props => props.theme['gray-2']};
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
    border-top-color: ${props => props.theme['gray-1']};
  }
`

const selectColors = displayed => displayed
  ? { foreColor: 'white', backgroundColor: 'brand-primary', borderColor: 'brand-primary' }
  : { foreColor: 'gray-5', backgroundColor: 'white', borderColor: 'gray-2' }

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
        <TooltipBox displayed={this.state.displayed} onClick={this.handleClick}>{this.props.children}</TooltipBox>
      </TooltipWrapper>
    )
  }
}

export default Tooltip
