import React, { PureComponent } from 'react'
import { FormattedMessage } from 'react-intl'
import { connect } from 'react-redux'
import { concat, equals, prop } from 'ramda'
import { bindActionCreators, Dispatch } from 'redux'
import styled, { css } from 'styled-components'

import { Icon, Link, Text } from 'blockchain-info-components'
import { WalletOptionsType } from 'blockchain-wallet-v4/src/types'
import { actions, model, selectors } from 'data'
import { RootState } from 'data/rootReducer'

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 16px;
  border: none;
  padding: 6px 12px;
  background-color: ${({ theme }) => theme.blue000};
`

const ContainerCss = css`
  display: flex;
  align-items: center;
`

const ConnectContainer = styled.div`
  ${ContainerCss}

  &:hover {
    cursor: pointer;
  }
`

const GetStartedContainer = styled.div`
  ${ContainerCss}
`

const { EXCHANGE_EVENTS } = model.analytics

const LinkCustom = styled(Link)`
  ${ContainerCss}
`

type LinkStatePropsType = {
  domains: { [key in string]: string }
  isExchangeLinked: boolean
  isGoldVerified: boolean
}

type LinkDispatchPropsType = {
  analyticsActions: typeof actions.analytics
  modalActions: typeof actions.modals
  profileActions: typeof actions.modules.profile
}

type Props = LinkStatePropsType & LinkDispatchPropsType

class ExchangePromo extends PureComponent<Props> {
  onSignup = () => {
    this.props.modalActions.closeAllModals()
    this.props.modalActions.showModal('LINK_TO_EXCHANGE_ACCOUNT_MODAL', {
      origin: 'SendExchangePromo'
    })
    this.props.analyticsActions.logEvent([...EXCHANGE_EVENTS.PROMO, 'connect_modal_promo_clicked'])
  }

  render() {
    const { domains, isExchangeLinked, isGoldVerified } = this.props
    const exchangeUrl = concat(prop('exchange', domains), '/trade')

    return (
      <Wrapper>
        {isGoldVerified ? (
          <Text color='blue800' size='14px' weight={500}>
            <FormattedMessage
              id='exchangepromo.pairs'
              defaultMessage='Access 20+ trading pairs on the Exchange.'
            />
          </Text>
        ) : (
          <Text color='blue800' size='14px' weight={500}>
            <FormattedMessage
              id='exchangepromo.upgradeaccount'
              defaultMessage='Upgrade your account to buy, sell, and trade.'
            />
          </Text>
        )}
        {isGoldVerified ? (
          isExchangeLinked ? (
            <LinkCustom
              href={`${exchangeUrl}?utm_source=web_wallet&utm_medium=referral&utm_campaign=sidenav_exchange_linked`}
              rel='noopener noreferrer'
              data-e2e='openExchange'
              target='_blank'
              onClick={() =>
                this.props.analyticsActions.logEvent([
                  ...EXCHANGE_EVENTS.PROMO,
                  'go_to_exchange_promo_clicked'
                ])
              }
            >
              <Text color='blue600' size='14px' weight={600}>
                <FormattedMessage id='exchangepromo.trade' defaultMessage='Trade' />
              </Text>
              <Icon name='chevron-right' color='blue600' size='22px' weight={500} />
            </LinkCustom>
          ) : (
            <ConnectContainer data-e2e='connectExchange' onClick={this.onSignup}>
              <Text color='blue600' size='14px' weight={600}>
                <FormattedMessage
                  id='scenes.exchange.getstarted.status.getstarted.button'
                  defaultMessage='Get Started'
                />
              </Text>
              <Icon name='chevron-right' color='blue600' size='20px' weight={500} />
            </ConnectContainer>
          )
        ) : (
          <ConnectContainer
            data-e2e='goSettingsProfile'
            onClick={() => {
              this.props.analyticsActions.logEvent([
                ...EXCHANGE_EVENTS.PROMO,
                'verify_account_promo_clicked'
              ])
              this.props.modalActions.showModal('TRADING_LIMITS_MODAL', {
                origin: 'TradingLimits'
              })
            }}
          >
            <GetStartedContainer>
              <Text color='blue600' size='14px' weight={600}>
                <FormattedMessage
                  id='scenes.exchange.exchangeform.limit_info.upgrade'
                  defaultMessage='Upgrade'
                />
              </Text>
              <Icon name='chevron-right' color='blue600' size='20px' weight={500} />
            </GetStartedContainer>
          </ConnectContainer>
        )}
      </Wrapper>
    )
  }
}

const mapStateToProps = (state: RootState) => ({
  domains: selectors.core.walletOptions.getDomains(state).getOrElse({
    exchange: 'https://exchange.blockchain.com'
  } as WalletOptionsType['domains']),
  isExchangeLinked: selectors.modules.profile.isExchangeAccountLinked(state).getOrElse(false),
  isGoldVerified: equals(selectors.modules.profile.getCurrentTier(state), 2)
})

const mapDispatchToProps = (dispatch: Dispatch): LinkDispatchPropsType => ({
  analyticsActions: bindActionCreators(actions.analytics, dispatch),
  modalActions: bindActionCreators(actions.modals, dispatch),
  profileActions: bindActionCreators(actions.modules.profile, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(ExchangePromo)
