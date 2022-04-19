import React, { PureComponent } from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, compose } from 'redux'

import { getEthBalance } from 'components/Balances/nonCustodial/selectors'
import Flyout, { duration, FlyoutChild } from 'components/Flyout'
import FlyoutHeader from 'components/Flyout/Header'
import { actions, selectors } from 'data'
import { ModalName } from 'data/types'
import modalEnhancer from 'providers/ModalEnhancer'

import { ModalPropsType } from '../../types'
import { getData } from './EthWalletBalances.selectors'

class EthWalletBalance extends PureComponent<Props, State> {
  constructor(props) {
    super(props)
    this.state = {
      show: false
    }
  }

  componentDidMount() {
    // eslint-disable-next-line
    this.setState({ show: true })
  }

  handleClose = () => {
    this.setState({ show: false })
    setTimeout(() => {
      this.props.close()
    }, duration)
  }

  render() {
    const { close, position, total, userClickedOutside } = this.props
    const { show } = this.state

    return (
      <Flyout
        position={position}
        isOpen={show}
        userClickedOutside={userClickedOutside}
        onClose={this.handleClose}
        data-e2e='ethWalletBalanceModal'
        total={total}
      >
        <FlyoutChild>
          <FlyoutHeader data-e2e='closeEthBalances' onClick={() => close()} mode='back'>
            <FormattedMessage id='copy.my_wallet' defaultMessage='My Wallet' />
          </FlyoutHeader>
        </FlyoutChild>
      </Flyout>
    )
  }
}

const mapStateToProps = (state) => ({
  data: getData(state),
  defaultEthAddr: selectors.core.kvStore.eth.getDefaultAddress(state).getOrElse('')
})

const mapDispatchToProps = (dispatch) => ({})

const connector = connect(mapStateToProps, mapDispatchToProps)

type State = {
  show: boolean
}
type OwnProps = ModalPropsType
export type Props = OwnProps & ConnectedProps<typeof connector>

// 👋 Order of composition is important, do not change!
const enhance = compose<any>(
  modalEnhancer(ModalName.ETH_WALLET_BALANCES, { transition: duration }),
  connector
)

export default enhance(EthWalletBalance)
