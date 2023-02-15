import React, { PureComponent } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, compose, Dispatch } from 'redux'

import { CoinType, FiatType } from '@core/types'
import Flyout, { duration, FlyoutChild } from 'components/Flyout'
import { actions, selectors } from 'data'
import { RootState } from 'data/rootReducer'
import { EarnStepMetaData, InterestStep, ModalName } from 'data/types'
import modalEnhancer from 'providers/ModalEnhancer'

import { ModalPropsType } from '../../types'
import NoBalance from '../NoBalance'
import AccountSummary from './AccountSummary'
import DepositForm from './DepositForm'
import WithdrawalForm from './WithdrawalForm'

class Interest extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { show: false, showSupplyInformation: false }
  }

  componentDidMount() {
    /* eslint-disable */
    this.setState({ show: true })
    /* eslint-enable */
    this.props.fetchEarnEDDStatus()
  }

  handleClose = () => {
    this.setState({ show: false })
    setTimeout(() => {
      this.props.close(ModalName.INTEREST_MODAL)
    }, duration)
  }

  handleBSClick = (coin: CoinType) => {
    this.setState({ show: false })
    this.props.close(ModalName.INTEREST_MODAL)
    setTimeout(() => {
      this.props.buySellActions.showModal({
        cryptoCurrency: coin,
        orderType: 'BUY',
        origin: 'EarnPage'
      })
    }, duration / 2)
  }

  showSupply = (show: boolean) => {
    this.setState({
      showSupplyInformation: show
    })
  }

  render() {
    const { coin, position, step, total, walletCurrency } = this.props
    return (
      <Flyout
        position={position}
        isOpen={this.state.show}
        userClickedOutside={this.props.userClickedOutside}
        onClose={this.handleClose}
        data-e2e='interestModal'
        total={total}
      >
        {step.name === 'NO_BALANCE' && (
          <FlyoutChild>
            <NoBalance handleClose={this.handleClose} walletCurrency={walletCurrency} />
          </FlyoutChild>
        )}
        {step.name === 'ACCOUNT_SUMMARY' && (
          <FlyoutChild>
            <AccountSummary
              handleClose={this.handleClose}
              handleBSClick={() => this.handleBSClick(coin)}
              stepMetadata={step.data}
              coin={coin}
              walletCurrency={walletCurrency}
              showSupply={this.state.showSupplyInformation}
            />
          </FlyoutChild>
        )}
        {step.name === 'DEPOSIT' && (
          <FlyoutChild>
            <DepositForm
              coin={coin}
              walletCurrency={walletCurrency}
              setShowSupply={this.showSupply}
            />
          </FlyoutChild>
        )}
        {step.name === 'WITHDRAWAL' && (
          <FlyoutChild>
            <WithdrawalForm
              coin={coin}
              walletCurrency={walletCurrency}
              setShowSupply={this.showSupply}
            />
          </FlyoutChild>
        )}
      </Flyout>
    )
  }
}

const mapStateToProps = (state: RootState): LinkStatePropsType => ({
  coin: selectors.components.interest.getCoinType(state),
  step: selectors.components.interest.getRewardsStep(state),
  walletCurrency: selectors.core.settings.getCurrency(state).getOrElse('USD')
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  buySellActions: bindActionCreators(actions.components.buySell, dispatch),
  fetchEarnEDDStatus: () => dispatch(actions.components.interest.fetchEDDStatus()),
  interestActions: bindActionCreators(actions.components.interest, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type OwnProps = ModalPropsType
type LinkStatePropsType = {
  coin: CoinType
  step: {
    data: EarnStepMetaData
    name: InterestStep
  }
  walletCurrency: FiatType
}

type State = { show: boolean; showSupplyInformation: boolean }
type Props = OwnProps & ConnectedProps<typeof connector>

const enhance = compose(
  modalEnhancer(ModalName.INTEREST_MODAL, { transition: duration }),
  connector
)

export default enhance(Interest)
