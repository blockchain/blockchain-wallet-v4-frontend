import React from 'react'
import Select, { components, NonceProvider } from 'react-select'
import { assoc, equals, filter, flatten, head, path } from 'ramda'
import styled, { css } from 'styled-components'

import { selectBorderColor, selectFocusBorderColor } from '../helper'

// 🚨🚨🚨
// react-select overrides
// shared with CreatableInput
// 🚨🚨🚨
export const sharedSelect = css`
  font-weight: 500;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu,
    Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  font-size: ${(props) => (props.fontSize === 'small' ? '14px' : '16px')};

  .bc__menu {
    border-radius: 8px;
    box-shadow: 0px 4px 16px ${(props) => props.theme.greyFade200};
    background-color: ${(props) => props.theme.white};
  }
  .bc__menu-list {
    margin: 8px;
    padding: 0;
  }
  .bc__group {
    padding: 0;
  }
  .bc__group-heading {
    display: none;
  }
  .bc__control--is-focused > .bc__value-container > .bc__placeholder {
    opacity: 0.25;
  }
  .bc__placeholder {
    color: ${(props) => props.theme.grey400};
    font-size: 14px;
    font-weight: 500;
    & + div {
      width: 100%;
      z-index: 2;
    }
  }
  .bc__indicator-separator {
    display: none;
  }
  .bc__control {
    box-shadow: none;
    color: ${(props) => props.theme.grey800};
    background-color: ${({ theme }) => theme.white};
    cursor: pointer;
    min-height: ${(props) => props.height};
    border-radius: 8px;
    border: ${({ borderColor, theme }) => `1px solid ${theme[borderColor]}`};

    &:disabled {
      cursor: not-allowed;
      background-color: ${(props) => props.theme.grey100};
      border: 1px solid transparent;
    }
    &:hover {
      border: ${({ borderColor, theme }) => `1px solid ${theme[borderColor]}`};
    }
    &.bc__control--is-focused {
      border: 1px solid ${({ focusedBorderColor, theme }) => theme[focusedBorderColor]};
    }
    &.bc__control--menu-is-open {
      background-color: ${({ theme }) => theme.white};
      border: 1px solid ${({ focusedBorderColor, theme }) => theme[focusedBorderColor]};
    }
    .bc__value-container {
      overflow: hidden;
    }

    input {
      border: none !important;
      font-weight: 500;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu,
        Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      font-size: ${(props) => (props.fontSize === 'small' ? '14px' : '16px')};
    }
  }
  .bc__option {
    padding: 8px;
    cursor: pointer;
    font-size: 14px;
    border-radius: 8px;
    color: ${(props) => props.theme.grey800};
    background-color: ${(props) => props.theme.white};
    transition: all 0.3s;

    &.bc__option--is-focused.bc__option--is-selected,
    &.bc__option--is-focused {
      background-color: ${(props) => props.theme.grey000};
    }

    &.bc__option--is-selected {
      position: relative;
      background-color: ${(props) => props.theme.white};
      &:after {
        content: '\\e90b';
        font-family: icomoon, -apple-system, sans-serif;
        border-radius: 50%;
        top: 50%;
        right: 6px;
        position: absolute;
        transform: translateY(-50%);
        font-size: 16px;
        color: ${(props) => props.theme.green500};
        background-color: ${(props) => props.theme.white};
      }
    }
    * {
      font-weight: 500;
    }
  }
  .bc__single-value {
    color: ${(props) => props.theme.grey800};
  }
  .bc__dropdown-indicator {
    padding-right: 12px;
  }
`

const StyledSelect = styled(Select)`
  ${sharedSelect}
`

// A fake button so that vimium and other assistive tech can pick up dropdown
export const AssistiveControl = styled.div`
  position: absolute;
  height: 5px;
  width: 5px;
  left: 0;
  top: 0;
`

export const Control = (props) => {
  return props.selectProps.hideFocusedControl && props.selectProps.menuIsOpen ? null : (
    <components.Control {...props}>
      {props.children}
      <AssistiveControl role='button' />
    </components.Control>
  )
}

const Option = (props) => {
  const itemProps = assoc('text', props.label, props)
  return (
    <components.Option {...props}>
      {props.selectProps.templateItem ? props.selectProps.templateItem(itemProps) : props.children}
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

const DropdownIndicator = (props) => {
  return props.selectProps.hideIndicator ? null : <components.DropdownIndicator {...props} />
}

const IndicatorSeparator = (props) => {
  return props.selectProps.hideIndicator ? null : <components.IndicatorSeparator {...props} />
}

const SelectInput = (props) => {
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
    height = '48px',
    hideFocusedControl,
    hideIndicator,
    items,
    menuIsOpen,
    menuPlacement,
    onBlur,
    onFocus,
    onKeyDown,
    openMenuOnClick = true,
    openMenuOnFocus,
    searchEnabled,
    templateDisplay,
    templateItem
  } = props
  const options = grouped ? items : items.map((item) => ({ label: item.text, value: item.value }))
  const groupedOptions = grouped && flatten(options.map((o) => o.options))
  const defaultValue = grouped
    ? head(filter((x) => equals(x.value, defaultItem), groupedOptions))
    : head(filter((x) => equals(x.value, defaultItem), options))

  return (
    // @ts-ignore
    <NonceProvider nonce={window.NONCE}>
      <StyledSelect
        borderColor={selectBorderColor(errorState)}
        className={className}
        classNamePrefix='bc'
        components={{
          Control,
          DropdownIndicator,
          IndicatorSeparator,
          Option,
          ValueContainer
        }}
        focusedBorderColor={selectFocusBorderColor(errorState)}
        filterOption={filterOption}
        height={height}
        hideFocusedControl={hideFocusedControl}
        hideIndicator={hideIndicator}
        isDisabled={disabled}
        isSearchable={searchEnabled}
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
    </NonceProvider>
  )
}

export default SelectInput
