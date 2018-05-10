import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions } from 'data'
import AddBankDetails from './template.js'

class AddBankDetailsContainer extends React.PureComponent {
  constructor (props) {
    super(props)
    this.onSubmit = this.onSubmit.bind(this)
  }

  componentDidMount () {
    const { quoteR } = this.props
    quoteR.map(quote => this.props.coinifyDataActions.getPaymentMediums(quote))
  }

  onSubmit (e) {
    e.preventDefault()
    // TODO: Store form data in the state
  }

  render () {
    return <AddBankDetails {...this.props} onSubmit={this.onSubmit} />
  }
}

const mapStateToProps = (state) => ({
})

const mapDispatchToProps = (dispatch) => ({
  coinifyDataActions: bindActionCreators(actions.core.data.coinify, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(AddBankDetailsContainer)
