import React from 'react'
import PropTypes from 'prop-types'
import TabMenuBuySellStatus from './template.js'

class TabMenuBuySellStatusContainer extends React.Component {
  constructor (props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick (value) {
    this.props.input.onChange(value)
  }

  render () {
    return <TabMenuBuySellStatus value={this.props.input.value} handleClick={this.handleClick} />
  }
}

TabMenuBuySellStatusContainer.propTypes = {
  input: PropTypes.object.isRequired
}

export default TabMenuBuySellStatusContainer
