import React from 'react'
import styled from 'styled-components'
import { components } from 'react-select'
import CreatableSelect from 'react-select/lib/Creatable'

const StyledCreatableSelect = styled(CreatableSelect)`
  width: 100%;
  font-weight: 300;
  font-family: 'Montserrat', sans-serif;
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

const CreatableInput = props => {
  const {
    value,
    autoFocus,
    inputValue,
    isMulti,
    menuIsOpen,
    options,
    placeholder,
    handleBlur,
    handleChange,
    handleKeyDown,
    handleInputChange,
    multiValueContainer
  } = props

  return (
    <StyledCreatableSelect
      isClearable
      options={options}
      isMulti={isMulti}
      classNamePrefix='bc'
      autoFocus={autoFocus}
      menuIsOpen={menuIsOpen}
      onBlur={handleBlur}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      onInputChange={handleInputChange}
      placeholder={placeholder}
      inputValue={inputValue}
      components={{
        DropdownIndicator: null,
        MultiValueContainer
      }}
      value={value}
      // Components
      multiValueContainer={multiValueContainer}
    />
  )
}

export default CreatableInput
