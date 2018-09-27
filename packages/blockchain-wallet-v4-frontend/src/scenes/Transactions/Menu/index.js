import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import PropTypes from 'prop-types'
import { isNil } from 'ramda'

import { Remote } from 'blockchain-wallet-v4/src'
import { actions, selectors } from 'data'
import Menu from './template.js'
import { getData as getDataBtcBch } from 'components/Form/SelectBoxBtcAddresses/selectors'

class MenuContainer extends React.PureComponent {
  constructor (props) {
    super(props)
    this.onShowEthPrivateKey = this.onShowEthPrivateKey.bind(this)
    this.handleClickReporting = this.handleClickReporting.bind(this)
  }

  onShowEthPrivateKey (isLegacy) {
    this.props.modalActions.showModal('ShowEthPrivateKey', { isLegacy })
  }

  handleClickReporting () {
    this.props.coin === 'BTC'
      ? this.props.btcActions.reportClicked()
      : this.props.bchActions.reportClicked()
  }

  render () {
    return this.props.data.cata({
      Success: value => {
        const isLegacyEthAddr = !isNil(value && value.legacyEthAddr)
        return (
          <Menu
            coin={this.props.coin}
            handleClickReporting={this.handleClickReporting}
            onShowEthPrivateKey={this.onShowEthPrivateKey}
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

const mapStateToProps = (state, ownProps) => {
  switch (ownProps.coin) {
    case 'ETH':
      return {
        data: Remote.of({
          legacyEthAddr: selectors.core.kvStore.ethereum
            .getLegacyAccountAddress(state)
            .getOrElse(null)
        })
      }
    default:
      return {
        data: getDataBtcBch(state, ownProps.coin)
      }
  }
}

const mapDispatchToProps = dispatch => ({
  btcActions: bindActionCreators(actions.components.btcTransactions, dispatch),
  bchActions: bindActionCreators(actions.components.bchTransactions, dispatch),
  modalActions: bindActionCreators(actions.modals, dispatch)
})

MenuContainer.propTypes = {
  coin: PropTypes.oneOf(['BTC', 'BCH', 'ETH']).isRequired
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MenuContainer)
