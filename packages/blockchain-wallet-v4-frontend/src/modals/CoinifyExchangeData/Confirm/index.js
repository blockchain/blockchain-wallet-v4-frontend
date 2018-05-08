import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import { formValueSelector } from 'redux-form'
import { actions, selectors } from 'data'
import ui from 'redux-ui'
import { path } from 'ramda'
import Template from './template'
import { getData } from './selectors'

class ConfirmContainer extends Component {
  constructor (props) {
    super(props)

    this.onSubmit = this.onSubmit.bind(this)
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.data.data && this.props.data.data) { // so it doesn't complain when hot reloading
      if (nextProps.data.data.quote.baseAmount !== this.props.data.data.quote.baseAmount) this.props.updateUI({ editing: false })
    }
  }

  onSubmit (e) {
    e.preventDefault()
    const medium = this.props.medium
    if (this.props.ui.editing) {
      const { baseCurrency, quoteCurrency } = this.props.data.data.quote
      const amt = +this.props.editingAmount * 100
      this.props.coinifyDataActions.fetchQuoteAndMediums({ amt, baseCurrency, quoteCurrency, medium })
    } else {
      const quote = this.props.data.data.quote
      this.props.coinifyActions.initiateBuy({ quote, medium })
    }
  }

  render () {
    const { ui, data, medium, editingAmount } = this.props

    return data.cata({
      Success: (value) =>
        <Template
          value={value}
          ui={ui}
          medium={medium}
          rateQuote={this.props.rateQuote}
          onSubmit={this.onSubmit}
          editingAmount={editingAmount}
          toggleEdit={() => this.props.updateUI({ editing: !this.props.ui.editing })}
        />,
      Failure: (msg) => <div>ERROR: {msg}</div>,
      Loading: () => <div>Loading...</div>,
      NotAsked: () => <div>Not asked...</div>
    })
  }
}

const mapStateToProps = (state) => ({
  data: getData(state),
  rateQuote: selectors.core.data.coinify.getRateQuote(state),
  medium: path(['coinify', 'medium'], state),
  editingAmount: formValueSelector('coinifyConfirm')(state, 'amount')
})

const mapDispatchToProps = (dispatch) => ({
  formActions: bindActionCreators(actions.form, dispatch),
  coinifyDataActions: bindActionCreators(actions.core.data.coinify, dispatch),
  coinifyActions: bindActionCreators(actions.modules.coinify, dispatch)
})

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  ui({ state: { editing: false, limitsError: '' } })
)

export default enhance(ConfirmContainer)
