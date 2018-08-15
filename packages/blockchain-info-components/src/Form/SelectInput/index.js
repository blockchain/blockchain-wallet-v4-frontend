import React from 'react'
import PropTypes from 'prop-types'
import { equals, prop, contains, toUpper } from 'ramda'

import SelectInput from './template.js'

class SelectInputContainer extends React.PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      value: this.props.value,
      search: ''
    }
    this.transform = this.transform.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  componentWillReceiveProps (nextProps) {
    if (!equals(this.props.value, nextProps.value)) {
      this.setState({ value: nextProps.value })
    }
  }

  handleChange (item) {
    const value = prop('value', item)

    this.setState({
      value
    })
    if (this.props.onChange) {
      this.props.onChange(value)
    }
  }
  transform (elements, search) {
    let items = []
    elements.map(element => {
      if (!search && element.group !== '') {
        items.push({ text: element.group })
      }
      element.items.map(item => {
        if (
          !search ||
          (search && contains(toUpper(search), toUpper(item.text)))
        ) {
          items.push({ text: item.text, value: item.value })
        }
      })
    })
    return items
  }

  render () {
    const {
      elements,
      label,
      searchEnabled,
      disabled,
      grouped,
      ...rest
    } = this.props
    const { search } = this.state
    const items = this.transform(elements, search)

    return (
      <SelectInput
        items={items}
        disabled={disabled}
        defaultItem={this.state.value}
        defaultDisplay={label}
        handleChange={this.handleChange}
        searchEnabled={this.props.searchEnabled}
        grouped={grouped}
        {...rest}
      />
    )
  }
}

SelectInputContainer.propTypes = {
  elements: PropTypes.arrayOf(
    PropTypes.shape({
      group: PropTypes.string.isRequired,
      items: PropTypes.array.isRequired
    })
  ).isRequired,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  searchEnabled: PropTypes.bool,
  opened: PropTypes.bool,
  disabled: PropTypes.bool,
  grouped: PropTypes.bool,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.object
  ]).isRequired,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
  templateDisplay: PropTypes.func,
  templateHeader: PropTypes.func,
  templateItem: PropTypes.func
}

SelectInputContainer.defaultProps = {
  label: 'Select a value',
  searchEnabled: true,
  opened: false,
  grouped: false,
  disabled: false
}

export default SelectInputContainer
