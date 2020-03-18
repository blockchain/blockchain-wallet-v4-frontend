import { Props } from '../template.success'
import Checkout from './template'
import React, { PureComponent } from 'react'

class CheckoutContainer extends PureComponent<Props> {
  state = {}

  componentDidMount () {
    this.props.formActions.initialize('simpleBuyCheckout', {
      pair: this.props.pairs[0]
    })
  }

  componentWillUnmount () {
    this.props.simpleBuyActions.fetchSBPairsSuccess([])
  }

  handleSubmit = () => {}

  render () {
    return <Checkout {...this.props} onSubmit={this.handleSubmit} />
  }
}

export default CheckoutContainer
