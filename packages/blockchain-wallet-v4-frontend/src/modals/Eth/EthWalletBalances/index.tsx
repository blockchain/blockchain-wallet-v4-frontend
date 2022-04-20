import React, { PureComponent } from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { Icon } from '@blockchain-com/constellation'
import { IconRefresh } from '@blockchain-com/icons'
import { bindActionCreators, compose } from 'redux'

import { displayFiatToFiat } from '@core/exchange'
import {
  Button,
  Icon as BlockchainIcon,
  SkeletonRectangle,
  SpinningLoader,
  Text
} from 'blockchain-info-components'
import CoinDisplay from 'components/Display/CoinDisplay'
import FiatDisplay from 'components/Display/FiatDisplay'
import { Flex } from 'components/Flex'
import Flyout, { duration, FlyoutChild, FlyoutWrapper, Row, Value } from 'components/Flyout'
import FlyoutHeader from 'components/Flyout/Header'
import { actions, selectors } from 'data'
import { ModalName } from 'data/types'
import modalEnhancer from 'providers/ModalEnhancer'

import { ModalPropsType } from '../../types'
import { getData } from './EthWalletBalances.selectors'

class EthWalletBalance extends PureComponent<Props, State> {
  constructor(props) {
    super(props)
    this.state = {
      show: false
    }
  }

  componentDidMount() {
    // eslint-disable-next-line
    this.setState({ show: true })
  }

  handleClose = () => {
    this.setState({ show: false })
    setTimeout(() => {
      this.props.close()
    }, duration)
  }

