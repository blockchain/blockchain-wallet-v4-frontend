import React from 'react'
import { connect } from 'react-redux'
import { selectors } from 'data'
import { getData } from './selectors'
import Success from './template.success'

class BitcoinAddressesContainer extends React.Component {
  render () {
    const { data, ...rest } = this.props
    return (
      data.cata({
        Success: (value) => <Success wallets={value} {...rest} />,
        Failure: (message) => <div>{message}</div>,
        Loading: () => <div />,
        NotAsked: () => <div />
      })
    )
  }
}

const mapStateToProps = (state) => ({
  data: getData(state),
  defaultAccountIndex: selectors.core.wallet.getDefaultAccountIndex(state)
})

const enhance = connect(mapStateToProps)

export default enhance(BitcoinAddressesContainer)
