import React from 'react'
import PropTypes from 'prop-types'
import TabMenuAddressesStatus from './template.js'

class TabMenuAddressesStatusContainer extends React.Component {
  constructor (props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick (value) {
    this.props.input.onChange(value)
  }

  render () {
    return <TabMenuAddressesStatus value={this.props.input.value} handleClick={this.handleClick} />
  }
}

TabMenuAddressesStatusContainer.propTypes = {
  input: PropTypes.object.isRequired
}

export default TabMenuAddressesStatusContainer