  render() {
    const {
      buySellActions,
      close,
      data,
      ethActions,
      fetchErc20Balances,
      position,
      total,
      userClickedOutside
    } = this.props
    const { show } = this.state

    return (
      <Flyout
        position={position}
        isOpen={show}
        userClickedOutside={userClickedOutside}
        onClose={this.handleClose}
        data-e2e='ethWalletBalanceModal'
        total={total}
      >
        <FlyoutChild>
          <FlyoutHeader data-e2e='closeEthBalances' onClick={() => close()} mode='back'>
            <FormattedMessage id='copy.my_wallet' defaultMessage='My ETH Wallet' />
          </FlyoutHeader>
          <FlyoutWrapper>
            <Flex justifyContent='space-between'>
              <div>
                <Text color='black' size='12px' weight={600}>
                  <FormattedMessage
                    id='copy.your_total_balance'
                    defaultMessage='Your Total Balance'
                  />
                </Text>
                {data.cata({
                  Failure: () => (
                    <Text size='24px' weight={600} color='red'>
                      Error
                    </Text>
                  ),
                  Loading: () => (
                    <div style={{ marginTop: '4px' }}>
                      <SkeletonRectangle height='32px' width='100px' />
                    </div>
                  ),
                  NotAsked: () => (
                    <div style={{ marginTop: '4px' }}>
                      <SkeletonRectangle height='32px' width='100px' />
                    </div>
                  ),
                  Success: ({ total }) => (
                    <Text size='24px' weight={600} color='black'>
                      {displayFiatToFiat({ value: total })}
                    </Text>
                  )
                })}
              </div>
              <Button
                small
                data-e2e='refresh'
                nature='empty-blue'
                onClick={() => {
                  fetchErc20Balances()
                  ethActions.fetchDataLoading()
                  ethActions.fetchData()
                }}
              >
                <Icon label='refresh' size='sm' color='blue600'>
                  <IconRefresh />
                </Icon>
                <span style={{ marginLeft: '4px' }}>
                  <FormattedMessage id='copy.refresh' defaultMessage='Refresh' />
                </span>
              </Button>
            </Flex>
          </FlyoutWrapper>
          {data.cata({
            Failure: () => <>error</>,
            Loading: () => (
              <Flex justifyContent='center'>
                <SpinningLoader height='20px' width='20px' borderWidth='3px' />
              </Flex>
            ),
            NotAsked: () => (
              <Flex justifyContent='center'>
                <SpinningLoader height='20px' width='20px' borderWidth='3px' />
              </Flex>
            ),
            Success: ({ erc20Balances, ethBalance }) => (
              <>
                <Row>
                  <Flex justifyContent='space-between' alignItems='center'>
                    <Flex gap={16} alignItems='center'>
                      <BlockchainIcon size='24px' name='ETH' />
                      <Flex gap={2} flexDirection='column'>
                        <Text color='black' weight={600}>
                          {window.coins.ETH.coinfig.name}
                        </Text>
                        <Text size='14px' color='grey500' weight={500}>
                          {window.coins.ETH.coinfig.displaySymbol} Private Key Wallet
                        </Text>
                      </Flex>
                    </Flex>
                    <Flex gap={2} flexDirection='column'>
                      <Flex justifyContent='flex-end'>
                        <FiatDisplay coin='ETH' color='black' weight={600}>
                          {ethBalance}
                        </FiatDisplay>
                      </Flex>
                      <Flex justifyContent='flex-end'>
                        <CoinDisplay coin='ETH' size='14px' color='grey500' weight={500}>
                          {ethBalance}
                        </CoinDisplay>
                      </Flex>
                    </Flex>
                  </Flex>
                </Row>
                {erc20Balances.map(({ tokenSymbol }) => (
                  <Row key={tokenSymbol}>
                    <Flex justifyContent='space-between' alignItems='center'>
                      <Flex gap={16} alignItems='center'>
                        <BlockchainIcon size='24px' name={tokenSymbol} />
                        <Flex gap={2} flexDirection='column'>
                          <Text color='black' weight={600}>
                            {window.coins[tokenSymbol].coinfig.name}
                          </Text>
                          <Text size='14px' color='grey500' weight={500}>
                            {window.coins[tokenSymbol].coinfig.displaySymbol} Private Key Wallet
                          </Text>
                        </Flex>
                      </Flex>
                      <Flex gap={2} flexDirection='column'>
                        <Flex justifyContent='flex-end'>
                          <FiatDisplay coin={tokenSymbol} color='black' weight={600}>
                            {ethBalance}
                          </FiatDisplay>
                        </Flex>
                        <Flex justifyContent='flex-end'>
                          <CoinDisplay coin={tokenSymbol} size='14px' color='grey500' weight={500}>
                            {ethBalance}
                          </CoinDisplay>
                        </Flex>
                      </Flex>
                    </Flex>
                  </Row>
                ))}
              </>
            )
          })}
          <FlyoutWrapper>
            <Flex gap={8}>
              <Button
                fullwidth
                data-e2e='addFunds'
                nature='primary'
                onClick={() => {
                  buySellActions.showModal({
                    cryptoCurrency: 'ETH',
                    orderType: 'BUY',
                    origin: 'Nfts'
                  })
                }}
              >
                <FormattedMessage id='buttons.add_funds' defaultMessage='Add Funds' />
              </Button>
            </Flex>
          </FlyoutWrapper>
        </FlyoutChild>
      </Flyout>
    )
  }
}

const mapStateToProps = (state) => ({
  data: getData(state),
  defaultEthAddr: selectors.core.kvStore.eth.getDefaultAddress(state).getOrElse('')
})

const mapDispatchToProps = (dispatch) => ({
  buySellActions: bindActionCreators(actions.components.buySell, dispatch),
  ethActions: bindActionCreators(actions.core.data.eth, dispatch),
  fetchErc20Balances: bindActionCreators(actions.core.data.eth.fetchErc20Data, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type State = {
  show: boolean
}
type OwnProps = ModalPropsType
export type Props = OwnProps & ConnectedProps<typeof connector>

// 👋 Order of composition is important, do not change!
const enhance = compose<any>(
  modalEnhancer(ModalName.ETH_WALLET_BALANCES, { transition: duration }),
  connector
)

export default enhance(EthWalletBalance)
