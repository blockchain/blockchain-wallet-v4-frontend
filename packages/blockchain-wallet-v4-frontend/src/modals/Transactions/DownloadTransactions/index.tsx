import { compose, Dispatch } from 'redux'
import { connect } from 'react-redux'
import React, { Component } from 'react'

import * as moment from 'moment'
import { actions, selectors } from 'data'
import { prop, toLower } from 'ramda'
import modalEnhancer from 'providers/ModalEnhancer'
import momentHelper from 'services/MomentHelper'

import { CoinType, SupportedCoinType } from 'core/types'
import { getData } from './selectors'
import { RootState } from 'data/rootReducer'
import DownloadTransactions from './template'

export type StateProps = {
  filename: string
  generating: boolean
}
export type OwnProps = {
  closeAll: () => void
  coin: CoinType
  csvData: any
  position: number
  total: number
}
type LinkStatePropsType = {
  coinModel: SupportedCoinType
  formValues: any
}
type LinkDispatchPropsType = {
  clearTransactions: () => void
  fetchTransactions: (
    address: string,
    startDate: string,
    endDate: string
  ) => void
  initForm: (formDefaults: {
    end: moment.Moment
    from: 'all'
    start: moment.Moment
  }) => void
}
type Props = OwnProps & LinkDispatchPropsType & LinkStatePropsType

class DownloadTransactionsModal extends Component<Props, StateProps> {
  state: StateProps = { filename: '', generating: false }

  componentDidMount () {
    const { initForm } = this.props
    initForm({
      from: 'all',
      start: momentHelper()
        .startOf('day')
        .subtract(7, 'day'),
      end: momentHelper().endOf('day')
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
      `${coinModel.coinTicker}_${startDate.format('MM-DD-YYYY')}` +
      `_${endDate.format('MM-DD-YYYY')}.csv`
    this.setState({ generating: true, filename })
    fetchTransactions(address, startDate, endDate)
  }

  render () {
    const { props, onFetchHistory, state } = this
    const { filename, generating } = state
    const { closeAll, coin, csvData, position, total } = props

    return (
      <DownloadTransactions
        closeAll={closeAll}
        coin={coin}
        csvData={csvData}
        filename={filename}
        generating={generating}
        onSubmit={onFetchHistory}
        position={position}
        total={total}
      />
    )
  }
}

const mapStateToProps = (state: RootState, ownProps: OwnProps) => ({
  coinModel: selectors.core.walletOptions
    .getCoinModel(state, ownProps.coin)
    .getOrElse({ coinTicker: 'ETH' }),
  formValues: selectors.form.getFormValues('transactionReport')(state),
  ...getData(state, ownProps.coin)
})

const mapDispatchToProps = (dispatch: Dispatch, { coin }: OwnProps) => {
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

const enhance = compose<any>(
  modalEnhancer('TRANSACTION_REPORT'),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)

export default enhance(DownloadTransactionsModal)
