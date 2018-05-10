import React from 'react'
import styled from 'styled-components'

import { Text, TextInput } from 'blockchain-info-components'

import _debounce from 'lodash.debounce'

const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-start;
  width: 100%;
  height: 40px;
`
const Error = styled(Text)`
  position: absolute;
  display: block;
  height: 15px;
  top: ${props => props.errorBottom ? '40px' : '-20px'};
  right: 0;
`
const getErrorState = (meta) => {
  return meta.touched && meta.invalid ? 'invalid' : 'initial'
}

class TextBoxDebounced extends React.Component {
  constructor (props) {
    super(props)

    this.state = { value: props.input.value }
    this.lastPropValue = props.input.value

    this.debouncedOnChange = _debounce(event => {
      props.input.onChange(event.target.value)
    }, 500)

    this.handleChange = event => {
      event.persist()
      this.setState({ value: event.target.value })
      this.debouncedOnChange(event)
    }
  }

  getValue () {
    const value = this.props.input.value !== this.lastPropValue
      ? this.props.input.value
      : this.state.value

    this.lastPropValue = this.props.input.value

    return value
  }

  handleFocus () {}

  render () {
    const { input, meta, borderRightNone, disabled, placeholder, center, errorBottom, autoFocus } = this.props
    const errorState = getErrorState(meta)

    return (
      <Container>
        <TextInput {...input}
          onChange={this.handleChange}
          value={this.getValue()}
          borderRightNone={borderRightNone}
          autoFocus={autoFocus}
          errorState={errorState}
          disabled={disabled}
          initial={meta.initial}
          placeholder={placeholder}
          center={center}
          onFocus={this.handleFocus()}
        />
        {meta.touched && meta.error && <Error size='12px' weight={300} color='error' errorBottom={errorBottom}>{meta.error}</Error>}
      </Container>
    )
  }
}

export default TextBoxDebounced
