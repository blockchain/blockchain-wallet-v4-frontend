import React from 'react'
import { actions } from 'data'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { getData } from './selectors'
import Success from './template.success'
import { Remote } from 'blockchain-wallet-v4/src'
import { formValueSelector } from 'redux-form'
import DataError from 'components/DataError'

class BitcoinWalletsContainer extends React.Component {
  constructor (props) {
    super(props)
    this.onRefresh = this.onRefresh.bind(this)
  }

  shouldComponentUpdate (nextProps) {
    return !Remote.Loading.is(nextProps.data)
  }

  onRefresh () {
    this.props.actions.fetchData(this.props.context)
  }

  render () {
    const { search, data, ...rest } = this.props

    return (
      data.cata({
        Success: (value) => (
          <Success
            wallets={value}
            search={search && search.toLowerCase()}
            onUnarchive={(i) => this.props.coreActions.setAccountArchived(i, false)}
            handleClick={() => this.props.modalActions.showModal('AddBitcoinWallet', { wallets: value })}
            {...rest}
          />
        ),
        Failure: (message) => <DataError onClick={this.onRefresh}>{message}</DataError>,
        Loading: () => <div />,
        NotAsked: () => <div />
      })
    )
  }
}

const mapDispatchToProps = (dispatch) => ({
  modalActions: bindActionCreators(actions.modals, dispatch),
  coreActions: bindActionCreators(actions.core.wallet, dispatch),
  actions: bindActionCreators(actions.core.data.bitcoin, dispatch)
})

const mapStateToProps = (state) => ({
  data: getData(state),
  search: formValueSelector('settingsAddresses')(state, 'search')
})

export default connect(mapStateToProps, mapDispatchToProps)(BitcoinWalletsContainer)
