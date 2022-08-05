import React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { getData } from 'blockchain-wallet-v4-frontend/src/modals/Eth/SendEth/SecondStep/selectors'

import { BlockchainLoader } from 'blockchain-info-components'

import Success from './template.success'

const SpeedUpPopup: React.FC<Props> = (props) => {
  const { changePopupVisibility, coin, data } = props

  return data.cata({
    Failure: (message) => <>{message}</>,
    Loading: () => <BlockchainLoader height='24px' width='24px' />,
    NotAsked: () => null,
    Success: (value) => (
      <Success coin={coin} changePopupVisibility={changePopupVisibility} {...value} />
    )
  })
}

type OwnProps = {
  changePopupVisibility: () => void
  coin: string
}

const mapStateToProps = (state, props) => ({
  data: getData(state, props.coin)
})

const connector = connect(mapStateToProps)

type Props = OwnProps & ConnectedProps<typeof connector>

export default connect(mapStateToProps)(SpeedUpPopup)
