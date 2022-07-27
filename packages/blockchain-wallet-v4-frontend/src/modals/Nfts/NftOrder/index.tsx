import React, { PureComponent } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import styled from 'styled-components'

import { DEFAULT_INVITATIONS } from '@core/model'
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
import ImportNFTs from './ImportNFTs'
import MakeOffer from './MakeOffer'
import MarkForSale from './MarkForSale'
import NotVerified from './NotVerified'
import PurchaseNFTs from './PurchaseNFTs'
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
        doNotHide
        position={position}
        isOpen={show}
        userClickedOutside={userClickedOutside}
        onClose={this.handleClose}
        data-e2e='nftModal'
        total={total}
      >
        {step === NftOrderStepEnum.ACCEPT_OFFER && (
          <StyledFlyoutChild>
            <AcceptOffer {...this.props} close={() => this.handleClose()} />
          </StyledFlyoutChild>
        )}
        {step === NftOrderStepEnum.BUY && (
          <StyledFlyoutChild>
            <Buy {...this.props} close={() => this.handleClose()} />
          </StyledFlyoutChild>
        )}
        {step === NftOrderStepEnum.CANCEL_LISTING && (
          <StyledFlyoutChild>
            <CancelListing {...this.props} close={() => this.handleClose()} />
          </StyledFlyoutChild>
        )}
        {step === NftOrderStepEnum.CANCEL_OFFER && (
          <StyledFlyoutChild>
            <CancelOffer {...this.props} close={() => this.handleClose()} />
          </StyledFlyoutChild>
        )}
        {step === NftOrderStepEnum.MAKE_OFFER && (
          <StyledFlyoutChild>
            <MakeOffer {...this.props} close={() => this.handleClose()} />
          </StyledFlyoutChild>
        )}
        {step === NftOrderStepEnum.MARK_FOR_SALE && (
          <StyledFlyoutChild>
            <MarkForSale {...this.props} close={() => this.handleClose()} />
          </StyledFlyoutChild>
        )}
        {step === NftOrderStepEnum.TRANSFER && (
          <StyledFlyoutChild>
            <Transfer {...this.props} close={() => this.handleClose()} />
          </StyledFlyoutChild>
        )}
        {step === NftOrderStepEnum.NOT_VERIFIED && (
          <StyledFlyoutChild>
            <NotVerified {...this.props} close={() => this.handleClose()} />
          </StyledFlyoutChild>
        )}
        {step === NftOrderStepEnum.STATUS && (
          <StyledFlyoutChild>
            <Status {...this.props} close={() => this.handleClose()} />
          </StyledFlyoutChild>
        )}
        {step === NftOrderStepEnum.IMPORT_NFTS && (
          <StyledFlyoutChild>
            <ImportNFTs {...this.props} close={() => this.handleClose()} />
          </StyledFlyoutChild>
        )}
        {step === NftOrderStepEnum.PURCHASE_NFTS && (
          <StyledFlyoutChild>
            <PurchaseNFTs {...this.props} close={() => this.handleClose()} />
          </StyledFlyoutChild>
        )}
      </Flyout>
    )
  }
}

const mapStateToProps = (state) => ({
  defaultEthAddr: selectors.core.kvStore.eth.getDefaultAddress(state).getOrElse(''),
  isAuthenticated: selectors.auth.isAuthenticated(state),
  isInvited:
    selectors.core.settings.getInvitations(state).getOrElse(DEFAULT_INVITATIONS).nftBuySell ||
    !selectors.auth.isAuthenticated(state),
  openSeaAssetR: selectors.components.nfts.getOpenSeaAsset(state),
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
