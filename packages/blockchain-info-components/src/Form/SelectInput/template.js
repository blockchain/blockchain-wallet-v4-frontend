import { assoc, equals, filter, flatten, head, path } from 'ramda'
import PropTypes from 'prop-types'
import React from 'react'
import Select, { components } from 'react-select'
import styled from 'styled-components'

import {
  hasValue,
  isValid,
  selectBackgroundColor,
  selectBorderColor,
  selectFocusBorderColor
} from '../helper'

const StyledSelect = styled(Select)`
  font-weight: 500;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
    Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  font-size: ${props => (props.fontSize === 'small' ? '14px' : '16px')};

  .bc__menu {
    border-radius: 4px;
    box-shadow: initial;
    border: 1px solid ${props => props.theme.grey100};
    background-color: ${props => props.theme.white};
  }

  .bc__menu-list {
    border-radius: 4px;
    padding: 0;
  }

  .bc__group {
    padding-bottom: 0;
    > div:nth-child(2) {
      .bc__option {
        padding-top: 6px;
      }
    }
  }

  .bc__group-heading {
    font-weight: 500;
    margin-bottom: 0px;
    color: ${props => props.theme['gray-6']};
  }

  .bc__placeholder {
    color: ${props => props.theme.grey100};
  }

  .bc__control {
    box-shadow: none;
    color: ${props => props.theme['gray-6']};
    background-color: ${({ bgColor, hasValue, isValid, theme }) =>
      hasValue && isValid ? theme.white : theme[bgColor]};
    cursor: pointer;
    min-height: ${props => props.height};
    border-radius: 8px;
    border: ${({ borderColor, hasValue, isValid, theme }) =>
      hasValue && isValid
        ? `1px solid ${theme[borderColor]}`
        : '1px solid transparent'};

    & .bc__control--is-focused {
      background-color: ${({ theme }) => theme.white};
      border: 1px solid
        ${({ focusedBorderColor, theme }) => theme[focusedBorderColor]};
    }
    & .bc__control--menu-is-open {
      background-color: ${({ theme }) => theme.white};
      border: 1px solid
        ${({ focusedBorderColor, theme }) => theme[focusedBorderColor]};
    }
    &:disabled {
      cursor: not-allowed;
      background-color: ${props => props.theme['gray-1']};
    }
    .bc__value-container {
      overflow: hidden;
    }

    input {
      border: none !important;
    }
  }

  .bc__indicator-separator {
    display: none;
  }

  .bc__option {
    cursor: pointer;
    font-size: 14px;
    color: ${props => props.theme['gray-6']};
    background-color: ${props => props.theme.white};
    &.bc__option--is-focused {
      background-color: ${props => props.theme.white};
      color: ${props => props.theme.blue900};
    }
    &.bc__option--is-selected {
      color: ${props => props.theme.blue900};
      background-color: ${props => props.theme.white};
      &:hover {
        color: ${props => props.theme.blue900};
      }
      * {
        color: ${props => props.theme.blue900};
      }
    }
    &:hover {
      background-color: ${props => props.theme.white};
      * {
        color: ${props => props.theme.blue900};
      }
    }
    * {
      font-weight: 500;
      color: ${props => props.theme['gray-6']};
      transition: color 0.3s;
    }
    > div {
      font-size: 14px;
    }
  }

  .bc__single-value {
    color: ${props => props.theme['gray-6']};
  }
`

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

const Control = props => {
  return props.selectProps.hideFocusedControl &&
    props.selectProps.menuIsOpen ? null : (
    <components.Control {...props} />
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
    className,
    defaultDisplay,
    defaultItem,
    disabled,
    errorState,
    filterOption,
    getRef,
    grouped,
    handleChange,
    height,
    hideFocusedControl,
    hideIndicator,
    items,
    menuIsOpen,
    menuPlacement,
    onBlur,
    onFocus,
    onKeyDown,
    openMenuOnClick,
    openMenuOnFocus,
    searchEnabled,
    templateDisplay,
    templateItem
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
      bgColor={selectBackgroundColor(errorState)}
      borderColor={selectBorderColor(errorState)}
      className={className}
      classNamePrefix='bc'
      components={{
        Option,
        ValueContainer,
        Control,
        DropdownIndicator,
        IndicatorSeparator
      }}
      focusedBorderColor={selectFocusBorderColor(errorState)}
      filterOption={filterOption}
      hasValue={hasValue(defaultValue) && defaultValue}
      height={height}
      hideFocusedControl={hideFocusedControl}
      hideIndicator={hideIndicator}
      isDisabled={disabled}
      isSearchable={searchEnabled}
      isValid={isValid(errorState)}
      menuIsOpen={menuIsOpen}
      menuPlacement={menuPlacement}
      onBlur={onBlur}
      onChange={handleChange}
      onFocus={onFocus}
      onKeyDown={onKeyDown}
      openMenuOnClick={openMenuOnClick}
      openMenuOnFocus={openMenuOnFocus}
      options={options}
      placeholder={defaultDisplay}
      ref={getRef}
      templateDisplay={templateDisplay}
      templateItem={templateItem}
      value={defaultValue}
    />
  )
}

SelectInput.defaultProps = {
  openMenuOnClick: true
}

SelectInput.propTypes = {
  items: PropTypes.array.isRequired,
  selected: PropTypes.object,
  expanded: PropTypes.bool,
  searchEnabled: PropTypes.bool,
  menuIsOpen: PropTypes.bool,
  openMenuOnClick: PropTypes.bool,
  openMenuOnFocus: PropTypes.bool,
  disabled: PropTypes.bool,
  errorState: PropTypes.string,
  handleChange: PropTypes.func,
  handleClick: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  templateItem: PropTypes.func,
  getRef: PropTypes.func,
  fontSize: PropTypes.string,
  filterOption: PropTypes.func
}

export default SelectInput
