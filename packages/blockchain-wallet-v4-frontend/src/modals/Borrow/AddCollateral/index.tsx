import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, compose, Dispatch } from 'redux'

import {
  CoinType,
  LoanType,
  OfferType,
  PaymentValue,
  RatesType,
  RemoteDataType
} from 'blockchain-wallet-v4/src/types'
import DataError from 'components/DataError'
import { actions } from 'data'
import { BorrowMinMaxType } from 'data/types'

import { getData } from './selectors'
import Loading from './template.loading'
import Success from './template.success'

export type OwnProps = {
  handleClose: () => void
  loan: LoanType
  offer: OfferType
}

export type LinkDispatchPropsType = {
  borrowActions: typeof actions.components.borrow
}

export type SuccessStateType = {
  coin: CoinType
  limits: BorrowMinMaxType
  payment: PaymentValue
  rates: RatesType
}

type LinkStatePropsType = {
  data: RemoteDataType<string | Error, SuccessStateType>
}

type Props = OwnProps & LinkDispatchPropsType & LinkStatePropsType
export type State = { isAddrCopied: boolean; showQrCode: boolean }
class BorrowForm extends PureComponent<Props, State> {
  constructor(props) {
    super(props)
    this.state = { isAddrCopied: false, showQrCode: false }
  }

  componentDidMount() {
    this.props.borrowActions.initializeBorrow('BTC')
  }

  componentWillUnmount() {
    this.props.borrowActions.destroy()
  }

  handleRefresh = () => {
    this.props.borrowActions.initializeBorrow('BTC')
  }

  handleSubmit = () => {
    this.props.borrowActions.addCollateral()
  }

  copyAddress = () => {
    const input = document.createElement('input')
    // TODO: Borrow make dynamic
    input.setAttribute('value', this.props.loan.collateral.depositAddresses.BTC)
    document.body.appendChild(input)
    input.select()
    const result = document.execCommand('copy')
    document.body.removeChild(input)
    this.setState({ isAddrCopied: true })
    setTimeout(() => {
      this.setState({ isAddrCopied: false })
    }, 2000)
    return result
  }

  toggleQrCode = () => {
    this.setState((prevState) => ({ showQrCode: !prevState.showQrCode }))
  }

  render() {
    const { data } = this.props

    return data.cata({
      Failure: () => <DataError onClick={this.handleRefresh} />,
      Loading: () => <Loading />,
      NotAsked: () => <Loading />,
      Success: (val) => (
        <Success
          {...val}
          {...this.props}
          {...this.state}
          onSubmit={this.handleSubmit}
          onCopyAddress={this.copyAddress}
          onToggleQrCode={this.toggleQrCode}
        />
      )
    })
  }
}

const mapStateToProps = (state): LinkStatePropsType => ({
  data: getData(state)
})

const mapDispatchToProps = (dispatch: Dispatch): LinkDispatchPropsType => ({
  borrowActions: bindActionCreators(actions.components.borrow, dispatch)
})

const enhance = compose(connect(mapStateToProps, mapDispatchToProps))

export default enhance(BorrowForm)
