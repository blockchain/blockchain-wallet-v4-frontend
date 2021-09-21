import React from 'react'
import { connect, ConnectedProps } from 'react-redux'

import { getErc20Data, getEthData } from './selectors'
import SelectBoxEth from './template'

class SelectBoxEthAddresses extends React.PureComponent<Props> {
  render() {
    const { data, ...rest } = this.props
    return data.cata({
      Failure: (message) => 'here',
      Loading: () => <div />,
      NotAsked: () => <div />,
      Success: (value) => <SelectBoxEth options={value.data} elements={value.data} {...rest} />
    })
  }
}

// @ts-ignore
SelectBoxEthAddresses.defaultProps = {
  includeAll: true
}

const mapStateToProps = (state, ownProps) => {
  return ownProps.coin === 'ETH'
    ? { data: getEthData(state, ownProps) }
    : { data: getErc20Data(state, ownProps) }
}

const connector = connect(mapStateToProps)

type Props = ConnectedProps<typeof connector>

export default connector(SelectBoxEthAddresses)
