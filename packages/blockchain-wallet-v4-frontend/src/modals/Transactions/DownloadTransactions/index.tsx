import React, { Component } from 'react'
import { connect } from 'react-redux'
import locale from 'browser-locale'
import * as moment from 'moment'
import { prop, toLower } from 'ramda'
import { compose, Dispatch } from 'redux'

import { CoinType, SupportedCoinType } from 'blockchain-wallet-v4/src/types'
import { actions, selectors } from 'data'
import { RootState } from 'data/rootReducer'
import modalEnhancer from 'providers/ModalEnhancer'

import { getData } from './selectors'
import DownloadTransactions from './template'

moment.locale(locale())

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

  componentDidMount() {
    const { initForm } = this.props
    initForm({
      from: 'all',
      // @ts-ignore
      start: moment()
        .startOf('day')
        .subtract(7, 'day'),
      // @ts-ignore
      end: moment().endOf('day')
    })
  }

  componentWillUnmount() {
    this.props.clearTransactions()
  }

  onFetchHistory = () => {
    const { coinModel, fetchTransactions, formValues } = this.props
    const from = prop('from', formValues)
    const startDate = prop('start', formValues)
    const endDate = prop('end', formValues)
    const addressDerivations =
      from.derivations &&
      from.derivations.map(derivation => ({
        address: derivation.xpub,
        type: derivation.type
      }))
    const address =
      from && (addressDerivations || from.xpub || from.address || from)
    const filename =
      `${coinModel.coinTicker}_${startDate.format('MM-DD-YYYY')}` +
      `_${endDate.format('MM-DD-YYYY')}.csv`
    this.setState({ generating: true, filename })
    fetchTransactions(address, startDate, endDate)
  }

  render() {
    const { onFetchHistory, props, state } = this
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
  const coinCode =
    coin === 'PAX' || coin === 'USDT' || coin === 'WDGLD'
      ? 'eth'
      : toLower(coin)
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
      if (coin === 'USDT') {
        return dispatch(
          actions.core.data.eth.fetchErc20TransactionHistory(
            address,
            startDate,
            endDate,
            'usdt'
          )
        )
      }
      if (coin === 'WDGLD') {
        return dispatch(
          actions.core.data.eth.fetchErc20TransactionHistory(
            address,
            startDate,
            endDate,
            'wdgld'
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
  modalEnhancer('TRANSACTION_REPORT_MODAL'),
  connect(mapStateToProps, mapDispatchToProps)
)

export default enhance(DownloadTransactionsModal)
