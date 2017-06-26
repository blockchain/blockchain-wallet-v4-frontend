import React from 'react'
import PropTypes from 'prop-types'
import { filter, prop, startsWith, compose, groupBy, mapObjIndexed, values, keys, zipWith, prepend, flatten } from 'ramda'

import Dropdown from './template.js'

class DropdownContainer extends React.Component {
  constructor (props) {
    super(props)

    this.change = this.change.bind(this)
    this.click = this.click.bind(this)
    this.toggle = this.toggle.bind(this)

    this.state = {
      items: this.transformItems(this.props.items),
      opened: false,
      display: this.getText(props.selected),
      search: ''
    }
  }

  getText (value) {
    let selectedItems = filter(x => x.value === value, this.props.items)
    return selectedItems.length === 1 ? prop('text', selectedItems[0]) : '-'
  }

  filterItems (value) {
    return filter(x => startsWith(value, x.text), this.props.items)
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

  toggle () {
    this.setState({ opened: !this.state.opened, items: this.transformItems(this.props.items) })
  }

  click (value) {
    // Execute callback
    if (this.props.callback) this.props.callback(value)
    // Close dropdown and display new value
    this.setState({ opened: false, display: this.getText(value) })
  }

  change (event) {
    // We filter the items
    this.setState({ items: this.transformItems(this.filterItems(event.target.value)) })
  }

  render () {
    return (
      <Dropdown
        items={this.state.items}
        display={this.state.display}
        opened={this.state.opened}
        searchEnabled={this.props.searchEnabled}
        change={this.change}
        click={this.click}
        toggle={this.toggle}
        className={this.props.className}
      />
    )
  }
}

DropdownContainer.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
    text: PropTypes.string.isRequired,
    value: PropTypes.string,
    group: PropTypes.string
  })),
  callback: PropTypes.func.isRequired,
  searchEnabled: PropTypes.bool,
  selected: PropTypes.string,
  className: PropTypes.string
}

// DropdownContainer.defaultProps = {
//   searchEnabled: true,
//   selected: '',
//   className: ''
// }

DropdownContainer.defaultProps = {
  selected: '',
  items: [
    { text: 'text1', value: 'value1' },
    { text: 'text2', value: 'value2' },
    { text: 'text3', value: 'value3', group: 'group1' },
    { text: 'text4', value: 'value4', group: 'group1' },
    { text: 'text5', value: 'value5', group: 'group2' },
    { text: 'text6', value: 'value6', group: 'group2' }
  ],
  callback: value => {
    console.log(`callback ${value} !`)
  },
  searchEnabled: true,
  className: ''
}

export default DropdownContainer
