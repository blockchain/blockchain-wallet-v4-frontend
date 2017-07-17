import React from 'react'
import PropTypes from 'prop-types'
import { contains, toUpper, filter, prop } from 'ramda'

import SelectBox from './template.js'

class SelectBoxContainer extends React.Component {
  constructor (props) {
    super(props)
    const { elements, input } = props
    const { value } = input

    const initialItems = this.transform(elements, undefined)
    const initialValue = value
    const initialText = this.getText(initialValue, initialItems)

    this.state = { display: initialText, items: initialItems, opened: false, search: '' }
    this.handleBlur = this.handleBlur.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleClick = this.handleClick.bind(this)
    this.handleFocus = this.handleFocus.bind(this)
  }

  handleClick (value) {
    this.props.input.onChange(value)
    this.setState({ opened: false, display: this.getText(value, this.state.items) })
  }

  handleChange (event) {
    this.setState({ items: this.transform(this.props.elements, event.target.value) })
  }

  handleBlur (event) {
    this.props.input.onBlur(event)
    this.setState({ opened: false, items: this.transform(this.props.elements, this.state.search) })
  }

  handleFocus (event) {
    this.props.input.onFocus(event)
    this.setState({ opened: true, items: this.transform(this.props.elements, this.state.search) })
  }

  transform (elements, value) {
    let items = []
    elements.map(element => {
      if (!value && element.group !== '') {
        items.push({ text: element.group })
      }
      element.items.map(item => {
        if (!value || (value && contains(toUpper(value), toUpper(item.text)))) {
          items.push({ text: item.text, value: item.value })
        }
      })
    })
    return items
  }

  getText (value, items) {
    const selectedItems = filter(x => x.value === value, items)
    return selectedItems.length === 1 ? prop('text', selectedItems[0]) : this.props.label
  }

  render () {
    const { searchEnabled, ...rest } = this.props

    return (
      <SelectBox
        items={this.state.items}
        display={this.state.display}
        opened={this.state.opened}
        handleBlur={this.handleBlur}
        handleChange={this.handleChange}
        handleClick={this.handleClick}
        handleFocus={this.handleFocus}
        searchEnabled={this.props.searchEnabled}
        {...rest}
      />
    )
  }
}

SelectBoxContainer.propTypes = {
  elements: PropTypes.arrayOf(PropTypes.shape({
    group: PropTypes.string.isRequired,
    items: PropTypes.arrayOf(PropTypes.shape({
      text: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired
    })).isRequired
  })).isRequired,
  input: PropTypes.shape({
    onBlur: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    onFocus: PropTypes.func.isRequired,
    value: PropTypes.string.isRequired
  }).isRequired,
  label: PropTypes.string,
  searchEnabled: PropTypes.bool
}

SelectBoxContainer.defaultProps = {
  label: 'Select a value',
  searchEnabled: true
}

export default SelectBoxContainer
