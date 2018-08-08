import React from 'react'
import PropTypes from 'prop-types'
import { equals, prop } from 'ramda'

import SelectInput from './template.js'

class SelectInputContainer extends React.PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      value: this.props.value
    }

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

  render () {
    const {
      elements,
      label,
      searchEnabled,
      disabled,
      grouped,
      ...rest
    } = this.props
    const items = elements[0].items

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
