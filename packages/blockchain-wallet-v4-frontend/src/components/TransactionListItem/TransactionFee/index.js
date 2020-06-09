import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import React from 'react'

import { actions, selectors } from 'data'
import { FlatLoader, Text } from 'blockchain-info-components'
import { Remote } from 'blockchain-wallet-v4/src'
import ComboDisplay from 'components/Display/ComboDisplay'

class TransactionFee extends React.PureComponent {
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
        <Text
          size='14px'
          weight={500}
          style={{ marginBottom: '5px', marginTop: '15px' }}
        >
          <FormattedMessage
            id='scenes.transactions.bitcoin.content.pages.listitem.fee.label'
            defaultMessage='Transaction Fee'
          />
        </Text>
        {feeR.cata({
          Success: value => (
            <ComboDisplay
              coin={supportedCoins[coin].contractAddress ? 'ETH' : coin}
              size='14px'
              weight={400}
            >
              {value}
            </ComboDisplay>
          ),
          Failure: () => (
            <Text size='12px' weight={400} color='red600'>
              <FormattedMessage
                id='scenes.transactions.bitcoin.content.pages.listitem.fee.error'
                defaultMessage='Failed to retrieve fee!'
              />
            </Text>
          ),
          Loading: () => <FlatLoader width='60px' height='15px' />,
          NotAsked: () => <FlatLoader width='60px' height='15px' />
        })}
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => ({
  supportedCoins: selectors.core.walletOptions
    .getSupportedCoins(state)
    .getOrFail()
})

const mapDispatchToProps = dispatch => ({
  ethActions: bindActionCreators(actions.core.data.eth, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(TransactionFee)
