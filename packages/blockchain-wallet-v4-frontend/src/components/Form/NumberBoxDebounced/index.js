import React from 'react'
import styled from 'styled-components'

import { equals, isNil } from 'ramda'
import { Text, NumberInput } from 'blockchain-info-components'

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
  white-space: nowrap;
  position: absolute;
  display: block;
  height: 15px;
  right: ${props => props.errorLeft ? 'auto' : 0};
  left: ${props => props.errorLeft ? '-2px' : 'auto'};
  top: ${props => props.errorBottom ? '40px' : '-20px'};
`
const getErrorState = (meta) => {
  return meta.touched && meta.invalid ? 'invalid' : 'initial'
}

class NumberBoxDebounced extends React.Component {
  constructor (props) {
    super(props)
    this.state = { updatedValue: props.input.value, value: props.input.value }
    this.timeout = undefined
    this.handleChange = this.handleChange.bind(this)
    this.handleBlur = this.handleBlur.bind(this)
    this.handleFocus = this.handleFocus.bind(this)
  }

  static getDerivedStateFromProps (nextProps, prevState) {
    if (isNil(prevState)) {
      return { updatedValue: nextProps.input.value, value: nextProps.input.value }
    }
    if (!equals(prevState.updatedValue, prevState.value)) {
      return { updatedValue: prevState.updatedValue, value: prevState.updatedValue }
    }
    if (!equals(nextProps.input.value, prevState.value)) {
      return { updatedValue: nextProps.input.value, value: nextProps.input.value }
    }
    return null
  }

  componentWillUnmount () {
    clearTimeout(this.timeout)
  }

  handleChange (e) {
    e.preventDefault()
    const value = e.target.value
    this.setState({ updatedValue: value })

    clearTimeout(this.timeout)
    this.timeout = setTimeout(() => {
      let val = this.props.currency ? parseFloat(value).toFixed(2) : value
      this.props.input.onChange(val)
    }, 500)
  }

  handleBlur () {
    this.props.input.onBlur(this.state.value)
  }

  handleFocus () {
    this.props.input.onFocus(this.state.value)
  }

  render () {
    const { disabled, errorBottom, errorLeft, meta, placeholder, ...rest } = this.props
    const errorState = getErrorState(meta)

    return (
      <Container>
        <NumberInput
          value={this.state.value}
          errorState={errorState}
          disabled={disabled}
          placeholder={placeholder}
          onChange={this.handleChange}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          {...rest}
        />
        {meta.touched && meta.error && <Error size='12px' weight={300} color='error' errorBottom={errorBottom} errorLeft={errorLeft}>{meta.error}</Error>}
        {meta.touched && !meta.error && meta.warning && <Error size='12px' weight={300} color='sent' errorBottom={errorBottom} errorLeft={errorLeft}>{meta.warning}</Error>}
      </Container>
    )
  }
}

export default NumberBoxDebounced
