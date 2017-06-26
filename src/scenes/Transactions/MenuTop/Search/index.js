import React from 'react'
import PropTypes from 'prop-types'
import Search from './template.js'

class SearchContainer extends React.Component {
  constructor (props) {
    super(props)
    this.change = this.change.bind(this)
    this.state = {search: ''}
  }

  change (event) {
    let value = event.target.value
    // Execute callback
    if (this.props.callback) this.props.callback(value)
    // Display new value
    this.setState({search: value})
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
  // callback: PropTypes.function.isRequired
}

export default SearchContainer
