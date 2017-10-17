import React from 'react'
import styled from 'styled-components'

import { Text, TextGroup } from '../Text'
import { Icon } from '../Icons'

const MenuTooltipWrapper = styled.div`
  display: inline-flex;
  position: relative;
  width: 22px;
`
const MenuTooltipIcon = styled(Icon)`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 20px;
  height: 20px;
  border-radius: 10px;
  background-color: ${props => props.theme['brand-primary']};
  color: ${props => props.theme['white']};
  border: 1px solid ${props => props.theme['brand-primary']};
  cursor: pointer;
  font-weight: 300;
`
const MenuTooltipBox = styled(TextGroup)`
  position: absolute;
  top: 150%;
  left: -115px;
  width: 250px;
  display: ${props => props.displayed ? 'block' : 'none'};
  color: ${props => props.theme['gray-5']};
  border: 1px solid ${props => props.theme['gray-2']};
  border-radius: 5px;
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
    bottom: 100%;
    width: 0;
    height: 0;
    border: 10px solid transparent;
    border-bottom-color: ${props => props.theme['gray-2']};
  }

  &:after {
    content: '';
    display: block;
    position: absolute;
    left: 116px;
    bottom: 100%;
    width: 0;
    height: 0;
    border: 9px solid transparent;
    border-bottom-color: ${props => props.theme['gray-1']};
  }
`

const MenuTooltipTitle = styled(Text)`
    background-color: ${props => props.theme['gray-1']};
    padding: 8px 14px;
`

class MenuTooltip extends React.Component {
  constructor (props) {
    super(props)
    this.state = { displayed: false }
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick () {
    this.setState({ displayed: !this.state.displayed })
  }

  render () {
    const { icon, title, children } = this.props
    return (
      <MenuTooltipWrapper>
        <MenuTooltipIcon displayed={this.state.displayed} onClick={this.handleClick} name={icon} />
        <MenuTooltipBox displayed={this.state.displayed} onClick={this.handleClick}>
          <MenuTooltipTitle size='14px' weight={500}>
            {title}
          </MenuTooltipTitle>
          {children}
        </MenuTooltipBox>
      </MenuTooltipWrapper>
    )
  }
}

MenuTooltip.defaultProps = {
  icon: 'bell'
}

export default MenuTooltip
