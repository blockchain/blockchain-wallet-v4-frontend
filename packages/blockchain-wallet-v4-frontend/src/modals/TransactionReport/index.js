import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import { formValueSelector } from 'redux-form'
import moment from 'moment'
import { equals, map } from 'ramda'

import { actions, selectors } from 'data'
import modalEnhancer from 'providers/ModalEnhancer'
import TransactionReport from './template.js'

const dateFormatUS = 'YYYY-MM-DD'

class TransactionReportContainer extends React.Component {
  constructor (props) {
    super(props)
    this.state = { filename: '' }
    this.onSubmit = this.onSubmit.bind(this)
    this.transformToCsvData = this.transformToCsvData.bind(this)
  }

  componentWillMount () {
    const initialValues = {
      start: moment().subtract(7, 'day').format(dateFormatUS),
      end: moment().format(dateFormatUS)
    }
    this.props.formActions.initialize('transactionReport', initialValues)
  }

  componentWillReceiveProps (nextProps) {
    const { from, start, end } = this.props
    // If we change the form values, we can't download yet
    if (!equals(from, nextProps.from) || !equals(start, nextProps.start) || !equals(end, nextProps.end)) {
      this.setState({ filename: '' })
    }
  }

  transformToCsvData (data) {
    const headers = [['date', 'time', 'amount_btc', 'value_then', 'value_now', 'exchange_rate_then', 'tx']]
    const records = map((record) => [record.date, record.time, record.type, record.amount_btc, record.value_then, record.value_now, record.exchange_rate_then, record.tx], data)
    return headers.concat(records)
  }

  onSubmit (e) {
    e.preventDefault()
    const { from, start, end } = this.props
    const address = from && (from.xpub || from.address)
    const startDate = moment(start, dateFormatUS)
    const endDate = moment(end, dateFormatUS)
    this.props.dataActions.getTransactionHistory(address, startDate.format('DD/MM/YYYY'), endDate.format('DD/MM/YYYY'))
    this.setState({ filename: `history-${startDate.format('DD-MM-YYYY')}-${endDate.format('DD-MM-YYYY')}.csv` })
  }

  render () {
    const data = this.transformToCsvData(this.props.data)
    return <TransactionReport {...this.props} data={data} filename={this.state.filename} onSubmit={this.onSubmit} />
  }
}

const mapStateToProps = (state) => ({
  from: formValueSelector('transactionReport')(state, 'from'),
  start: formValueSelector('transactionReport')(state, 'start'),
  end: formValueSelector('transactionReport')(state, 'end'),
  data: selectors.core.reports.getTransactionHistory(state)
})

const mapDispatchToProps = (dispatch) => ({
  dataActions: bindActionCreators(actions.data, dispatch),
  formActions: bindActionCreators(actions.form, dispatch),
  modalActions: bindActionCreators(actions.modals, dispatch),
  settingsActions: bindActionCreators(actions.settings, dispatch)
})

const enhance = compose(
  modalEnhancer('TransactionReport'),
  connect(mapStateToProps, mapDispatchToProps)
)

export default enhance(TransactionReportContainer)
