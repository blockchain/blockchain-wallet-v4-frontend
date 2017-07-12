import React from 'react'
import PropTypes from 'prop-types'
import { contains, toUpper, filter, prop, compose, groupBy, mapObjIndexed, values, keys, zipWith, prepend, flatten } from 'ramda'

import SelectBox from './template.js'

class SelectBoxContainer extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      items: this.transformItems(this.props.items),
      opened: false,
      display: this.getText(props.input.value),
      search: ''
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleClick = this.handleClick.bind(this)
    this.handleToggle = this.handleToggle.bind(this)
  }

  getText (value) {
    let selectedItems = filter(x => x.value === value, this.props.items)
    return selectedItems.length === 1 ? prop('text', selectedItems[0]) : '-'
  }

  filterItems (value) {
    return filter(x => contains(toUpper(value), toUpper(x.text)), this.props.items)
  }

  transformItems (items) {
    const group = groupBy(x => x.group ? x.group : '')
    const transform = (num, key) => ({group: key, items: num})
    const is = compose(mapObjIndexed(transform), group)(items)
    const elements = values(is)
    const groups = keys(is)
    const zipper = (group, items) => prepend({text: group}, items.items)
    return flatten(zipWith(zipper, groups, elements)).filter(x => x.text !== '')
  }

  handleToggle () {
    this.setState({ opened: !this.state.opened, items: this.transformItems(this.props.items) })
  }

  handleClick (value) {
    // Execute callback
    this.props.input.onChange(value)
    // Close dropdown and display new value
    this.setState({ opened: false, display: this.getText(value) })
  }

  handleChange (event) {
    // We filter the items
    this.setState({ items: this.transformItems(this.filterItems(event.target.value)) })
  }

  render () {
    console.log(this.props.input)
    return (
      <SelectBox
        items={this.state.items}
        display={this.state.display}
        opened={this.state.opened}
        searchEnabled={this.props.searchEnabled}
        handleChange={this.handleChange}
        handleClick={this.handleClick}
        handleToggle={this.handleToggle}
      />
    )
  }
}

SelectBoxContainer.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
    text: PropTypes.string.isRequired,
    value: PropTypes.string,
    group: PropTypes.string
  })),
  input: PropTypes.shape({
    onChange: PropTypes.func.isRequired,
    value: PropTypes.string.isRequired
  }),
  searchEnabled: PropTypes.bool
}

SelectBoxContainer.defaultProps = {
  searchEnabled: true
}

export default SelectBoxContainer
