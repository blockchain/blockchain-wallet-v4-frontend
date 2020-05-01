import { connect } from 'react-redux'
import { isEmpty, isNil, prop } from 'ramda'
import React, { Component } from 'react'

import { actions } from 'data'
import { getData } from './selectors'
import EthAddresses from './template'

const isValid = item => !isNil(item) && !isEmpty(item)

type StateType = {
  checkSecondPassword: boolean
  showQrCode: boolean
}

export type AddressType = {
  addr: string
  balance: number
  priv: string
}

type LinkStatePropsType = {
  addressInfo: AddressType
  coin: 'ETH'
  isLegacy: boolean
  legacyAddressInfo: AddressType
}

type LinkDispatchPropsType = {
  clearShownEthLegacyPrivateKey: () => void
  clearShownEthPrivateKey: () => void
  fetchLegacyBalance: () => void
  showEthPrivateKey: (isLegacy: boolean) => void
}

export type OwnProps = {
  toggleQrCode: () => void
}

type PropsType = LinkStatePropsType & LinkDispatchPropsType & OwnProps

class EthContainer extends Component<PropsType, StateType> {
  state = {
    checkSecondPassword: false,
    showQrCode: false
  }

  componentDidMount () {
    this.props.isLegacy
      ? this.props.fetchLegacyBalance()
      : this.props.showEthPrivateKey(this.props.isLegacy)
  }

  componentWillUnmount () {
    this.props.clearShownEthPrivateKey()
    this.props.clearShownEthLegacyPrivateKey()
  }

  toggleQrCode = () => {
    if (!this.state.checkSecondPassword) {
      this.props.showEthPrivateKey(this.props.isLegacy)
      this.setState(prevState => ({
        checkSecondPassword: true,
        showQrCode: !prevState.showQrCode
      }))
    } else {
      this.setState(prevState => ({
        showQrCode: !prevState.showQrCode
      }))
    }
  }

  checkQrCode = () => {
    const { addressInfo, isLegacy, legacyAddressInfo } = this.props

    return isLegacy
      ? isValid(prop('priv', legacyAddressInfo)) &&
          isValid(prop('priv', addressInfo))
      : isValid(prop('priv', legacyAddressInfo)) ||
          isValid(prop('priv', addressInfo))
  }

  render () {
    const { addressInfo, coin, isLegacy, legacyAddressInfo } = this.props
    const checkQrCode = this.checkQrCode()

    return (
      <EthAddresses
        addressInfo={addressInfo}
        coin={coin}
        isEth={true}
        isLegacy={isLegacy}
        legacyAddressInfo={legacyAddressInfo}
        showQrCode={this.state.showQrCode && checkQrCode}
        toggleQrCode={this.toggleQrCode}
      />
    )
  }
}

const mapStateToProps = (state, ownProps) => getData(state, ownProps)

const mapDispatchToProps = dispatch => ({
  fetchLegacyBalance: () =>
    dispatch(actions.core.data.eth.fetchLegacyBalance()),
  clearShownEthLegacyPrivateKey: () =>
    dispatch(actions.modules.settings.clearShownEthLegacyPrivateKey()),
  clearShownEthPrivateKey: () =>
    dispatch(actions.modules.settings.clearShownEthPrivateKey()),
  showEthPrivateKey: isLegacy =>
    dispatch(actions.modules.settings.showEthPrivateKey(isLegacy))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EthContainer)
