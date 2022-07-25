import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators } from 'redux'
import styled from 'styled-components'

import { CoinType, WalletFiatEnum, WalletFiatType } from '@core/types'
import { Button, Text } from 'blockchain-info-components'
import { actions } from 'data'
import { ModalName } from 'data/types'
import { media } from 'services/styles'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  margin: 50px auto 0;
  width: 640px;
  ${media.tablet`
    flex-direction: column;
    width: 100%;
  `};
`
const Row = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  margin-top: 16px;
  &:last-child {
    margin-top: 32px;
  }
`
const Content = styled(Text)`
  margin: 15px 0 20px 0;
  line-height: 1.4;
`
const Column = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  align-items: center;
  justify-content: center;
  text-align: center;
`
const BuyButton = styled(Button)`
  width: auto;
  height: 46px;
  padding: 0 16px;
  &:hover {
    background-color: white;
  }
`

class CoinIntroductionContainer extends React.PureComponent<Props> {
  handleRequest = () =>
    this.props.modalActions.showModal(ModalName.REQUEST_CRYPTO_MODAL, {
      origin: 'EmptyFeed'
    })

  render() {
    const { brokerageActions, buySellActions, coin } = this.props
    const { coinfig } = window.coins[coin]
    const brokerageCurrencies = Object.keys(WalletFiatEnum).filter(
      (value) =>
        typeof WalletFiatEnum[value] === 'number' &&
        [WalletFiatEnum.ARS, WalletFiatEnum.USD].includes(WalletFiatEnum[value])
    )
    const isBrokerageCurrency = brokerageCurrencies.includes(coin)

    return (
      <Container>
        <Row>
          <Column>
            <div>
              <Text size='20px' weight={600} color='grey800'>
                <FormattedMessage
                  id='scenes.transaction.content.empty.transactions'
                  defaultMessage='Transactions'
                />
              </Text>
              <Content weight={400}>
                <FormattedMessage
                  id='scenes.transaction.content.empty.cointxs'
                  defaultMessage='All your {coinName} transactions will show up here.'
                  values={{
                    coinName: coinfig.name
                  }}
                />
              </Content>
            </div>
          </Column>
        </Row>
        <Column style={{ paddingRight: '20px' }}>
          <BuyButton
            data-e2e='buyCoinFromTxList'
            nature='empty-secondary'
            onClick={() => {
              if (coinfig.type.name === 'FIAT') {
                // ACH Deposits/Withdrawals is only for USD and ARS right now
                // so keeping the existing functionality for EUR
                return isBrokerageCurrency
                  ? brokerageActions.handleDepositFiatClick(coin as WalletFiatType)
                  : buySellActions.handleDepositFiatClick({ coin, origin: 'TransactionList' })
              }
              buySellActions.showModal({ origin: 'EmptyFeed' })
            }}
          >
            {coinfig.type.name === 'FIAT' ? (
              <FormattedMessage
                id='scenes.transaction.content.empty.depositnow'
                defaultMessage='Deposit {coin} Now'
                values={{ coin: coinfig.name }}
              />
            ) : (
              <FormattedMessage
                id='scenes.transaction.content.empty.buycoinnow'
                defaultMessage='Buy {coin} Now'
                values={{ coin: coinfig.name }}
              />
            )}
          </BuyButton>
        </Column>
      </Container>
    )
  }
}

const mapDispatchToProps = (dispatch) => ({
  brokerageActions: bindActionCreators(actions.components.brokerage, dispatch),
  buySellActions: bindActionCreators(actions.components.buySell, dispatch),
  modalActions: bindActionCreators(actions.modals, dispatch)
})

const connector = connect(undefined, mapDispatchToProps)

type OwnProps = {
  coin: CoinType
}

export type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(CoinIntroductionContainer)
