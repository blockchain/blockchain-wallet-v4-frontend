import React from 'react'
import PropTypes from 'prop-types'
import Status from './template.js'

class StatusContainer extends React.Component {
  constructor (props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
    this.types = [
      { text: 'All', value: '' },
      { text: 'Received', value: 'received' },
      { text: 'Sent', value: 'sent' },
      { text: 'Transferred', value: 'transferred' }
    ]
  }

  handleChange (value) {
    this.props.input.onChange(value)
  }

  render () {
    return (
      <Status items={this.types} value={this.props.input.value} handleChange={this.handleChange} />
    )
  }
}

StatusContainer.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
    text: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired
  })),
  input: PropTypes.shape({
    onChange: PropTypes.func.isRequired,
    value: PropTypes.string.isRequired
  })
}

export default StatusContainer
