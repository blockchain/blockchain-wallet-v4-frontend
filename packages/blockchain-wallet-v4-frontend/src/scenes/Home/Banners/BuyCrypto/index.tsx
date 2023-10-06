import React, { useCallback } from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'
import styled from 'styled-components'

import { WalletFiatType } from '@core/types'
import { Icon, Text } from 'blockchain-info-components'
import { actions, selectors } from 'data'
import { RootState } from 'data/rootReducer'

import ANNOUNCEMENTS from '../constants'
import { BannerButton, CloseLink, Column, Copy, Row, SyncIconWrapper, Wrapper } from '../styles'

const BuyCrypto = ({ buySellActions, cacheActions, fiatCurrency }: Props) => {
  const showModal = useCallback(() => {
    buySellActions.showModal({ origin: 'WelcomeModal' })

    buySellActions.setStep({
      fiatCurrency,
      step: 'CRYPTO_SELECTION'
    })
  }, [buySellActions, fiatCurrency])

  return (
    <Wrapper>
      <Row>
        <SyncIconWrapper>
          <Icon name='plus' color='blue600' size='30px' />
        </SyncIconWrapper>
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
      <BannerButton onClick={showModal} jumbo data-e2e='openSDDFlow' nature='primary'>
        <FormattedMessage id='modals.simplebuy.confirm.buynow' defaultMessage='Buy Now' />
      </BannerButton>
      <CloseLink
        data-e2e='newCoinCloseButton'
        onClick={() => cacheActions.announcementDismissed(ANNOUNCEMENTS.BUY_CRIPTO)}
      >
        <Icon size='20px' color='grey400' name='close-circle' />
      </CloseLink>
    </Wrapper>
  )
}

const mapStateToProps = (state: RootState): LinkStatePropsType => ({
  fiatCurrency: selectors.components.buySell.getFiatCurrency(state) as WalletFiatType
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  buySellActions: bindActionCreators(actions.components.buySell, dispatch),
  cacheActions: bindActionCreators(actions.cache, dispatch),
  modalActions: bindActionCreators(actions.modals, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type LinkStatePropsType = {
  fiatCurrency: WalletFiatType
}
type Props = ConnectedProps<typeof connector>

export default connector(BuyCrypto)
