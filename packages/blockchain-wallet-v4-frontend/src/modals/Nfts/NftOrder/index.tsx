import React, { PureComponent } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, compose } from 'redux'

import Flyout, { duration, FlyoutChild } from 'components/Flyout'
import { actions, selectors } from 'data'
import { NftOrderStepEnum } from 'data/components/nfts/types'
import { ModalName } from 'data/types'
import modalEnhancer from 'providers/ModalEnhancer'

import { ModalPropsType } from '../../types'
// import NftConfirmBuy from './ConfirmBuy'
import ShowAsset from './ShowAsset'

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

  componentWillUnmount() {
    this.setStep(NftOrderStepEnum.SHOW_ASSET)
  }

  setStep = (step: NftOrderStepEnum) => {
    // TODO
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
        {step === NftOrderStepEnum.SHOW_ASSET && (
          <FlyoutChild>
            <ShowAsset {...this.props} />
          </FlyoutChild>
        )}
        {/* {step === NftOrderStepEnum.CONFIRM_BUY && (
          <FlyoutChild>
            <NftConfirmBuy {...this.props} />
          </FlyoutChild>
        )} */}
      </Flyout>
    )
  }
}

const mapStateToProps = (state) => ({
  orderFlow: selectors.components.nfts.getOrderFlow(state)
})

const mapDispatchToProps = (dispatch) => ({
  nftActions: bindActionCreators(actions.components.nfts, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type State = {
  show: boolean
}
type OwnProps = ModalPropsType
export type Props = OwnProps & ConnectedProps<typeof connector>

// 👋 Order of composition is important, do not change!
const enhance = compose<any>(
  modalEnhancer(ModalName.NFT_ORDER, { transition: duration }),
  connector
)

export default enhance(NftOrder)
