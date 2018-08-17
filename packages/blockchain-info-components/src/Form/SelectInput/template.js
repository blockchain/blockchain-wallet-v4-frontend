import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Select, { components } from 'react-select'
import { equals, flatten, filter, head, assoc, path } from 'ramda'

const StyledSelect = styled(Select)`
  font-weight: 300;
  font-family: 'Montserrat', sans-serif;
  font-size: ${props => (props.fontSize === 'small' ? '12px' : '14px')};
`

const customStyles = {
  control: styles => ({
    ...styles,
    backgroundColor: 'white',
    cursor: 'pointer',
    minHeight: '40px',
    borderRadius: 0
  })
}

const Option = props => {
  const itemProps = assoc('text', props.label, props)
  return (
    <components.Option {...props}>
      {props.selectProps.templateItem
        ? props.selectProps.templateItem(itemProps)
        : props.children}
    </components.Option>
  )
}

const ValueContainer = ({ children, ...props }) => {
  const displayProps = assoc(
    'text',
    path(['selectProps', 'value', 'label'], props),
    assoc('value', path(['selectProps', 'value', 'value'], props), props)
  )
  return (
    <components.ValueContainer {...props}>
      {props.selectProps.templateDisplay
        ? props.selectProps.templateDisplay(displayProps, children)
        : children}
    </components.ValueContainer>
  )
}

const Control = props => {
  return props.selectProps.hideFocusedControl &&
    props.selectProps.menuIsOpen ? null : (
    <components.Control {...props} />
  )
}

const DropdownIndicator = props => {
  return props.selectProps.hideIndicator ? null : (
    <components.DropdownIndicator {...props} />
  )
}

const IndicatorSeparator = props => {
  return props.selectProps.hideIndicator ? null : (
    <components.IndicatorSeparator {...props} />
  )
}

const SelectInput = props => {
  const {
    items,
    disabled,
    defaultItem,
    defaultDisplay,
    searchEnabled,
    templateItem,
    templateDisplay,
    hideFocusedControl,
    hideIndicator,
    handleChange,
    menuIsOpen,
    grouped
  } = props
  const options = grouped
    ? items
    : items.map(item => ({ value: item.value, label: item.text }))
  const groupedOptions = grouped && flatten(options.map(o => o.options))
  const defaultValue = grouped
    ? head(filter(x => equals(x.value, defaultItem), groupedOptions))
    : head(filter(x => equals(x.value, defaultItem), options))

  return (
    <StyledSelect
      options={options}
      styles={customStyles}
      templateItem={templateItem}
      templateDisplay={templateDisplay}
      components={{
        Option,
        ValueContainer,
        Control,
        DropdownIndicator,
        IndicatorSeparator
      }}
      hideFocusedControl={hideFocusedControl}
      hideIndicator={hideIndicator}
      placeholder={defaultDisplay}
      isSearchable={searchEnabled}
      onChange={handleChange}
      menuIsOpen={menuIsOpen}
      isDisabled={disabled}
      value={defaultValue}
    />
  )
}

SelectInput.propTypes = {
  items: PropTypes.array.isRequired,
  selected: PropTypes.object,
  expanded: PropTypes.bool,
  searchEnabled: PropTypes.bool,
  opened: PropTypes.bool,
  disabled: PropTypes.bool,
  handleBlur: PropTypes.func,
  handleChange: PropTypes.func,
  handleClick: PropTypes.func,
  handleFocus: PropTypes.func,
  templateItem: PropTypes.func,
  fontSize: PropTypes.string
}

export default SelectInput
