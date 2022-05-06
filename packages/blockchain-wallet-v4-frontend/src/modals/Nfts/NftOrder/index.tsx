import React, { PureComponent } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import styled from 'styled-components'

import Flyout, { duration, FlyoutChild } from 'components/Flyout'
import { actions, selectors } from 'data'
import { NftOrderStepEnum } from 'data/components/nfts/types'
import { ModalName } from 'data/types'
import modalEnhancer from 'providers/ModalEnhancer'

import { ModalPropsType } from '../../types'
import AcceptOffer from './AcceptOffer'
import Buy from './Buy'
import CancelListing from './CancelListing'
import CancelOffer from './CancelOffer'
import MakeOffer from './MakeOffer'
import MarkForSale from './MarkForSale'
import NotVerified from './NotVerified'
import Status from './Status'
import Transfer from './Transfer'

const StyledFlyoutChild = styled(FlyoutChild)`
  display: flex;
  flex-direction: column;
`

class NftOrder extends PureComponent<Props, State> {
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
      this.props.nftActions.nftOrderFlowClose()
    }, duration)
  }

  render() {
    const { orderFlow, position, total, userClickedOutside } = this.props
    const { step } = orderFlow
    const { show } = this.state

    return (
      <Flyout
        position={position}
        isOpen={show}
        userClickedOutside={userClickedOutside}
        onClose={this.handleClose}
        data-e2e='nftModal'
        total={total}
      >
        {step === NftOrderStepEnum.BUY && (
          <StyledFlyoutChild>
            <Buy {...this.props} />
          </StyledFlyoutChild>
        )}
        {step === NftOrderStepEnum.MARK_FOR_SALE && (
          <StyledFlyoutChild>
            <MarkForSale {...this.props} />
          </StyledFlyoutChild>
        )}
        {step === NftOrderStepEnum.ACCEPT_OFFER && (
          <StyledFlyoutChild>
            <AcceptOffer {...this.props} />
          </StyledFlyoutChild>
        )}
        {step === NftOrderStepEnum.MAKE_OFFER && (
          <StyledFlyoutChild>
            <MakeOffer {...this.props} />
          </StyledFlyoutChild>
        )}
        {step === NftOrderStepEnum.CANCEL_OFFER && (
          <StyledFlyoutChild>
            <CancelOffer {...this.props} />
          </StyledFlyoutChild>
        )}
        {step === NftOrderStepEnum.CANCEL_LISTING && (
          <StyledFlyoutChild>
            <CancelListing {...this.props} />
          </StyledFlyoutChild>
        )}
        {step === NftOrderStepEnum.TRANSFER && (
          <StyledFlyoutChild>
            <Transfer {...this.props} />
          </StyledFlyoutChild>
        )}
        {step === NftOrderStepEnum.STATUS && (
          <StyledFlyoutChild>
            <Status {...this.props} {...orderFlow.asset} />
          </StyledFlyoutChild>
        )}
        {step === NftOrderStepEnum.NOT_VERIFIED && (
          <StyledFlyoutChild>
            <NotVerified {...this.props} {...orderFlow.asset} />
          </StyledFlyoutChild>
        )}
      </Flyout>
    )
  }
}

const mapStateToProps = (state) => ({
  defaultEthAddr: selectors.core.kvStore.eth.getDefaultAddress(state).getOrElse(''),
  isAuthenticated: selectors.auth.isAuthenticated(state),
  orderFlow: selectors.components.nfts.getOrderFlow(state)
})

const mapDispatchToProps = (dispatch) => ({
  buySellActions: bindActionCreators(actions.components.buySell, dispatch),
  nftActions: bindActionCreators(actions.components.nfts, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type State = {
  show: boolean
}
type OwnProps = ModalPropsType
export type Props = OwnProps & ConnectedProps<typeof connector>

const enhance = compose(
  modalEnhancer(ModalName.NFT_ORDER, {
    fixed: true,
    transition: duration
  }),
  connector
)

export default enhance(NftOrder)
