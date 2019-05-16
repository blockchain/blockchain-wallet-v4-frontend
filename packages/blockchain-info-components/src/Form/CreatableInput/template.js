import React from 'react'
import styled from 'styled-components'
import { flatten, length, prop } from 'ramda'
import { components } from 'react-select'
import CreatableSelect from 'react-select/lib/Creatable'

const StyledCreatableSelect = styled(CreatableSelect)`
  width: 100%;
  font-weight: 500;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
    Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  font-size: ${props => (props.fontSize === 'small' ? '12px' : '14px')};

  .bc__menu {
    background-color: ${props => props.theme['white']};
  }

  .bc__menu-list {
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
    color: ${props => props.theme['gray-5']};
  }

  .bc__placeholder {
    color: ${props => props.theme['gray-2']};
    & + div {
      width: 100%;
      z-index: 1;
    }
  }

  .bc__input {
    width: 100%;
    input {
      width: 100% !important;
    }
  }

  ${props =>
    !props.isMulti &&
    `
    .bc__control {
      box-shadow: none;
      color: ${props.theme['gray-5']};
      background-color: ${props.theme['white']};
      cursor: pointer;
      min-height: 40px;
      border-radius: 4px;
      border: 1px solid ${props.theme[props.borderColor]};
      &:hover {
        border: 1px solid ${props.theme[props.borderColor]};
      }
      &:active {
        border: 1px solid ${props.theme[props.borderColor]};
        box-shadow: none;
      }
      &:disabled {
        cursor: not-allowed;
        background-color: ${props.theme['gray-1']};
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
      color: ${props.theme['gray-5']};
      background-color: ${props.theme['white']};
      &.bc__option--is-focused {
        background-color: ${props.theme['white']};
        color: ${props.theme['brand-primary']};
      }
      &.bc__option--is-selected {
        color: ${props.theme['brand-primary']};
        background-color: ${props.theme['white']};
        &:hover {
          color: ${props.theme['brand-primary']};
        }
        * {
          color: ${props.theme['brand-primary']};
        }
      }
      &:hover {
        background-color: ${props.theme['white']};
        * {
          color: ${props.theme['brand-primary']};
        }
      }
      * {
        font-weight: 500;
        color: ${props.theme['gray-5']};
        transition: color 0.3s;
      }
    }

    .bc__single-value {
      color: ${props.theme['gray-5']};
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

  const borderColor = selectBorderColor(errorState)
  const flatOptions = !isMulti && flatten(options.map(prop('options')))
  const isOptionsEmpty = !isMulti && !length(flatOptions)

  return (
    <StyledCreatableSelect
      isClearable
      options={options}
      isMulti={isMulti}
      borderColor={borderColor}
      classNamePrefix='bc'
      autoFocus={autoFocus}
      menuIsOpen={menuIsOpen}
      onBlur={handleBlur}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      onInputChange={handleInputChange}
      openMenuOnClick={openMenuOnClick}
      placeholder={placeholder}
      inputValue={inputValue}
      indicatorSeparator={null}
      isOptionsEmpty={isOptionsEmpty}
      components={getComponents(isMulti)}
      value={value}
      // Components
      noOptionsMessage={noOptionsMessage}
      isValidNewOption={isValidNewOption}
      multiValueContainer={multiValueContainer}
    />
  )
}

export default CreatableInput
