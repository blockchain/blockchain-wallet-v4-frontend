import React from 'react'
import PropTypes from 'prop-types'
import { equals, contains, toUpper, filter, prop } from 'ramda'

import SelectInput from './template.js'

class SelectInputContainer extends React.Component {
  constructor (props) {
    super(props)
    const { input, opened } = props
    const { value } = input

    this.state = { value: value, expanded: opened, search: '' }
    this.handleBlur = this.handleBlur.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleClick = this.handleClick.bind(this)
    this.handleFocus = this.handleFocus.bind(this)
  }

  handleClick (value) {
    const { input } = this.props
    const { onChange } = input
    if (!equals(this.state.value, value)) {
      this.setState({ value })
      onChange(value)
    }
    this.setState({ opened: false })
  }

  handleChange (event) {
    this.setState({ search: event.target.value })
  }

  handleBlur () {
    const { input } = this.props
    const { onBlur, onChange } = input
    this.setState({ expanded: false })
    onBlur()
    onChange(this.state.value)
  }

  handleFocus () {
    const { input } = this.props
    const { onFocus } = input
    this.setState({ expanded: true })
    onFocus()
  }

  transform (elements, search) {
    let items = []
    elements.map(element => {
      if (!search && element.group !== '') {
        items.push({ text: element.group })
      }
      element.items.map(item => {
        if (!search || (search && contains(toUpper(search), toUpper(item.text)))) {
          items.push({ text: item.text, value: item.value })
        }
      })
    })
    return items
  }

  getText (value, items) {
    const selectedItems = filter(x => equals(x.value, value), items)
    return selectedItems.length === 1 ? prop('text', selectedItems[0]) : this.props.label
  }

  render () {
    const { elements, searchEnabled, ...rest } = this.props
    const items = this.transform(elements, this.state.search)
    const display = this.getText(this.props.input.value, items)

    return (
      <SelectInput
        items={items}
        display={display}
        expanded={this.state.expanded}
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

SelectInputContainer.propTypes = {
  elements: PropTypes.arrayOf(PropTypes.shape({
    group: PropTypes.string.isRequired,
    items: PropTypes.arrayOf(PropTypes.shape({
      text: PropTypes.string.isRequired,
      value: PropTypes.oneOfType([PropTypes.string.isRequired, PropTypes.number.isRequired, PropTypes.object.isRequired])
    })).isRequired
  })).isRequired,
  input: PropTypes.shape({
    onBlur: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    onFocus: PropTypes.func.isRequired,
    value: PropTypes.oneOfType([PropTypes.string.isRequired, PropTypes.number.isRequired, PropTypes.object.isRequired])
  }).isRequired,
  label: PropTypes.string,
  searchEnabled: PropTypes.bool,
  opened: PropTypes.bool,
  callback: PropTypes.func
}

SelectInputContainer.defaultProps = {
  label: 'Select a value',
  searchEnabled: true,
  opened: false
}

export default SelectInputContainer
