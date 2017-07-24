import React from 'react'
import PropTypes from 'prop-types'
import { equals, contains, toUpper, filter, prop } from 'ramda'

import SelectBox from './template.js'

class SelectBoxContainer extends React.Component {
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
    console.log('selectbox click', value)
    this.setState({ opened: false, value: value })
    this.props.input.onChange(value)
    this.props.input.onBlur(value)
    if (this.props.callback) { this.props.callback(value) }
  }

  handleChange (event) {
    this.setState({ search: event.target.value })
  }

  handleBlur () {
    // this.props.input.onBlur(this.state.value)
    this.setState({ expanded: false })
  }

  handleFocus () {
    // this.props.input.onFocus(this.state.value)
    this.setState({ expanded: true })
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
    console.log(this.props)
    console.log(elements, this.state.value)
    const items = this.transform(elements, this.state.search)
    const display = this.getText(this.props.input.value, items)

    return (
      <SelectBox
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

SelectBoxContainer.propTypes = {
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

SelectBoxContainer.defaultProps = {
  label: 'Select a value',
  searchEnabled: true,
  opened: false
}

export default SelectBoxContainer
