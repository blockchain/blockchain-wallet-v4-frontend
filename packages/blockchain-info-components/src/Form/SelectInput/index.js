import React from 'react'
import PropTypes from 'prop-types'
import { contains, equals, prop, toUpper } from 'ramda'

import SelectInput from './template.js'

class SelectInputContainer extends React.PureComponent {
  state = {
    value: this.props.value,
    search: ''
  }

  /* eslint-disable react/no-did-update-set-state */
  componentDidUpdate(prevProps, prevState) {
    if (!equals(this.props.value, prevProps.value)) {
      this.setState({
        value: this.props.value
      })
    }
  }
  /* eslint-enable react/no-did-update-set-state */

  handleChange = item => {
    const value = prop('value', item)

    this.setState({ value })
    if (this.props.onChange) this.props.onChange(value)
  }

  transform = (elements, search) => {
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

  onBlur = () => this.props.onBlur()

  render() {
    const { disabled, elements, grouped, label, ...rest } = this.props
    const { search } = this.state
    const items = grouped ? elements : this.transform(elements, search)

    return (
      <SelectInput
        items={items}
        disabled={disabled}
        defaultDisplay={label}
        defaultItem={this.state.value}
        handleChange={this.handleChange}
        searchEnabled={this.props.searchEnabled}
        grouped={grouped}
        {...rest}
        onBlur={this.onBlur}
      />
    )
  }
}

SelectInputContainer.propTypes = {
  elements: PropTypes.arrayOf(
    PropTypes.shape({
      group: PropTypes.string,
      items: PropTypes.array
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
  onFocus: PropTypes.func,
  onBlur: PropTypes.func
}

SelectInputContainer.defaultProps = {
  label: 'Select a value',
  height: '48px',
  searchEnabled: true,
  opened: false,
  grouped: false,
  disabled: false
}

export default SelectInputContainer
