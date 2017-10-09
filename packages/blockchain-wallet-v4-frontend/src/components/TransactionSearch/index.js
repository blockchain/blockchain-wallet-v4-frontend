import React from 'react'
import PropTypes from 'prop-types'
import TransactionSearch from './template.js'

class TransactionSearchContainer extends React.Component {
  constructor (props) {
    super(props)
    this.timeout = undefined
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange (value) {
    clearTimeout(this.timeout)
    this.timeout = setTimeout(this.props.input.onChange(value), 1000)
  }

  render () {
    return (
      <TransactionSearch value={this.props.input.value} handleChange={this.handleChange} />
    )
  }
}

TransactionSearchContainer.propTypes = {
  input: PropTypes.shape({
    onChange: PropTypes.func.isRequired,
    value: PropTypes.string.isRequired
  })
}

export default TransactionSearchContainer
