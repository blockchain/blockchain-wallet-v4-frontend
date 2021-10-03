import React, { Component } from 'react'
import { connect } from 'react-redux'
import locale from 'browser-locale'
import * as moment from 'moment'
import { prop } from 'ramda'
import { compose, Dispatch } from 'redux'

import { CoinType } from 'blockchain-wallet-v4/src/types'
import { actions, selectors } from 'data'
import { RootState } from 'data/rootReducer'
import { ModalName } from 'data/types'
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
  formValues: any
}
type LinkDispatchPropsType = {
  clearTransactions: () => void
  fetchTransactions: (address: string, startDate: string, endDate: string) => void
  initForm: (formDefaults: { end: moment.Moment; from: 'all'; start: moment.Moment }) => void
}
type Props = OwnProps & LinkDispatchPropsType & LinkStatePropsType

class DownloadTransactionsModal extends Component<Props, StateProps> {
  constructor(props: Props) {
    super(props)
    this.state = { filename: '', generating: false }
  }

  componentDidMount() {
    const { initForm } = this.props
    initForm({
      // @ts-ignore
      end: moment().endOf('day'),

      from: 'all',

      // @ts-ignore
      start: moment().startOf('day').subtract(7, 'day')
    })
  }

  componentWillUnmount() {
    this.props.clearTransactions()
  }

  onFetchHistory = () => {
    const { coin, fetchTransactions, formValues } = this.props
    const from = prop('from', formValues)
    const startDate = prop('start', formValues)
    const endDate = prop('end', formValues)
    const addressDerivations =
      from.derivations &&
      from.derivations.map((derivation) => ({
        address: derivation.xpub,
        type: derivation.type
      }))
    const address = from && (addressDerivations || from.xpub || from.address || from)
    const filename = `${coin}_${startDate.format('MM-DD-YYYY')}_${endDate.format('MM-DD-YYYY')}.csv`
    this.setState({ filename, generating: true })
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

const enhance = compose<any>(
  modalEnhancer(ModalName.TRANSACTION_REPORT_MODAL),
  connect(mapStateToProps, mapDispatchToProps)
)

export default enhance(DownloadTransactionsModal)
