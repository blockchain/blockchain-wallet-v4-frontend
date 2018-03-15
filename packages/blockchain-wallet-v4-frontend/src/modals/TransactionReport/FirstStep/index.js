import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import { formValueSelector } from 'redux-form'
import moment from 'moment'

import { actions } from 'data'
import modalEnhancer from 'providers/ModalEnhancer'
import FirstStep from './template'

const dateFormatUS = 'YYYY-MM-DD'

class FirstStepContainer extends React.Component {
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

  onSubmit (e) {
    e.preventDefault()
    const { from, start, end } = this.props
    const address = from && (from.xpub || from.address)
    const startDate = moment(start, dateFormatUS)
    const endDate = moment(end, dateFormatUS)
    this.props.transactionHistoryActions.fetchTransactionHistory(address, startDate.format('DD/MM/YYYY'), endDate.format('DD/MM/YYYY'))
    this.props.nextStep()
  }

  render () {
    const { data, ...rest } = this.props

    return (<FirstStep {...rest} onSubmit={this.onSubmit} />)
  }
}

const mapStateToProps = (state) => ({
  from: formValueSelector('transactionReport')(state, 'from'),
  start: formValueSelector('transactionReport')(state, 'start'),
  end: formValueSelector('transactionReport')(state, 'end')
})

const mapDispatchToProps = (dispatch) => ({
  transactionHistoryActions: bindActionCreators(actions.core.data.bitcoin, dispatch),
  formActions: bindActionCreators(actions.form, dispatch)
})

const enhance = compose(
  modalEnhancer('TransactionReport'),
  connect(mapStateToProps, mapDispatchToProps)
)

export default enhance(FirstStepContainer)
