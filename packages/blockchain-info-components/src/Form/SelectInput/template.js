import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Select, { components } from 'react-select'
import { equals, filter, head, assoc, path } from 'ramda'

const StyledSelect = styled(Select)`
  font-family: 'Montserrat', sans-serif;
  font-weight: 300;
  font-size: ${props => (props.fontSize === 'small' ? '12px' : '14px')};
`

const colourStyles = {
  control: styles => ({
    ...styles,
    backgroundColor: 'white',
    cursor: 'pointer',
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

const SelectInput = props => {
  const {
    items,
    disabled,
    defaultItem,
    defaultDisplay,
    searchEnabled,
    handleChange,
    templateDisplay,
    templateItem
  } = props
  const options = items.map(item => ({ value: item.value, label: item.text }))
  const defaultValue = head(filter(x => equals(x.value, defaultItem), options))

  return (
    <StyledSelect
      components={{ Option, ValueContainer }}
      options={options}
      styles={colourStyles}
      isSearchable={searchEnabled}
      value={defaultValue}
      templateItem={templateItem}
      templateDisplay={templateDisplay}
      onChange={handleChange}
      placeholder={defaultDisplay}
      isDisabled={disabled}
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
