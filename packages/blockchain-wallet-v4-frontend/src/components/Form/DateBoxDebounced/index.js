import React from 'react'
import locale from 'browser-locale'
import { equals } from 'ramda'
import styled from 'styled-components'

import { DateInput, Text } from 'blockchain-info-components'

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
  top: 40px;
  right: 0;
`
const getErrorState = meta => {
  return meta.dirty && meta.invalid ? 'invalid' : 'initial'
}

class DateBoxDebounced extends React.Component {
  constructor(props) {
    super(props)
    this.state = { value: props.input.value, open: props.open }
    this.timeout = undefined
    this.handleChange = this.handleChange.bind(this)
    this.handleBlur = this.handleBlur.bind(this)
    this.handleFocus = this.handleFocus.bind(this)
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (!equals(nextProps.input.value, prevState.value)) {
      return { value: nextProps.input.value }
    }
    return null
  }

  componentWillUnmount() {
    clearTimeout(this.timeout)
  }

  handleChange(value) {
    if (this.timeout) clearTimeout(this.timeout)
    this.timeout = setTimeout(() => {
      this.props.input.onChange(value)
      this.setState({ open: false })
    }, 500)
  }

  handleBlur() {
    this.setState({ open: false })
    this.props.input.onBlur(this.state.value)
  }

  handleFocus() {
    this.setState({ open: true })
    this.props.input.onFocus(this.state.value)
  }

  render() {
    const { input, meta, ...rest } = this.props
    const { open, value } = this.state
    const errorState = getErrorState(meta)

    return (
      <Container>
        <DateInput
          value={value}
          errorState={errorState}
          onChange={this.handleChange}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          closeOnSelect={false}
          closeOnTab={false}
          open={open}
          locale={locale()}
          {...rest}
        />
        {meta.dirty && meta.error && (
          <Error size='12px' weight={500} color='error'>
            {meta.error}
          </Error>
        )}
        {meta.dirty && !meta.error && meta.warning && (
          <Error size='12px' weight={500} color='error'>
            {meta.warning}
          </Error>
        )}
      </Container>
    )
  }
}

export default DateBoxDebounced
