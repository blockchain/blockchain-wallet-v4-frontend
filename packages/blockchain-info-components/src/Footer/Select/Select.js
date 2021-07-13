import React, { PureComponent } from 'react'
import styled from 'styled-components'

const SelectElement = styled.select`
  margin-bottom: 0;
  min-width: 100px;
  color: rgba(3, 14, 38, 0.75);
  background-size: 20px;
  background-repeat: no-repeat;
  background-position: 95% center;
  background-image: url('/static/img/partial-arrow-down.png');
  appearance: none;
  border: none;
  font-size: 1rem;
  font-weight: 500;
  border-radius: var(--smBorderRadius);
  height: 2.5rem;
  line-height: 2.5rem;
  text-align: center;
  cursor: pointer;
  outline: none;
  background-color: ${props =>
    props.transparent ? 'transparent' : 'var(--grey000)'};
  padding: ${props => (props.transparent ? '0' : '0 1rem')};
  @media only screen and (max-width: 48rem) {
    width: ${props => (props.transparent ? 'auto' : '100%')};
  }
`

class Select extends PureComponent {
  constructor(props) {
    super(props)
    this.state = { value: null }
    this.onChange = this.onChange.bind(this)
  }

  static getDerivedStateFromProps(nextProps) {
    if (nextProps.value) {
      return {
        val: nextProps.value
      }
    }
    return null
  }

  onChange(e) {
    if (e.target && this.props.onChange) {
      let value = e.target.value
      this.setState({ value }, () => {
        this.props.onChange(value)
      })
    }
  }

  render() {
    let options = null
    if (this.props.values) {
      options = this.props.values.map(val => (
        <option key={val} value={val}>
          {val}
        </option>
      ))
    } else if (this.props.items) {
      options = this.props.items.map(val => (
        <option key={val.value} value={val.value}>
          {val.text}
        </option>
      ))
    }

    return (
      <SelectElement
        transparent={this.props.transparent}
        value={this.state.value || this.props.value}
        onChange={this.onChange.bind(this)}
      >
        {options}
      </SelectElement>
    )
  }
}

export default Select
