import { Field } from 'redux-form'
import { getCoinFromPair } from 'data/components/simpleBuy/model'
import { Props } from '../template.success'
import { SelectBox } from 'components/Form'
import React, { PureComponent } from 'react'

class CoinSelect extends PureComponent<Props & { name: string }> {
  state = {}

  renderElements = () => {
    return [
      {
        group: '',
        items: this.props.pairs.map(value => ({
          text: getCoinFromPair(value),
          value
        }))
      }
    ]
  }

  render () {
    return (
      <Field
        component={SelectBox}
        elements={this.renderElements()}
        hideIndicator={this.props.pairs.length <= 1}
        openMenuOnClick={this.props.pairs.length > 1}
        searchEnabled={false}
        name={this.props.name}
      />
    )
  }
}

export default CoinSelect
