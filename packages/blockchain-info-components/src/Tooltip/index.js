import React from 'react'
import onClickOutside from 'react-onclickoutside'
import Tooltip from './template.js'
import { Icon } from '../Icons'

class TooltipContainer extends React.PureComponent {
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

  handleClickOutside () {
    this.setState({ displayed: false })
  }

  render () {
    const icon = this.state.displayed ? <Icon name='close-in-circle' /> : <Icon name='question-in-circle' />

    return (
      <Tooltip
        icon={icon}
        width={this.props.width}
        label={this.props.label}
        displayed={this.state.displayed}
        handleClick={this.handleClick}
        handleMouseEnter={this.handleMouseEnter}
        handleMouseLeave={this.handleMouseLeave}>
        {this.props.children}
      </Tooltip>
    )
  }
}

export default onClickOutside(TooltipContainer)
