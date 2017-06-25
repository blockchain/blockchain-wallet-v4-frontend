import React from 'react'
import PropTypes from 'prop-types'
import { filter, prop, startsWith, sortBy, compose } from 'ramda'

import Dropdown from './template.js'

class DropdownContainer extends React.Component {
  constructor (props) {
    super(props)

    this.change = this.change.bind(this)
    this.click = this.click.bind(this)
    this.toggle = this.toggle.bind(this)

    this.state = {
      items: this.props.items,
      opened: false,
      display: this.getText(props.selected),
      search: ''
    }
  }

  getText (value) {
    return prop('text', filter(x => x.value === value, this.props.items)[0])
  }

  filterItems (value) {
    return filter(x => startsWith(value, x.text), this.props.items)
  }

  transformItems (items) {

  }

  sortItems (items) {
    return sortBy(compose(prop('group'), prop('text')), items)
  }

  toggle () {
    this.setState({ opened: !this.state.opened, items: this.props.items })
  }

  click (value) {
    // Execute callback
    if (this.props.callback) this.props.callback(value)
    // Close dropdown and display new value
    this.setState({ opened: false, display: this.getText(value) })
  }

  change (event) {
    // We filter the items
    this.setState({ items: this.filterItems(event.target.value) })
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

DropdownContainer.defaultProps = {
  selected: 'value2',
  items: [
    { text: 'text1', value: 'value1' },
    { text: 'text2', value: 'value2' },
    { text: 'text3', value: 'value3', group: 'group1' },
    { text: 'text4', value: 'value4', group: 'group1' },
    { text: 'text5', value: 'value5', group: 'group2' },
    { text: 'text6', value: 'value6', group: 'group2' }
  ],
  callback: function (value) {
    console.log(`callback ${value} !`)
  },
  searchEnabled: true,
  className: ''
}

export default DropdownContainer
