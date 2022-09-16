import React, { PureComponent } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, compose, Dispatch } from 'redux'

import { CoinType, FiatType } from '@core/types'
import Flyout, { duration, FlyoutChild } from 'components/Flyout'
import { actions, selectors } from 'data'
import { RootState } from 'data/rootReducer'
import { InterestStepMetadata, ModalName, StakingStep } from 'data/types'
import modalEnhancer from 'providers/ModalEnhancer'

import { ModalPropsType } from '../types'
import Warning from './Warning'
import DepositForm from './DepositForm'

class Staking extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { show: false, showSupplyInformation: false }
  }

  componentDidMount() {
    /* eslint-disable */
    this.setState({ show: true })
    /* eslint-enable */
    this.props.fetchInterestEDDStatus()
  }

  handleClose = () => {
    this.setState({ show: false })
    setTimeout(() => {
      this.props.close(ModalName.STAKING_MODAL)
    }, duration)
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
        {step.name === 'WARNING' && (
          <FlyoutChild>
            <Warning handleClose={this.handleClose} coin={coin} walletCurrency={walletCurrency} />
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
      </Flyout>
    )
  }
}

const mapStateToProps = (state: RootState): LinkStatePropsType => ({
  coin: selectors.components.interest.getCoinType(state),
  step: selectors.components.interest.getStakingStep(state),
  walletCurrency: selectors.core.settings.getCurrency(state).getOrElse('USD')
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  buySellActions: bindActionCreators(actions.components.buySell, dispatch),
  fetchInterestEDDStatus: () => dispatch(actions.components.interest.fetchEDDStatus()),
  interestActions: bindActionCreators(actions.components.interest, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type OwnProps = ModalPropsType
type LinkStatePropsType = {
  coin: CoinType
  step: {
    data: InterestStepMetadata
    name: StakingStep
  }
  walletCurrency: FiatType
}

type State = { show: boolean; showSupplyInformation: boolean }
type Props = OwnProps & ConnectedProps<typeof connector>

const enhance = compose(modalEnhancer(ModalName.STAKING_MODAL, { transition: duration }), connector)

export default enhance(Staking)
