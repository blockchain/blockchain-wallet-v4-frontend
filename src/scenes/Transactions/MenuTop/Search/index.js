import React from 'react'
import PropTypes from 'prop-types'
import Search from './template.js'

class SearchContainer extends React.Component {
  constructor (props) {
    super(props)
    this.change = this.change.bind(this)
    this.state = {search: this.props.selected}
    this.timeout = undefined
  }

  change (event) {
    let value = event.target.value
    // Display new value
    this.setState({search: value})
    // Execute callback
    clearTimeout(this.timeout)
    this.timeout = setTimeout(() => { this.props.callback(value) }, 1000)
  }

  render () {
    return (
      <Search search={this.state.search} change={this.change} />
    )
  }
}

SearchContainer.defaultProps = {
  callback: search => console.log(search)
}

SearchContainer.propTypes = {
  callback: PropTypes.func.isRequired
}

export default SearchContainer
