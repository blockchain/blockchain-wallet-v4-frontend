import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { formValueSelector } from 'redux-form'
import { path } from 'ramda'

import { actions } from 'data'
import Template from './template'
import { getData } from './selectors'
import Failure from 'components/BuySell/Failure'

class ConfirmContainer extends Component {
  state = { isEditing: false, limitsError: '' }

  componentWillReceiveProps (nextProps) {
    const data = this.props.data.getOrElse(false)
    const nextData = nextProps.data.getOrElse(false)
    if (data && nextData) {
      // so it doesn't complain when hot reloading
      if (data.quote.baseAmount !== nextData.quote.baseAmount) {
        this.setState({ isEditing: false })
      }
    }
  }

  onSubmit = () => {
    const medium = this.props.medium
    const data = this.props.data.getOrElse(false)
    if (!data) return
    if (this.state.isEditing) {
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
    const { data, medium, editingAmount } = this.props

    return data.cata({
      Success: value => (
        <Template
          value={value}
          medium={medium}
          onSubmit={this.onSubmit}
          editingAmount={editingAmount}
          isEditing={this.state.isEditing}
          limitsError={this.state.limitsError}
          toggleEdit={() =>
            this.setState({ isEditing: !this.state.isEditing })
          }
        />
      ),
      Failure: msg => <Failure error={msg} />,
      Loading: () => <div/>,
      NotAsked: () => <div/>
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ConfirmContainer)
