import React from 'react'
import { difference, equals, head, isNil, pathOr } from 'ramda'

import CreatableInput from './template'

const components = {
  DropdownIndicator: null
}

const createOption = label => ({
  label,
  value: label
})

class CreatableInputContainer extends React.PureComponent {
  state = {
    inputValue: '',
    value: []
  }

  componentDidMount() {
    if (!isNil(this.props.defaultValue)) {
      // eslint-disable-next-line react/no-did-mount-set-state
      this.setState({ value: this.props.defaultValue })
    } else if (this.props.value) {
      const newValue = pathOr([], ['value', 'value'], this.props)
      // eslint-disable-next-line react/no-did-mount-set-state
      this.setState({ value: newValue })
    }
  }

  componentDidUpdate(prevProps) {
    const prevValue = pathOr([], ['value', 'value'], prevProps)
    const newValue = pathOr([], ['value', 'value'], this.props)
    const diff = head(difference(newValue, prevValue))
    if (diff) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ value: [...prevValue, diff] })
    }
    if (!this.props.isMulti && !equals(newValue, prevValue)) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ value: newValue })
    }
  }

  handleChange = value => {
    this.setState({ value })
    if (this.props.onChange) {
      !value ? this.props.onChange(value) : this.props.onChange({ value })
    }
  }

  handleInputChange = inputValue => {
    this.setState({ inputValue })
  }

  handleMultiChange = (inputValue, value) => {
    this.setState({
      inputValue: '',
      value: [...value, createOption(inputValue)]
    })
    if (this.props.onChange) {
      this.props.onChange({ value: [...value, createOption(inputValue)] })
    }
  }

  handleKeyDown = event => {
    const { inputValue, value } = this.state
    if (!inputValue || !this.props.isMulti) return
    switch (event.key) {
      case 'Enter':
      case 'Tab':
        this.handleMultiChange(inputValue, value)
        event.preventDefault()
    }
  }

  handleBlur = event => {
    this.props.onBlur()
    const { inputValue, value } = this.state
    if (!inputValue) return
    switch (event.type) {
      case 'blur':
        if (this.props.onChange) {
          if (this.props.isMulti) {
            this.handleMultiChange(inputValue, value)
          } else {
            this.handleChange(createOption(inputValue))
          }
        }
    }
  }

  render() {
    const { inputValue, value } = this.state
    return (
      <CreatableInput
        autoFocus={this.props.autoFocus}
        components={components}
        errorState={this.props.errorState}
        handleBlur={this.handleBlur}
        handleChange={this.handleChange}
        handleKeyDown={this.handleKeyDown}
        handleInputChange={this.handleInputChange}
        height={this.props.height}
        inputValue={inputValue}
        isClearable
        isMulti={this.props.isMulti}
        menuIsOpen={this.props.menuIsOpen}
        openMenuOnClick={this.props.openMenuOnClick}
        options={this.props.options}
        placeholder={this.props.placeholder || ''}
        value={value}
        // Components
        noOptionsMessage={this.props.noOptionsMessage}
        isValidNewOption={this.props.isValidNewOption}
        multiValueContainer={this.props.multiValueContainer}
      />
    )
  }
}

CreatableInputContainer.defaultProps = {
  height: '48px'
}

export default CreatableInputContainer
