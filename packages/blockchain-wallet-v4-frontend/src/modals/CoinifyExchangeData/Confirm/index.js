import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import { formValueSelector } from 'redux-form'
import { actions } from 'data'
import ui from 'redux-ui'
import { path } from 'ramda'
import Template from './template'
import { getData } from './selectors'
import Failure from 'components/BuySell/Failure'

class ConfirmContainer extends Component {
  constructor (props) {
    super(props)

    this.onSubmit = this.onSubmit.bind(this)
  }

  componentWillReceiveProps (nextProps) {
    const data = this.props.data.getOrElse(false)
    const nextData = nextProps.data.getOrElse(false)
    if (data && nextData) {
      // so it doesn't complain when hot reloading
      if (data.quote.baseAmount !== nextData.quote.baseAmount) {
        this.props.updateUI({ editing: false })
      }
    }
  }

  onSubmit () {
    const medium = this.props.medium
    const data = this.props.data.getOrElse(false)
    if (!data) return
    if (this.props.ui.editing) {
      const { baseCurrency, quoteCurrency } = data.quote
      const amt = +this.props.editingAmount * 100
      this.props.coinifyDataActions.fetchQuoteAndMediums({
        amt,
        baseCurrency,
        quoteCurrency,
        medium,
        type: 'buy'
      })
    } else {
      const quote = data.quote
      this.props.coinifyActions.initiateBuy({ quote, medium })
    }
  }

  render () {
    const { ui, data, medium, editingAmount } = this.props

    return data.cata({
      Success: value => (
        <Template
          value={value}
          ui={ui}
          medium={medium}
          onSubmit={this.onSubmit}
          editingAmount={editingAmount}
          toggleEdit={() =>
            this.props.updateUI({ editing: !this.props.ui.editing })
          }
        />
      ),
      Failure: msg => <Failure error={msg} />,
      Loading: () => <div>Loading...</div>,
      NotAsked: () => <div>Not asked...</div>
    })
  }
}

const mapStateToProps = state => ({
  data: getData(state),
  medium: path(['coinify', 'medium'], state),
  editingAmount: formValueSelector('coinifyConfirm')(state, 'amount')
})

const mapDispatchToProps = dispatch => ({
  formActions: bindActionCreators(actions.form, dispatch),
  coinifyDataActions: bindActionCreators(actions.core.data.coinify, dispatch),
  coinifyActions: bindActionCreators(actions.modules.coinify, dispatch)
})

const enhance = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  ui({ state: { editing: false, limitsError: '' } })
)

export default enhance(ConfirmContainer)
