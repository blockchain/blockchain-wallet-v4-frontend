import React, { PureComponent } from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { IconRefresh, PaletteColors } from '@blockchain-com/constellation'
import { bindActionCreators, compose } from 'redux'
import styled from 'styled-components'

import { fiatToString } from '@core/exchange/utils'
import {
  Button,
  Icon as BlockchainIcon,
  SkeletonCircle,
  SkeletonRectangle,
  Text
} from 'blockchain-info-components'
import DataError from 'components/DataError'
import CoinDisplay from 'components/Display/CoinDisplay'
import FiatDisplay from 'components/Display/FiatDisplay'
import { Flex } from 'components/Flex'
import Flyout, { duration, FlyoutChild, FlyoutWrapper, Row } from 'components/Flyout'
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
    this.refresh()
  }

  handleClose = () => {
    this.setState({ show: false })
    setTimeout(() => {
      this.props.close()
    }, duration)
  }

  refresh = () => {
    this.props.fetchErc20Balances()
    this.props.ethActions.fetchDataLoading()
    this.props.ethActions.fetchData()
  }

  render() {
    const { buySellActions, close, data, position, total, userClickedOutside } = this.props
    const { show } = this.state
    const SkeletonLoader = styled.div`
      display: flex;
      flex-direction: row;
      align-items: center;
      width: 100%;
      margin: 12px 0;
      > div:last-child {
        flex: 1;
        margin-left: 16px;
      }
    `
    const Wrapper = styled.div`
      margin: 1em 1.5em;
    `
    const TopLoader = () => (
      <>
        <Flex alignItems='center' flexDirection='column' gap={8}>
          <SkeletonRectangle height='40px' width='180px' />
          <SkeletonRectangle height='40px' width='180px' />
        </Flex>
      </>
    )

    const BottomLoader = () => (
      <Wrapper>
        <SkeletonLoader>
          <SkeletonCircle height='32px' width='32px' />
          <SkeletonRectangle height='40px' width='80%' />
        </SkeletonLoader>
        <SkeletonLoader>
          <SkeletonCircle height='32px' width='32px' />
          <SkeletonRectangle height='40px' width='80%' />
        </SkeletonLoader>
        <SkeletonLoader>
          <SkeletonCircle height='32px' width='32px' />
          <SkeletonRectangle height='40px' width='80%' />
        </SkeletonLoader>
        <SkeletonLoader>
          <SkeletonCircle height='32px' width='32px' />
          <SkeletonRectangle height='40px' width='80%' />
        </SkeletonLoader>
      </Wrapper>
    )
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
                {data.cata({
                  Failure: () => (
                    <Text size='24px' weight={600} color='red'>
                      Error
                    </Text>
                  ),
                  Loading: () => (
                    <div style={{ marginTop: '4px' }}>
                      <TopLoader />
                    </div>
                  ),
                  NotAsked: () => (
                    <div style={{ marginTop: '4px' }}>
                      <TopLoader />
                    </div>
                  ),
                  Success: ({ currency, total }) => (
                    <>
                      <Text color='black' size='12px' weight={600}>
                        <FormattedMessage
                          id='copy.your_total_balance'
                          defaultMessage='Your Total Balance'
                        />
                      </Text>
                      <Text size='24px' weight={600} color='black'>
                        {fiatToString({ unit: currency, value: total })}
                      </Text>
                    </>
                  )
                })}
              </div>
              <Button small data-e2e='refresh' nature='empty-blue' onClick={this.refresh}>
                <IconRefresh color={PaletteColors['blue-600']} label='refresh' size='small' />
                <span style={{ marginLeft: '4px' }}>
                  <FormattedMessage id='copy.refresh_funds' defaultMessage='Refresh Funds' />
                </span>
              </Button>
            </Flex>
          </FlyoutWrapper>
          {data.cata({
            Failure: (e) => <DataError message={{ message: e }} />,
            Loading: () => <BottomLoader />,
            NotAsked: () => <BottomLoader />,
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
                          {window.coins.ETH.coinfig.displaySymbol} DeFi Wallet
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
                {erc20Balances
                  .filter(({ tokenSymbol }) => !!window.coins[tokenSymbol])
                  .map(({ balance, tokenSymbol }) => (
                    <Row key={tokenSymbol}>
                      <Flex justifyContent='space-between' alignItems='center'>
                        <Flex gap={16} alignItems='center'>
                          <BlockchainIcon size='24px' name={tokenSymbol} />
                          <Flex gap={2} flexDirection='column'>
                            <Text color='black' weight={600}>
                              {window.coins[tokenSymbol].coinfig.name}
                            </Text>
                            <Text size='14px' color='grey500' weight={500}>
                              {window.coins[tokenSymbol].coinfig.displaySymbol} DeFi Wallet
                            </Text>
                          </Flex>
                        </Flex>
                        <Flex gap={2} flexDirection='column'>
                          <Flex justifyContent='flex-end'>
                            <FiatDisplay coin={tokenSymbol} color='black' weight={600}>
                              {balance}
                            </FiatDisplay>
                          </Flex>
                          <Flex justifyContent='flex-end'>
                            <CoinDisplay
                              coin={tokenSymbol}
                              size='14px'
                              color='grey500'
                              weight={500}
                            >
                              {balance}
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

const enhance = compose<any>(
  modalEnhancer(ModalName.ETH_WALLET_BALANCES, { fixed: true, transition: duration }),
  connector
)

export default enhance(EthWalletBalance)
