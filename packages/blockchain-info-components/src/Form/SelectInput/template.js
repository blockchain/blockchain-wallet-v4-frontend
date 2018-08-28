import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Select, { components } from 'react-select'
import { equals, flatten, filter, head, assoc, path } from 'ramda'

const StyledSelect = styled(Select)`
  font-weight: 300;
  font-family: 'Montserrat', sans-serif;
  font-size: ${props => (props.fontSize === 'small' ? '12px' : '14px')};

  .control {
    box-shadow: none;
    border: 1px solid ${props => props.theme[props.borderColor]};
    &:hover {
      border: 1px solid ${props => props.theme[props.borderColor]};
    }
    &:active {
      border: 1px solid ${props => props.theme[props.borderColor]};
      box-shadow: none;
    }
    &:disabled {
      cursor: not-allowed;
      background-color: ${props => props.theme['gray-1']};
    }
  }
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
    <components.Control {...props} className='control' />
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

const selectBorderColor = state => {
  switch (state) {
    case 'initial':
      return 'gray-2'
    case 'invalid':
      return 'error'
    case 'valid':
      return 'success'
    default:
      return 'gray-2'
  }
}

const SelectInput = props => {
  const {
    items,
    className,
    disabled,
    defaultItem,
    defaultDisplay,
    searchEnabled,
    templateItem,
    templateDisplay,
    hideFocusedControl,
    hideIndicator,
    handleChange,
    onFocus,
    onBlur,
    errorState,
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
  const borderColor = selectBorderColor(errorState)

  return (
    <StyledSelect
      className={className}
      options={options}
      borderColor={borderColor}
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
      onFocus={onFocus}
      onBlur={onBlur}
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
  errorState: PropTypes.string,
  handleChange: PropTypes.func,
  handleClick: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  templateItem: PropTypes.func,
  fontSize: PropTypes.string
}

export default SelectInput
