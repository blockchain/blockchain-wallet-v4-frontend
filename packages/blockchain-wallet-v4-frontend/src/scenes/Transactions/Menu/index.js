import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import PropTypes from 'prop-types'
import { isNil } from 'ramda'

import { actions } from 'data'
import { getData } from './selectors'
import Menu from './template.js'

class MenuContainer extends React.PureComponent {
  onShowPrivateKey = () => {
    const { coin, modalActions } = this.props

    if (coin === 'ETH')
      modalActions.showModal('ShowEthPrivateKey', { isLegacy: false })
    if (coin === 'XLM') modalActions.showModal('ShowXlmPrivateKey')
  }

  onShowEthPrivateKeyLegacy = () => {
    this.props.modalActions.showModal('ShowEthPrivateKey', { isLegacy: true })
  }

  handleClickReporting = () => {
    const { coin } = this.props
    if (coin === 'BTC') this.props.btcActions.reportClicked()
    if (coin === 'BCH') this.props.bchActions.reportClicked()
  }

  render () {
    return this.props.data.cata({
      Success: value => {
        const isLegacyEthAddr = !isNil(value && value.legacyEthAddr)
        return (
          <Menu
            accounts={value.data}
            coin={this.props.coin}
            handleClickReporting={this.handleClickReporting}
            onShowPrivateKey={this.onShowPrivateKey}
            onShowEthPrivateKeyLegacy={this.onShowEthPrivateKeyLegacy}
            isLegacyEthAddr={isLegacyEthAddr}
          />
        )
      },
      Failure: () => <div />,
      Loading: () => <div />,
      NotAsked: () => <div />
    })
  }
}

const mapDispatchToProps = dispatch => ({
  btcActions: bindActionCreators(actions.components.btcTransactions, dispatch),
  bchActions: bindActionCreators(actions.components.bchTransactions, dispatch),
  modalActions: bindActionCreators(actions.modals, dispatch)
})

MenuContainer.propTypes = {
  coin: PropTypes.oneOf(['BTC', 'BCH', 'ETH', 'XLM']).isRequired
}

export default connect(
  getData,
  mapDispatchToProps
)(MenuContainer)
