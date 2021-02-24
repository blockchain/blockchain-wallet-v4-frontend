import { bindActionCreators } from 'redux'
import { connect, ConnectedProps } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import React from 'react'

import { actions, selectors } from 'data'
import {
  CoinType,
  RemoteDataType,
  SupportedWalletCurrenciesType
} from 'core/types'
import { FlatLoader, Text } from 'blockchain-info-components'
import { Remote } from 'blockchain-wallet-v4/src'
import { RowHeader } from '../../components'
import ComboDisplay from 'components/Display/ComboDisplay'

class TransactionFee extends React.PureComponent<Props> {
  componentDidMount () {
    const { coin, feeR, hash, supportedCoins } = this.props
    if (Remote.NotAsked.is(feeR) && supportedCoins[coin].contractAddress) {
      this.props.ethActions.fetchErc20TxFee(hash, coin)
    }
  }

  render () {
    const { coin, feeR, supportedCoins } = this.props

    return (
      <React.Fragment>
        <RowHeader>
          <FormattedMessage
            id='copy.transaction_fee'
            defaultMessage='Transaction Fee'
          />
        </RowHeader>
        {feeR.cata({
          Success: value => (
            <ComboDisplay
              coin={supportedCoins[coin].contractAddress ? 'ETH' : coin}
              size='14px'
              weight={600}
              color='grey800'
            >
              {value}
            </ComboDisplay>
          ),
          Failure: () => (
            <Text size='14px' weight={500} color='red600'>
              <FormattedMessage
                id='scenes.transactions.bitcoin.content.pages.listitem.fee.error'
                defaultMessage='Failed to retrieve fee!'
              />
            </Text>
          ),
          Loading: () => <FlatLoader width='60px' height='16px' />,
          NotAsked: () => <FlatLoader width='60px' height='16px' />
        })}
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => ({
  supportedCoins: selectors.core.walletOptions
    .getSupportedCoins(state)
    .getOrElse({} as SupportedWalletCurrenciesType)
})

const mapDispatchToProps = dispatch => ({
  ethActions: bindActionCreators(actions.core.data.eth, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type OwnProps = {
  coin: CoinType
  feeR: RemoteDataType<any, number>
  hash: string
}
type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(TransactionFee)
