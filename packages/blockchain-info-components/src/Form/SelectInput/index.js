import React from 'react'
import PropTypes from 'prop-types'
import { equals, isNil, contains, toUpper, filter, prop } from 'ramda'

import SelectInput from './template.js'

class SelectInputContainer extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      expanded: this.props.opened,
      search: '',
      value: this.props.value
    }
    this.handleBlur = this.handleBlur.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleClick = this.handleClick.bind(this)
    this.handleFocus = this.handleFocus.bind(this)
  }

  componentWillReceiveProps (nextProps) {
    if (!equals(this.props.value, nextProps.value)) {
      this.setState({ value: nextProps.value })
    }
  }

  handleClick (value) {
    if (this.props.onChange) { this.props.onChange(value) }
    this.setState({ value: value, opened: false })
  }

  handleChange (event) {
    this.setState({ search: event.target.value })
  }

  handleBlur () {
    if (this.props.onBlur) { this.props.onBlur() }
    if (this.props.onChange) { this.props.onChange(this.state.value) }
    this.setState({ expanded: false })
  }

  handleFocus () {
    if (this.props.onFocus) { this.props.onFocus() }
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

  getText (items) {
    const { value } = this.state
    if (isNil(value)) return this.props.label
    const selectedItems = filter(x => equals(x.value, value), items)
    return selectedItems.length === 1 ? prop('text', selectedItems[0]) : this.props.label
  }

  render () {
    const { elements, searchEnabled, ...rest } = this.props
    const items = this.transform(elements, this.state.search)
    const display = this.getText(items)

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
      text: PropTypes.oneOfType([PropTypes.string.isRequired, PropTypes.object.isRequired]).isRequired,
      value: PropTypes.oneOfType([PropTypes.string.isRequired, PropTypes.number.isRequired, PropTypes.object.isRequired])
    })).isRequired
  })).isRequired,
  label: PropTypes.string,
  searchEnabled: PropTypes.bool,
  opened: PropTypes.bool,
  value: PropTypes.oneOfType([PropTypes.string.isRequired, PropTypes.number.isRequired, PropTypes.object.isRequired]),
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func
}

SelectInputContainer.defaultProps = {
  label: 'Select a value',
  searchEnabled: true,
  opened: false
}

export default SelectInputContainer
