import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators } from 'redux'
import styled from 'styled-components'

import { Button, Text } from 'blockchain-info-components'
import { CoinType } from 'blockchain-wallet-v4/src/types'
import { actions } from 'data'
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
    this.props.modalActions.showModal('REQUEST_CRYPTO_MODAL', {
      origin: 'EmptyFeed'
    })

  render() {
    const { brokerageActions, coin, simpleBuyActions } = this.props
    const { coinfig } = window.coins[coin]

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
              if (coinfig.type.isFiat) {
                // ACH Deposits/Withdrawals is only for USD right now
                // so keeping the existing functionality for EUR
                return coin === 'USD'
                  ? brokerageActions.handleDepositFiatClick(coin)
                  : simpleBuyActions.handleSBDepositFiatClick(coin, 'TransactionList')
              }
              simpleBuyActions.showModal('EmptyFeed')
            }}
          >
            {coinfig.type.isFiat ? (
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
  modalActions: bindActionCreators(actions.modals, dispatch),
  simpleBuyActions: bindActionCreators(actions.components.simpleBuy, dispatch)
})

const connector = connect(undefined, mapDispatchToProps)

type OwnProps = {
  coin: CoinType
}

export type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(CoinIntroductionContainer)
