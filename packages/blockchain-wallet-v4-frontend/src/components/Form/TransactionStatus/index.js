import React from 'react'
import PropTypes from 'prop-types'
import TransactionStatus from './template.js'

class TransactionStatusContainer extends React.Component {
  constructor (props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick (value) {
    this.props.input.onChange(value)
  }

  render () {
    return <TransactionStatus value={this.props.input.value} handleClick={this.handleClick} />
  }
}

TransactionStatusContainer.propTypes = {
  input: PropTypes.object.isRequired
}

export default TransactionStatusContainer
