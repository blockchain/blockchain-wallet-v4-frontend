import React from 'react'
import styled from 'styled-components'
import { transparentize } from 'polished'
import { TextGroup } from '../Text'

const TooltipWrapper = styled.div`
  width: ${props => props.width === 'auto' ? 'auto' : '22px'};
  display: inline-flex;
  position: relative;
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
const TooltipLabel = styled.div`
  
`
const TooltipBox = styled(TextGroup)`
  position: absolute;
  bottom: 150%;
  left: -115px;
  text-align: initial;
  width: ${props => props.width === 'auto' || '250px'};
  display: ${props => props.displayed ? 'block' : 'none'};
  background-color: ${props => props.theme['white-blue']};
  color: ${props => props.theme['gray-5']};
  border: 1px solid ${props => props.theme['gray-2']};
  border-radius: 5px;
  padding: 10px 10px;
  box-sizing: border-box;
  box-shadow: ${props => transparentize(0.65, props.theme['gray-6'])} 0px 3px 8px 0px;
  cursor: pointer;
  font-size: 11px;
  font-weight: 300;
  font-family: "Montserrat", sans serif;
  text-align: left;

  > div,
  > span {
    margin-bottom: 0px;
  }

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

class Tooltip extends React.PureComponent {
  constructor (props) {
    super(props)
    this.state = { displayed: false }
    this.handleClick = this.handleClick.bind(this)
    this.handleMouseEnter = this.handleMouseEnter.bind(this)
    this.handleMouseLeave = this.handleMouseLeave.bind(this)
  }

  handleClick () {
    this.setState({ displayed: !this.state.displayed })
  }

  handleMouseEnter () {
    this.props.hover && this.setState({ displayed: true })
  }

  handleMouseLeave () {
    this.props.hover && this.setState({ displayed: false })
  }

  render () {
    const icon = this.state.displayed ? 'X' : '?'
    const colors = selectColors(this.state.displayed)

    return (
      <TooltipWrapper width={this.props.width}>
        {
          this.props.label
            ? <TooltipLabel onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave}>{this.props.label}</TooltipLabel>
            : <TooltipIcon displayed={this.state.displayed} colors={colors} onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave} onClick={this.handleClick}>{icon}</TooltipIcon>
        }
        <TooltipBox width={this.props.width} displayed={this.state.displayed} onClick={this.handleClick}>{this.props.children}</TooltipBox>
      </TooltipWrapper>
    )
  }
}

export default Tooltip
