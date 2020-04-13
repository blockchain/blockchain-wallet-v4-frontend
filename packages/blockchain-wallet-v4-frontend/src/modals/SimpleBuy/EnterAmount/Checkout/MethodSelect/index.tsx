import { Field } from 'redux-form'
import { Props } from '../template.success'
import { SelectBox } from 'components/Form'
import React, { PureComponent } from 'react'
import styled from 'styled-components'

const SelectBoxMethod = styled(SelectBox)`
  .bc__dropdown-indicator {
    padding-right: 24px;
    color: ${props => props.theme.grey600};
  }
`

class MethodSelect extends PureComponent<Props> {
  state = {}

  renderElements = () => {
    return [
      {
        group: '',
        items: this.props.paymentMethods.methods.map(value => ({
          text: value.type,
          value
        }))
      }
    ]
  }

  render () {
    return (
      <Field
        name='method'
        elements={this.renderElements()}
        component={SelectBoxMethod}
      />
    )
  }
}

export default MethodSelect
