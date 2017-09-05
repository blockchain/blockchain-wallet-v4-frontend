import React from 'react'
import PropTypes from 'prop-types'
import Search from './template.js'

class SearchContainer extends React.Component {
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
      <Search value={this.props.input.value} handleChange={this.handleChange} />
    )
  }
}

SearchContainer.propTypes = {
  input: PropTypes.shape({
    onChange: PropTypes.func.isRequired,
    value: PropTypes.string.isRequired
  })
}

export default SearchContainer
