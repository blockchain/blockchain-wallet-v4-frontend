import React from 'react'
import styled from 'styled-components'

import { equals } from 'ramda'
import { Text, TextInput } from 'blockchain-info-components'

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
    this.timeout = undefined
    this.handleChange = this.handleChange.bind(this)
    this.handleBlur = this.handleBlur.bind(this)
    this.handleFocus = this.handleFocus.bind(this)
  }

  static getDerivedStateFromProps (nextProps, prevState) {
    if (!equals(nextProps.input.value, prevState)) {
      return { value: nextProps.input.value }
    }
    return null
  }

  componentWillUnmount () {
    clearTimeout(this.timeout)
  }

  handleChange (e) {
    e.preventDefault()
    const value = e.target.value
    this.setState({ value })
    if (this.timeout) clearTimeout(this.timeout)
    this.timeout = setTimeout(() => {
      this.props.input.onChange(value)
    }, 10)
  }

  handleBlur () {
    this.props.input.onBlur(this.state.value)
  }

  handleFocus () {
    this.props.input.onFocus(this.state.value)
  }

  render () {
    const { meta, disabled, placeholder } = this.props
    const errorState = getErrorState(meta)

    return (
      <Container>
        <TextInput
          value={this.state.value}
          errorState={errorState}
          disabled={disabled}
          placeholder={placeholder}
          onChange={this.handleChange}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
        />
        {meta.touched && meta.error && <Error size='12px' weight={300} color='error'>{meta.error}</Error>}
        {meta.touched && !meta.error && meta.warning && <Error size='12px' weight={300} color='sent'>{meta.warning}</Error>}
      </Container>
    )
  }
}

export default TextBoxDebounced
