import React from 'react'
import PropTypes from 'prop-types'
import TabMenuStatus from './template.js'

class TabMenuStatusContainer extends React.Component {
  constructor (props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick (value) {
    this.props.input.onChange(value)
  }

  render () {
    return <TabMenuStatus value={this.props.input.value} handleClick={this.handleClick} statuses={this.props.statuses} />
  }
}

TabMenuStatusContainer.propTypes = {
  input: PropTypes.object.isRequired,
  statuses: PropTypes.array.isRequired
}

export default TabMenuStatusContainer
