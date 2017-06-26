import React from 'react'
import PropTypes from 'prop-types'
import FilterStatus from './template.js'

class FilterStatusContainer extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      selected: props.selected
    }
    this.click = this.click.bind(this)
  }

  click (value) {
    console.log(value)
    this.setState({selected: value})
  }

  render () {
    return (
      <FilterStatus items={this.props.items} selected={this.state.selected} click={this.click} />
    )
  }
}

FilterStatusContainer.propTypes = {

}

FilterStatusContainer.defaultProps = {
  selected: 1,
  items: [
    { text: 'all', value: 1 },
    { text: 'sent', value: 2 },
    { text: 'received', value: 3 },
    { text: 'transferred', value: 4 }
  ],
  callback: function (value) { console.log(value) }
}

export default FilterStatusContainer
