import React from 'react'
import { connect } from 'react-redux'

import { getData } from './selectors'
import SelectBox from '../SelectBox'

class SelectBoxBitcoinAddresses extends React.PureComponent {
  render () {
    const { data, coin, ...rest } = this.props

    return data.cata({
      Success: (value) => {
        const elements = [{
          group: '',
          items: value.data
        }]

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
