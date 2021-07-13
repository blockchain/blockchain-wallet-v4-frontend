import React from 'react'
import { connect, ConnectedProps } from 'react-redux'

import { Erc20CoinsEnum } from 'blockchain-wallet-v4/src/types'

import { getErc20Data, getEthData } from './selectors'
import SelectBoxEth from './template'

class SelectBoxEthAddresses extends React.PureComponent<Props> {
  render() {
    const { data, ...rest } = this.props
    return data.cata({
      Success: value => (
        <SelectBoxEth options={value.data} elements={value.data} {...rest} />
      ),
      Failure: message => <div>{message}</div>,
      Loading: () => <div />,
      NotAsked: () => <div />
    })
  }
}

// @ts-ignore
SelectBoxEthAddresses.defaultProps = {
  includeAll: true
}

const mapStateToProps = (state, ownProps) => {
  return ownProps.coin in Erc20CoinsEnum
    ? { data: getErc20Data(state, ownProps) }
    : { data: getEthData(state, ownProps) }
}

const connector = connect(mapStateToProps)

type Props = ConnectedProps<typeof connector>

export default connector(SelectBoxEthAddresses)
