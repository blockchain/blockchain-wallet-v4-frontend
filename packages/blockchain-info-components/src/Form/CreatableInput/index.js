import React from 'react'
import { difference, head, pathOr, isEmpty } from 'ramda'
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

  componentDidMount () {
    if (!isEmpty(this.props.defaultValue)) {
      // eslint-disable-next-line react/no-did-mount-set-state
      this.setState({ value: this.props.defaultValue })
    }
  }

  componentDidUpdate (prevProps) {
    const prevValue = pathOr([], ['value', 'value'], prevProps)
    const newValue = pathOr([], ['value', 'value'], this.props)
    const diff = head(difference(newValue, prevValue))
    if (diff) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ value: [...prevValue, diff] })
    }
  }

  handleChange = value => {
    this.setState({ value })
    if (this.props.onChange) {
      this.props.onChange({ value })
    }
  }

  handleInputChange = inputValue => {
    this.setState({ inputValue })
  }

  handleKeyDown = event => {
    const { inputValue, value } = this.state
    if (!inputValue) return
    switch (event.key) {
      case 'Enter':
      case 'Tab':
        this.setState({
          inputValue: '',
          value: [...value, createOption(inputValue)]
        })
        if (this.props.onChange) {
          this.props.onChange({ value: [...value, createOption(inputValue)] })
        }
        event.preventDefault()
    }
  }

  handleBlur = event => {
    const { inputValue, value } = this.state
    if (!inputValue) return
    switch (event.type) {
      case 'blur':
        this.setState({
          inputValue: '',
          value: [...value, createOption(inputValue)]
        })
        if (this.props.onChange) {
          this.props.onChange({ value: [...value, createOption(inputValue)] })
        }
    }
  }

  render () {
    const { inputValue, value } = this.state
    return (
      <CreatableInput
        isClearable
        isMulti
        menuIsOpen={false}
        handleBlur={this.handleBlur}
        handleChange={this.handleChange}
        handleKeyDown={this.handleKeyDown}
        handleInputChange={this.handleInputChange}
        placeholder={this.props.placeholder || ''}
        autoFocus={this.props.autoFocus}
        inputValue={inputValue}
        components={components}
        value={value}
        // Components
        multiValueContainer={this.props.multiValueContainer}
      />
    )
  }
}

export default CreatableInputContainer
