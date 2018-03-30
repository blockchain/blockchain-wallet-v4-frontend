import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import { formValueSelector } from 'redux-form'
import moment from 'moment'
import { map } from 'ramda'

import { Remote } from 'blockchain-wallet-v4/src'
import { actions } from 'data'
import modalEnhancer from 'providers/ModalEnhancer'
import { getData } from './selectors.js'
import Success from './template.success'
import Loading from './template.loading'
import Error from './template.error'

const dateFormatUS = 'YYYY-MM-DD'

class SecondStepContainer extends React.Component {
  constructor (props) {
    super(props)
    this.state = { filename: '' }
    this.transformToCsvData = this.transformToCsvData.bind(this)
  }

  componentWillMount () {
    const { start, end } = this.props
    const startDate = moment(start, dateFormatUS)
    const endDate = moment(end, dateFormatUS)
    this.setState({ filename: `history-${startDate.format('DD-MM-YYYY')}-${endDate.format('DD-MM-YYYY')}.csv` })
    if (Remote.NotAsked.is(this.props.data)) {
      // Fetch transaction history actions?
    }
  }

  transformToCsvData (data) {
    const headers = [['date', 'time', 'status', 'amount_btc', 'value_then', 'value_now', 'exchange_rate_then', 'tx']]
    const records = map((record) => [record.date, record.time, record.type, record.amount_btc, record.value_then, record.value_now, record.exchange_rate_then, record.tx], data)
    return headers.concat(records)
  }

  render () {
    const { data, ...rest } = this.props

    return data.cata({
      Success: (value) => <Success {...rest} data={this.transformToCsvData(value)} filename={this.state.filename} />,
      Failure: (message) => <Error {...rest} message={message} />,
      Loading: () => <Loading {...rest} />,
      NotAsked: () => <Loading {...rest} />
    })
  }
}

const mapStateToProps = (state) => ({
  start: formValueSelector('transactionReport')(state, 'start'),
  end: formValueSelector('transactionReport')(state, 'end'),
  data: getData(state)
})

const mapDispatchToProps = (dispatch) => ({
  formActions: bindActionCreators(actions.form, dispatch)
})

const enhance = compose(
  modalEnhancer('TransactionReport'),
  connect(mapStateToProps, mapDispatchToProps)
)

export default enhance(SecondStepContainer)
