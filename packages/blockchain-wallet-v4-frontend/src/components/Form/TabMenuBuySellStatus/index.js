import React from 'react'
import PropTypes from 'prop-types'
import TabMenuBuySellStatus from './template.js'

class TabMenuBuySellStatusContainer extends React.PureComponent {
  constructor (props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick (value) {
    this.props.input.onChange(value)
  }

  render () {
    return <TabMenuBuySellStatus partner={this.props.partner} value={this.props.input.value} handleClick={this.handleClick} />
  }
}

TabMenuBuySellStatusContainer.propTypes = {
  input: PropTypes.object.isRequired,
  partner: PropTypes.string.isRequired
}

export default TabMenuBuySellStatusContainer
