import { components } from 'react-select'
import { flatten, length, prop } from 'ramda'
import CreatableSelect from 'react-select/lib/Creatable'
import React from 'react'
import styled from 'styled-components'

import { selectBorderColor, selectFocusBorderColor } from '../helper'

const StyledCreatableSelect = styled(CreatableSelect)`
  width: 100%;
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

  .bc__placeholder {
    color: ${props => props.theme.grey400};
    font-size: 14px;
    font-weight: 500;
    & + div {
      width: 100%;
      z-index: 2;
    }
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

  .bc__input {
    width: 100%;
    input {
      width: 100% !important;
    }
  }

  .bc__control--is-focused > .bc__value-container > .bc__placeholder {
    opacity: 0.25;
  }

  ${({
    bgColor,
    borderColor,
    focusedBorderColor,
    hasValue,
    isMulti,
    isValid,
    theme
  }) =>
    !isMulti &&
    `
    .bc__control {
      box-shadow: none;
      color: ${theme['gray-5']};
      background-color: ${theme.white};
      cursor: pointer;
      min-height: 48px;
      border-radius: 4px;
      border: 1px solid ${theme[borderColor]};
      &.bc__control--is-focused {
        border: 1px solid ${theme[focusedBorderColor]};
      }
      &.bc__control--menu-is-open {
        background-color: ${theme.white};
        border: 1px solid ${theme[focusedBorderColor]};
      }
      &:disabled {
        cursor: not-allowed;
        background-color: ${theme.grey100};
      border: '1px solid transparent';
      }
      .bc__value-container {
        overflow: hidden;
      }
    }

    
    .bc__value-container {
      cursor: text;
      > div {
        width: 100%;
      }
    }

    .bc__clear-indicator {
      display: none;
    }

    .bc__indicator-separator {
      display: none;
    }

    input {
      border: none !important;
    }

    .bc__option {
      cursor: pointer;
      font-size: 14px;
      color: ${theme['gray-5']};
      background-color: ${theme.white};
      &.bc__option--is-focused {
        background-color: ${theme.white};
        color: ${theme.blue900};
      }
      &.bc__option--is-selected {
        color: ${theme.blue900};
        background-color: ${theme.white};
        &:hover {
          color: ${theme.blue900};
        }
        * {
          color: ${theme.blue900};
        }
      }
      &:hover {
        background-color: ${theme.white};
        * {
          color: ${theme.blue900};
        }
      }
      * {
        font-weight: 500;
        color: ${theme['gray-5']};
        transition: color 0.3s;
      }
      > div {
        font-size: 14px;
      }
    }

    .bc__single-value {
      color: ${theme['gray-5']};
    }
  `}

  ${props =>
    props.isOptionsEmpty &&
    `
    .bc__dropdown-indicator {
      display: none;
    }
  `}
`

const MultiValueContainer = props => {
  return (
    <components.MultiValueContainer {...props}>
      {props.selectProps.multiValueContainer
        ? props.selectProps.multiValueContainer(props)
        : props.children}
    </components.MultiValueContainer>
  )
}

const getComponents = isMulti =>
  isMulti
    ? {
        DropdownIndicator: null,
        MultiValueContainer
      }
    : { MultiValueContainer }

const CreatableInput = props => {
  const {
    autoFocus,
    errorState,
    inputValue,
    isMulti,
    menuIsOpen,
    openMenuOnClick,
    options,
    placeholder,
    handleBlur,
    handleChange,
    handleKeyDown,
    handleInputChange,
    multiValueContainer,
    isValidNewOption,
    noOptionsMessage,
    value
  } = props

  const flatOptions = !isMulti && flatten(options.map(prop('options')))
  const isOptionsEmpty = !isMulti && !length(flatOptions)

  return (
    <StyledCreatableSelect
      autoFocus={autoFocus}
      borderColor={selectBorderColor(errorState)}
      classNamePrefix='bc'
      components={getComponents(isMulti)}
      focusedBorderColor={selectFocusBorderColor(errorState)}
      indicatorSeparator={null}
      inputValue={inputValue}
      isClearable
      isMulti={isMulti}
      isOptionsEmpty={isOptionsEmpty}
      menuIsOpen={menuIsOpen}
      onBlur={handleBlur}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      onInputChange={handleInputChange}
      openMenuOnClick={openMenuOnClick}
      options={options}
      placeholder={placeholder}
      value={value}
      // Components
      noOptionsMessage={noOptionsMessage}
      isValidNewOption={isValidNewOption}
      multiValueContainer={multiValueContainer}
    />
  )
}

export default CreatableInput
