import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'
import styled from 'styled-components'

import { Button, Icon, Text } from 'blockchain-info-components'
import { CoinType, WalletCurrencyType } from 'blockchain-wallet-v4/src/types'
import { actions, selectors } from 'data'

import { Wrapper } from '../styles'

const StyledWrapper = styled(Wrapper)`
  align-items: center !important;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
    Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
`

const NewAlert = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  padding: 4px 8px;
  font-weight: 600;
  font-size: 14px;
  line-height: 150%;
  text-transform: uppercase;
  margin-right: 5px;
  color: ${props => props.theme.green600};
  background-color: ${props => props.theme.green000};
`

const VerbText = styled.span`
  margin-right: 5px;
  font-weight: 600;
  font-size: 16px;
  color: ${props => props.theme.grey800};
`

const Description = styled.span`
  margin-right: 5px;
  font-weight: 500;
  font-size: 14px;
  color: ${props => props.theme.grey600};
`

const CTAButton = styled(Button)`
  margin-right: 5px;

  & div {
    color: ${props => props.theme.white};
    font-weight: 600;
    font-size: 14px;
  }
`
const CloseLink = styled.div`
  cursor: pointer;
`

type OwnProps = {
  coin: WalletCurrencyType
}

// FIXME: make `coin` & `coinDisplay` not hardcoded
const NewCurrency = ({
  announcementState,
  cacheActions,
  coin = 'WDGLD',
  simpleBuyActions
}) => {
  const newCoinAnnouncement = `${coin}-homepage`
  const coinDisplay = 'wDGLD'
  const isDismissed =
    (announcementState &&
      announcementState[newCoinAnnouncement] &&
      announcementState[newCoinAnnouncement].dismissed) ||
    false

  if (isDismissed) {
    return null
  }

  return (
    <StyledWrapper>
      <NewAlert>
        <FormattedMessage id='copy.new' defaultMessage='New' />
      </NewAlert>
      <VerbText>
        <FormattedMessage id='copy.trade' defaultMessage='Trade' />{' '}
        {coinDisplay} <FormattedMessage id='copy.now' defaultMessage='Now' />
      </VerbText>
      <Description>
        <FormattedMessage
          id='layouts.wallet.header.announcements.newcoin.description'
          defaultMessage='Wrapped Digital Gold (wDGLD) is an ERC-20 tokenized version of DGLD.'
        />
      </Description>

      <CTAButton
        data-e2e='newCoinTradeNowButton'
        nature='primary'
        onClick={() =>
          simpleBuyActions.showModal('TransactionList', coin as CoinType)
        }
        small
        style={{ borderRadius: '4px' }}
      >
        <Text>
          <FormattedMessage id='copy.trade' defaultMessage='Trade' />{' '}
          {coinDisplay} <FormattedMessage id='copy.now' defaultMessage='Now' />
        </Text>
      </CTAButton>
      <CloseLink
        data-e2e='newCoinCloseButton'
        onClick={() => cacheActions.announcementDismissed(newCoinAnnouncement)}
      >
        <Icon size='20px' color='grey400' name='close-circle' />
      </CloseLink>
    </StyledWrapper>
  )
}

const mapStateToProps = state => ({
  announcementState: selectors.cache.getLastAnnouncementState(state)
})
const mapDispatchToProps = (dispatch: Dispatch) => ({
  simpleBuyActions: bindActionCreators(actions.components.simpleBuy, dispatch),
  cacheActions: bindActionCreators(actions.cache, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(NewCurrency)
