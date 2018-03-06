import React from 'react'
import { actions } from 'data'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { getData } from './selectors'
import Success from './template.success'
import { Remote } from 'blockchain-wallet-v4/src'

class BitcoinWalletsContainer extends React.Component {
  shouldComponentUpdate (nextProps) {
    return !Remote.Loading.is(nextProps.data)
  }

  render () {
    const { data, ...rest } = this.props
    return (
      data.cata({
        Success: (value) => (
          <Success
            wallets={value}
            handleClick={() => this.props.actions.showModal('AddBitcoinWallet')}
            onUnarchive={(i) => this.props.coreActions.setAccountArchived(i, false)}
            {...rest}
          />
        ),
        Failure: (message) => <div>{message}</div>,
        Loading: () => <div />,
        NotAsked: () => <div />
      })
    )
  }
}

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions.modals, dispatch),
  coreActions: bindActionCreators(actions.core.wallet, dispatch)
})

const mapStateToProps = (state) => ({
  data: getData(state)
})

export default connect(mapStateToProps, mapDispatchToProps)(BitcoinWalletsContainer)
