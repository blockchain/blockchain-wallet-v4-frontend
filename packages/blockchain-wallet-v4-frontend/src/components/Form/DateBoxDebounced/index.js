import React from 'react'
import styled from 'styled-components'

import { equals } from 'ramda'
import { Text, DateInput } from 'blockchain-info-components'

const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-start;
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

class DateBoxDebounced extends React.Component {
  static getDerivedStateFromProps (nextProps, prevState) {
    if (!equals(nextProps.input.value, prevState)) {
      return { value: nextProps.input.value }
    }
    return null
  }

  constructor (props) {
    super(props)
    this.state = { value: props.input.value, open: props.open }
    this.timeout = undefined
    this.handleChange = this.handleChange.bind(this)
    this.handleBlur = this.handleBlur.bind(this)
    this.handleFocus = this.handleFocus.bind(this)
  }

  componentWillUnmount () {
    clearTimeout(this.timeout)
  }

  handleChange (value) {
    this.setState({ value, open: false })
    if (this.timeout) clearTimeout(this.timeout)
    this.timeout = setTimeout(() => {
      this.props.input.onChange(value)
    }, 500)
  }

  handleBlur () {
    this.setState({ open: false })
    this.props.input.onBlur(this.state.value)
  }

  handleFocus () {
    this.setState({ open: true })
    this.props.input.onFocus(this.state.value)
  }

  render () {
    const { meta, disabled, placeholder } = this.props
    const { value, open } = this.state
    const errorState = getErrorState(meta)

    return (
      <Container>
        <DateInput
          value={value}
          errorState={errorState}
          disabled={disabled}
          placeholder={placeholder}
          onChange={this.handleChange}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          closeOnSelect={false}
          closeOnTab={false}
          open={open}
        />
        {meta.touched && meta.error && <Error size='12px' weight={300} color='error'>{meta.error}</Error>}
        {meta.touched && !meta.error && meta.warning && <Error size='12px' weight={300} color='sent'>{meta.warning}</Error>}
      </Container>
    )
  }
}

export default DateBoxDebounced
