import React from 'react'
import PropTypes from 'prop-types'
import { contains, equals, prop, toUpper } from 'ramda'

import SelectInput from './template.js'

class SelectInputContainer extends React.PureComponent {
  state = {
    search: '',
    value: this.props.value
  }

  /* eslint-disable react/no-did-update-set-state */
  componentDidUpdate(prevProps) {
    if (!equals(this.props.value, prevProps.value)) {
      this.setState({
        value: this.props.value
      })
    }
  }
  /* eslint-enable react/no-did-update-set-state */

  handleChange = (item) => {
    const value = Array.isArray(item) ? item : prop('value', item)

    if (Array.isArray(value)) {
      this.setState({ value: [...item] })
    } else {
      this.setState({ value })
    }

    if (this.props.onChange) this.props.onChange(value)
  }

  transform = (elements, search) => {
    const items = []
    // eslint-disable-next-line array-callback-return
    elements.map((element) => {
      if (!search && element.group !== '') {
        items.push({ text: element.group })
      }
      // eslint-disable-next-line array-callback-return
      element.items.map((item) => {
        if (!search || (search && contains(toUpper(search), toUpper(item.text)))) {
          items.push({ text: item.text, value: item.value })
        }
      })
    })
    return items
  }

  onBlur = () => this.props.onBlur()

  render() {
    const { disabled, elements, grouped, isMulti, label, ...rest } = this.props
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
        isMulti={isMulti}
      />
    )
  }
}

SelectInputContainer.propTypes = {
  disabled: PropTypes.bool,
  elements: PropTypes.arrayOf(
    PropTypes.shape({
      group: PropTypes.string,
      // eslint-disable-next-line react/forbid-prop-types
      items: PropTypes.array
    })
  ).isRequired,
  grouped: PropTypes.bool,
  height: PropTypes.string,
  isMulti: PropTypes.bool,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  opened: PropTypes.bool,
  searchEnabled: PropTypes.bool,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.object]).isRequired
}

SelectInputContainer.defaultProps = {
  disabled: false,
  grouped: false,
  height: '48px',
  isMulti: false,
  label: 'Select a value',
  opened: false,
  searchEnabled: true
}

export default SelectInputContainer
