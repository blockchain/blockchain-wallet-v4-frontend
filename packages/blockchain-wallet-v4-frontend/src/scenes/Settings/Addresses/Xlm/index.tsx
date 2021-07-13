import React, { Component } from 'react'
import { connect } from 'react-redux'
import { isEmpty, isNil, prop } from 'ramda'

import { actions } from 'data'

import { getData } from './selectors'
import XlmAddresses from './template'

const isValid = item => !isNil(item) && !isEmpty(item)

type StateType = {
  hasCheckedSecondPassword: boolean
  showQrCode: boolean
}

export type AddressType = {
  addr: string
  balance: number
  priv: string
}

type LinkStatePropsType = {
  addressInfo: AddressType
  coin: 'XLM'
  isLegacy: boolean
}

type LinkDispatchPropsType = {
  clearShownXlmPrivateKey: () => void
  fetchLegacyBalance: () => void
  showXlmPrivateKey: () => void
}

export type OwnProps = {
  toggleQrCode: () => void
}

type PropsType = LinkStatePropsType & LinkDispatchPropsType & OwnProps

class XlmContainer extends Component<PropsType, StateType> {
  state = {
    hasCheckedSecondPassword: false,
    showQrCode: false
  }

  componentWillUnmount() {
    this.props.clearShownXlmPrivateKey()
  }

  toggleQrCode = () => {
    if (this.state.hasCheckedSecondPassword) {
      this.setState(prevState => ({
        showQrCode: !prevState.showQrCode
      }))
    } else {
      this.props.showXlmPrivateKey()
      this.setState(prevState => ({
        hasCheckedSecondPassword: true,
        showQrCode: !prevState.showQrCode
      }))
    }
  }

  render() {
    const { addressInfo, coin } = this.props
    const checkQrCode = isValid(prop('priv', addressInfo))

    return (
      <XlmAddresses
        addressInfo={addressInfo}
        coin={coin}
        showQrCode={this.state.showQrCode && checkQrCode}
        toggleQrCode={this.toggleQrCode}
      />
    )
  }
}

const mapStateToProps = (state, ownProps) => getData(state, ownProps)

const mapDispatchToProps = dispatch => ({
  clearShownXlmPrivateKey: () =>
    dispatch(actions.modules.settings.clearShownXlmPrivateKey()),
  fetchLegacyBalance: () =>
    dispatch(actions.core.data.eth.fetchLegacyBalance()),
  showXlmPrivateKey: () =>
    dispatch(actions.modules.settings.showXlmPrivateKey())
})

export default connect(mapStateToProps, mapDispatchToProps)(XlmContainer)
