import React from 'react'
import { equals } from 'ramda'
import styled from 'styled-components'

import { Text, TextAreaInput } from 'blockchain-info-components'

const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-start;
  width: 100%;
`
const Error = styled(Text)`
  position: absolute;
  display: block;
  height: 15px;
  top: ${props => (props.errorBottom ? '40px' : '-20px')};
  right: 0;
`
const getErrorState = meta => {
  return meta.touched && meta.invalid ? 'invalid' : 'initial'
}

class TextAreaDebounced extends React.Component {
  constructor(props) {
    super(props)
    this.state = { value: props.input.value, updatedValue: props.input.value }
    this.timeout = undefined
    this.handleChange = this.handleChange.bind(this)
    this.handleBlur = this.handleBlur.bind(this)
    this.handleFocus = this.handleFocus.bind(this)
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (!equals(prevState.updatedValue, prevState.value)) {
      return {
        updatedValue: prevState.updatedValue,
        value: prevState.updatedValue
      }
    }
    if (!equals(nextProps.input.value, prevState.value)) {
      return {
        updatedValue: nextProps.input.value,
        value: nextProps.input.value
      }
    }
    return null
  }

  componentWillUnmount() {
    clearTimeout(this.timeout)
  }

  handleChange(e) {
    e.preventDefault()
    const value = e.target.value
    this.setState({ updatedValue: value })

    if (this.timeout) clearTimeout(this.timeout)
    this.timeout = setTimeout(() => {
      this.props.input.onChange(value)
    }, 500)
  }

  handleBlur() {
    this.props.input.onBlur(this.state.value)
  }

  handleFocus() {
    this.props.input.onFocus(this.state.value)
  }

  render() {
    const { disabled, meta, placeholder, rows, ...rest } = this.props
    const errorState = getErrorState(meta)

    return (
      <Container>
        <TextAreaInput
          value={this.state.value}
          errorState={errorState}
          disabled={disabled}
          placeholder={placeholder}
          rows={rows}
          resize={false}
          onChange={this.handleChange}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          data-e2e={this.props['data-e2e']}
          {...rest}
        />
        {meta.touched && meta.error && (
          <Error size='12px' weight={400} color='error'>
            {meta.error}
          </Error>
        )}
      </Container>
    )
  }
}

export default TextAreaDebounced
