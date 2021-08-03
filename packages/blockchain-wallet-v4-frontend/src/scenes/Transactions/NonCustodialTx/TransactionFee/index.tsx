import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators } from 'redux'

import { FlatLoader, Text } from 'blockchain-info-components'
import { Remote } from 'blockchain-wallet-v4/src'
import { CoinType, RemoteDataType } from 'blockchain-wallet-v4/src/types'
import ComboDisplay from 'components/Display/ComboDisplay'
import { actions } from 'data'

import { RowHeader } from '../../components'

class TransactionFee extends React.PureComponent<Props> {
  componentDidMount() {
    const { coin, feeR, hash } = this.props
    const { coinfig } = window.coins[coin]

    if (Remote.NotAsked.is(feeR) && coinfig.type.erc20Address) {
      this.props.ethActions.fetchErc20TxFee(hash, coin)
    }
  }

  render() {
    const { coin, feeR } = this.props
    const { coinfig } = window.coins[coin]

    return (
      <>
        <RowHeader>
          <FormattedMessage id='copy.transaction_fee' defaultMessage='Transaction Fee' />
        </RowHeader>
        {feeR.cata({
          Failure: () => (
            <Text size='14px' weight={500} color='red600'>
              <FormattedMessage
                id='scenes.transactions.bitcoin.content.pages.listitem.fee.error'
                defaultMessage='Failed to retrieve fee!'
              />
            </Text>
          ),
          Loading: () => <FlatLoader width='60px' height='16px' />,
          NotAsked: () => <FlatLoader width='60px' height='16px' />,
          Success: (value) => (
            <ComboDisplay
              coin={coinfig.type.erc20Address ? 'ETH' : coin}
              size='14px'
              weight={600}
              color='grey800'
            >
              {value}
            </ComboDisplay>
          )
        })}
      </>
    )
  }
}

const mapDispatchToProps = (dispatch) => ({
  ethActions: bindActionCreators(actions.core.data.eth, dispatch)
})

const connector = connect(undefined, mapDispatchToProps)

type OwnProps = {
  coin: CoinType
  feeR: RemoteDataType<any, number>
  hash: string
}
type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(TransactionFee)
