import React from 'react'
import { difference, head, pathOr } from 'ramda'
import CreatableInput from './template'

const components = {
  DropdownIndicator: null
}

const createOption = label => ({
  label,
  value: label
})

class CreatableInputContainer extends React.PureComponent {
  constructor () {
    super()
    this.state = {
      inputValue: '',
      value: []
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleKeyDown = this.handleKeyDown.bind(this)
    this.handleNewValue = this.handleNewValue.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
  }

  componentDidUpdate (prevProps) {
    const prevValue = pathOr([], ['value', 'value'], prevProps)
    const newValue = pathOr([], ['value', 'value'], this.props)
    if (head(difference(newValue, prevValue))) {
      this.handleNewValue(prevValue, newValue)
    }
  }

  handleChange (value, actionMeta) {
    this.setState({ value })
    if (this.props.onChange) {
      this.props.onChange({ value })
    }
  }

  handleInputChange (inputValue) {
    this.setState({ inputValue })
  }

  handleKeyDown (event) {
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

  handleNewValue (prevValue, newValue) {
    this.setState({
      value: [...prevValue, head(difference(newValue, prevValue))]
    })
  }

  render () {
    const { inputValue, value } = this.state
    return (
      <CreatableInput
        isClearable
        isMulti
        menuIsOpen={false}
        handleChange={this.handleChange}
        handleKeyDown={this.handleKeyDown}
        handleInputChange={this.handleInputChange}
        placeholder={this.props.placeholder || ''}
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
