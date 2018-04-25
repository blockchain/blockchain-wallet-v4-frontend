import React from 'react'
import { connect } from 'react-redux'
import { concat } from 'ramda'

import { getData } from './selectors'
import SelectBox from '../SelectBox'

class SelectBoxBitcoinAddresses extends React.PureComponent {
  concatAll (coin) {
    return concat([{ group: '', items: [{ value: 'all', text: `My Bitcoin${coin === 'BCH' ? ' Cash' : ''} Wallets` }] }])
  }
  render () {
    const { data, coin, ...rest } = this.props

    return data.cata({
      Success: (value) => {
        const wallets = [{
          group: '',
          items: value.data
        }]
        const elements = includeAll ? this.concatAll(coin)(wallets) : wallets

        return <SelectBox elements={elements} {...rest} />
      },
      Failure: (message) => <div>{message}</div>,
      Loading: () => <div />,
      NotAsked: () => <div />
    })
  }
}

const mapStateToProps = (state, ownProps) => ({
  data: getData(state, ownProps.coin)
})

export default connect(mapStateToProps)(SelectBoxBitcoinAddresses)
