import React, { Component } from 'react'
import { connect } from 'react-redux'
import { endOfDay, format, startOfDay, subDays } from 'date-fns'
import { compose, Dispatch } from 'redux'

import { CoinType } from '@core/types'
import { actions, selectors } from 'data'
import { RootState } from 'data/rootReducer'
import { ModalName } from 'data/types'
import modalEnhancer from 'providers/ModalEnhancer'

import { getData } from './selectors'
import DownloadTransactions from './template'

export type StateProps = {
  filename: string
  generating: boolean
}
export type OwnProps = {
  closeAll: () => void
  coin: CoinType
  csvData: Array<string>
  position: number
  total: number
}
type LinkStatePropsType = {
  formValues: any
}
type LinkDispatchPropsType = {
  clearTransactions: () => void
  fetchTransactions: (address: string, startDate: string, endDate: string) => void
  initForm: (formDefaults: { end: string; from: 'all'; start: string }) => void
}
type Props = OwnProps & LinkDispatchPropsType & LinkStatePropsType

class DownloadTransactionsModal extends Component<Props, StateProps> {
  constructor(props: Props) {
    super(props)
    this.state = { filename: '', generating: false }
  }

  componentDidMount() {
    const { initForm } = this.props
    const today = new Date()
    initForm({
      end: format(endOfDay(today), 'yyyy-MM-dd'),
      from: 'all',
      start: format(subDays(startOfDay(today), 7), 'yyyy-MM-dd')
    })
  }

  componentWillUnmount() {
    this.props.clearTransactions()
  }

  onFetchHistory = () => {
    const { coin, fetchTransactions, formValues } = this.props
    const { end, from, start } = formValues
    const addressDerivations =
      from.derivations &&
      from.derivations.map((derivation) => ({
        address: derivation.xpub,
        type: derivation.type
      }))
    // hack to get correct dates
    const startParts = start.split('-')
    const endParts = end.split('-')
    const startDate = new Date(startParts[0], startParts[1] - 1, startParts[2])
    const endDate = endOfDay(new Date(endParts[0], endParts[1] - 1, endParts[2]))
    const address = from && (addressDerivations || from.xpub || from.address || from)
    // start/end are moment objects due to react-datetime :(
    const filename = `${coin}_${format(startDate, 'MM-dd-yyyy')}_${format(
      endDate,
      'MM-dd-yyyy'
    )}.csv`
    this.setState({ filename, generating: true })
    fetchTransactions(address, startDate.toString(), endDate.toString())
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
  formValues: selectors.form.getFormValues('transactionReport')(state),
  ...getData(state, ownProps.coin)
})

const mapDispatchToProps = (dispatch: Dispatch, { coin }: OwnProps) => {
  const { erc20Address, parentChain = coin } = window.coins[coin].coinfig.type
  const coinCode = parentChain.toLowerCase()
  return {
    clearTransactions: () => dispatch(actions.core.data[coinCode].clearTransactionHistory()),
    fetchTransactions: (address, startDate, endDate) => {
      if (erc20Address) {
        return dispatch(
          actions.core.data.eth.fetchErc20TransactionHistory(address, startDate, endDate, coin)
        )
      }

      return dispatch(
        actions.core.data[coinCode].fetchTransactionHistory(address, startDate, endDate)
      )
    },
    initForm: (initialValues) =>
      dispatch(actions.form.initialize('transactionReport', initialValues))
  }
}

const enhance = compose<React.ComponentType>(
  modalEnhancer(ModalName.TRANSACTION_REPORT_MODAL),
  connect(mapStateToProps, mapDispatchToProps)
)

export default enhance(DownloadTransactionsModal)
