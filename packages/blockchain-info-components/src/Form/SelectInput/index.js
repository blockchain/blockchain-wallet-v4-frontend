import React from 'react'
import PropTypes from 'prop-types'
import onClickOutside from 'react-onclickoutside'
import { equals, head, isEmpty, isNil, contains, toUpper, filter } from 'ramda'

import SelectInput from './template.js'

class SelectInputContainer extends React.PureComponent {
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

  handleClick (item) {
    this.setState({ value: item.value, expanded: false })
    if (this.props.onChange) { this.props.onChange(item.value) }
  }

  handleChange (event) {
    this.setState({ search: event.target.value })
  }

  handleBlur () {
    this.setState({ expanded: false })
    if (this.props.onBlur) { this.props.onBlur() }
    if (this.props.onChange) { this.props.onChange(this.state.value) }
  }

  handleFocus () {
    this.setState({ expanded: true })
    if (this.props.onFocus) { this.props.onFocus() }
  }

  handleClickOutside () {
    this.setState({ expanded: false })
  }

  transform (elements, search) {
    let items = []
    elements.map(element => {
      if (!search && element.group !== '') { items.push({ text: element.group }) }
      element.items.map(item => {
        if (!search || (search && contains(toUpper(search), toUpper(item.text)))) {
          items.push({ text: item.text, value: item.value })
        }
      })
    })
    return items
  }

  getSelected (items, value) {
    if (isNil(value) || isEmpty(value)) return undefined
    return head(filter(x => equals(x.value, value), items))
  }

  render () {
    const { search, value, expanded } = this.state
    const { elements, label, searchEnabled, disabled, ...rest } = this.props
    const items = this.transform(elements, search)
    const selected = this.getSelected(items, value)

    return (
      <SelectInput
        items={items}
        selected={selected}
        defaultDisplay={label}
        expanded={expanded}
        disabled={disabled}
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
  disabled: PropTypes.bool,
  value: PropTypes.oneOfType([PropTypes.string.isRequired, PropTypes.number.isRequired, PropTypes.object.isRequired]),
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
  disabled: false
}

export default onClickOutside(SelectInputContainer)
