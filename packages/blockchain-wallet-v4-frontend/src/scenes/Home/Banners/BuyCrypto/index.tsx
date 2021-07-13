import React, { PureComponent } from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'
import styled from 'styled-components'

import { Button, Icon, Text } from 'blockchain-info-components'
import { WalletFiatType } from 'blockchain-wallet-v4/src/types'
import { actions, selectors } from 'data'
import { RootState } from 'data/rootReducer'
import { media } from 'services/styles'

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border: 1px solid ${props => props.theme.grey000};
  border-radius: 8px;
  padding: 20px;

  ${media.atLeastLaptop`
    height: 80px;
    padding: 0 20px;
  `}
  ${media.mobile`
    padding: 12px;
    flex-direction: column;
  `}
`
const Row = styled.div`
  display: flex;
  align-items: center;
`
const Column = styled.div`
  display: flex;
  flex-direction: column;

  & > div:first-child {
    margin-bottom: 4px;
  }
`
const PendingIconWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 40px;
  width: 40px;
  min-width: 40px;
  border-radius: 20px;
  margin-right: 20px;
  background-color: ${props => props.theme.blue100};
`
const Copy = styled(Text)`
  display: flex;
  align-items: center;
  ${media.mobile`
    font-size: 12px;
  `}
  ${media.tablet`
    font-size: 14px;
  `}
`
const BannerButton = styled(Button)`
  height: 48px;
  ${media.mobile`
    font-size: 14px;
    margin-top: 16px;
    padding: 10px;
  `}
`

class BuyCrypto extends PureComponent<Props> {
  showModal = () => {
    this.props.simpleBuyActions.showModal('WelcomeModal')

    this.props.simpleBuyActions.setStep({
      step: 'CRYPTO_SELECTION',
      fiatCurrency: this.props.fiatCurrency
    })
  }

  render() {
    return (
      <Wrapper>
        <Row>
          <PendingIconWrapper>
            <Icon name='plus' color='blue600' size='30px' />
          </PendingIconWrapper>
          <Column>
            <Text size='20px' weight={600} color='grey800'>
              <FormattedMessage
                id='modals.simplebuy.buy_crypto_now'
                defaultMessage='Buy Crypto Now'
              />
            </Text>
            <Copy size='16px' color='grey600' weight={500}>
              <FormattedMessage
                id='scenes.home.banner.buy_crypto_sdd_description'
                defaultMessage='Select the crypto you want to buy, verify your identity and buy instantly'
              />
            </Copy>
          </Column>
        </Row>
        <BannerButton
          onClick={() => this.showModal()}
          jumbo
          data-e2e='openSDDFlow'
          nature='primary'
        >
          <FormattedMessage
            id='modals.simplebuy.confirm.buynow'
            defaultMessage='Buy Now'
          />
        </BannerButton>
      </Wrapper>
    )
  }
}

const mapStateToProps = (state: RootState): LinkStatePropsType => ({
  fiatCurrency: selectors.components.simpleBuy.getFiatCurrency(
    state
  ) as WalletFiatType
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  modalActions: bindActionCreators(actions.modals, dispatch),
  simpleBuyActions: bindActionCreators(actions.components.simpleBuy, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type LinkStatePropsType = {
  fiatCurrency: WalletFiatType
}
type Props = ConnectedProps<typeof connector>

export default connector(BuyCrypto)
