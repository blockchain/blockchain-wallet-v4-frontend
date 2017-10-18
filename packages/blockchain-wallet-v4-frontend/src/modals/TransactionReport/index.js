import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import { formValueSelector } from 'redux-form'
import moment from 'moment'
import { equals } from 'ramda'

import { actions, selectors } from 'data'
import modalEnhancer from 'providers/ModalEnhancer'
import TransactionReport from './template.js'

const dateFormatUS = 'YYYY-MM-DD'

class TransactionReportContainer extends React.Component {
  constructor (props) {
    super(props)
    this.state = { filename: '' }
    this.onSubmit = this.onSubmit.bind(this)
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
    return <TransactionReport {...this.props} filename={this.state.filename} onSubmit={this.onSubmit} />
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
