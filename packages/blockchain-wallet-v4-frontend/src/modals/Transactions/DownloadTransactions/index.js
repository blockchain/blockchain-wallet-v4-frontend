import { compose } from 'redux'
import { connect } from 'react-redux'
import React from 'react'

import { actions, selectors } from 'data'
import { prop, toLower } from 'ramda'
import modalEnhancer from 'providers/ModalEnhancer'
import moment from 'services/MomentHelper'

import { getData } from './selectors'
import DownloadTransactions from './template'

class DownloadTransactionsContainer extends React.PureComponent {
  state = { filename: '', generating: false }

  componentDidMount () {
    const { initForm, language } = this.props
    moment.locale(language)
    initForm({
      from: 'all',
      start: moment()
        .startOf('day')
        .subtract(7, 'day'),
      end: moment().startOf('day')
    })
  }

  componentWillUnmount () {
    this.props.clearTransactions()
  }

  onFetchHistory = () => {
    const { coinModel, fetchTransactions, formValues } = this.props
    const from = prop('from', formValues)
    const startDate = prop('start', formValues)
    const endDate = prop('end', formValues)
    const address = from && (from.xpub || from.address || from)
    const filename =
      `${coinModel.coinTicker}_${startDate.format('YYYY-MM-DD')}` +
      `_${endDate.format('YYYY-MM-DD')}.csv`
    this.setState({ generating: true, filename })
    fetchTransactions(address, startDate, endDate)
  }

  render () {
    const {
      position,
      total,
      closeAll,
      coin,
      csvData,
      isValidStartDate,
      isValidEndDate
    } = this.props

    return (
      <DownloadTransactions
        closeAll={closeAll}
        coin={coin}
        csvData={csvData}
        filename={this.state.filename}
        generating={this.state.generating}
        isValidEndDate={isValidEndDate}
        isValidStartDate={isValidStartDate}
        onReportDownload={closeAll}
        onSubmit={this.onFetchHistory}
        position={position}
        total={total}
      />
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  coinModel: selectors.core.walletOptions
    .getCoinModel(state, ownProps.coin)
    .getOrElse({ coinTicker: 'ETH' }),
  locale: selectors.preferences.getLanguage(state),
  formValues: selectors.form.getFormValues('transactionReport')(state),
  ...getData(state, ownProps.coin)
})

const mapDispatchToProps = (dispatch, { coin }) => {
  const coinCode = coin === 'PAX' ? 'eth' : toLower(coin)
  return {
    clearTransactions: () =>
      dispatch(actions.core.data[coinCode].clearTransactionHistory()),
    fetchTransactions: (address, startDate, endDate) => {
      if (coin === 'PAX') {
        return dispatch(
          actions.core.data.eth.fetchErc20TransactionHistory(
            address,
            startDate,
            endDate,
            'pax'
          )
        )
      }
      return dispatch(
        actions.core.data[coinCode].fetchTransactionHistory(
          address,
          startDate,
          endDate
        )
      )
    },
    initForm: initialValues =>
      dispatch(actions.form.initialize('transactionReport', initialValues))
  }
}

const enhance = compose(
  modalEnhancer('TRANSACTION_REPORT'),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)

export default enhance(DownloadTransactionsContainer)
