import React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import {
  getErc20Data,
  getEthData
} from 'blockchain-wallet-v4-frontend/src/components/Form/SelectBoxEthAddresses/selectors'
import { AvailableCoins } from 'blockchain-wallet-v4-frontend/src/scenes/plugin/Send'
import AddressInput from 'blockchain-wallet-v4-frontend/src/scenes/plugin/Send/SelectAddress/AddressInput/template.success'

const Address: React.FC<Props> = (props) => {
  const { data, ...rest } = props

  return data.cata({
    Failure: (message) => <div>{message}</div>,
    Loading: () => <div />,
    NotAsked: () => null,
    Success: (value) => <AddressInput options={value.data} elements={value.data} {...rest} />
  })
}

const mapStateToProps = (state, ownProps) => {
  return ownProps.coin === AvailableCoins.ETH
    ? { data: getEthData(state, ownProps) }
    : { data: getErc20Data(state, ownProps) }
}

const connector = connect(mapStateToProps)

type Props = ConnectedProps<typeof connector>

export default connector(Address)
