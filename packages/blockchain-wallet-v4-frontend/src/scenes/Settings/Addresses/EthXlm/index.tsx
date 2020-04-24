import { connect } from 'react-redux'
import { isEmpty, isNil, prop } from 'ramda'
import React, { Component } from 'react'

import { actions } from 'data'
import { getData } from './selectors'
import EthXlmAddresses from './template'

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
  coin: 'xlm' | 'eth'
  eth: {
    addressInfo: AddressType
    legacyAddressInfo: AddressType
  }
  isLegacy: boolean
  xlm: {
    addressInfo: AddressType
  }
}

type LinkDispatchPropsType = {
  clearShownEthLegacyPrivateKey: () => void
  clearShownEthPrivateKey: () => void
  clearShownXlmPrivateKey: () => void
  fetchLegacyBalance: () => void
  showEthPrivateKey: (isLegacy: boolean) => void
  showXlmPrivateKey: () => void
}

export type OwnProps = {
  toggleQrCode: () => void
}

type PropsType = LinkStatePropsType & LinkDispatchPropsType & OwnProps

class EthXlmContainer extends Component<PropsType, StateType> {
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
    this.props.clearShownXlmPrivateKey()
  }

  toggleQrCode = () => {
    if (!this.state.checkSecondPassword) {
      this.props.coin === 'xlm'
        ? this.props.showXlmPrivateKey()
        : this.props.showEthPrivateKey(this.props.isLegacy)

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

  checkQrCodeEth = () => {
    const {
      isLegacy,
      eth: { legacyAddressInfo, addressInfo }
    } = this.props

    return isLegacy
      ? isValid(prop('priv', legacyAddressInfo)) &&
          isValid(prop('priv', addressInfo))
      : isValid(prop('priv', legacyAddressInfo)) ||
          isValid(prop('priv', addressInfo))
  }

  checkQrCodeXLM = () => {
    const {
      xlm: { addressInfo }
    } = this.props
    return isValid(prop('priv', addressInfo))
  }

  render () {
    const { coin, isLegacy } = this.props
    const isEth = coin === 'eth'
    const checkQrCode = isEth ? this.checkQrCodeEth() : this.checkQrCodeXLM()
    const addressInfo = this.props[this.props.coin].addressInfo

    return (
      <EthXlmAddresses
        addressInfo={addressInfo}
        coin={coin}
        isEth={isEth}
        isLegacy={isLegacy}
        legacyAddressInfo={this.props.eth.legacyAddressInfo}
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
  clearShownXlmPrivateKey: () =>
    dispatch(actions.modules.settings.clearShownXlmPrivateKey()),
  showEthPrivateKey: isLegacy =>
    dispatch(actions.modules.settings.showEthPrivateKey(isLegacy)),
  showXlmPrivateKey: isLegacy =>
    dispatch(actions.modules.settings.showXlmPrivateKey(isLegacy))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EthXlmContainer)
