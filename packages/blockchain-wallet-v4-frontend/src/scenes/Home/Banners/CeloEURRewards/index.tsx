import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'
import styled from 'styled-components'

import { Button, Icon, Link, Text } from 'blockchain-info-components'
import { actions, selectors } from 'data'
import { media } from 'services/styles'

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  border: 1px solid ${(props) => props.theme.grey000};
  border-radius: 8px;
  overflow: hidden;
  padding: 20px;

  ${media.atLeastLaptop`
    height: 80px;
    padding: 0 20px;
  `}
`
const NewCoinWrapper = styled.div`
  display: flex;
  align-items: center;
`
const VerbText = styled(Text)`
  margin-right: 5px;
  font-weight: 600;
  font-size: 18px;
  color: ${(props) => props.theme.black};
`

const Description = styled(Text)`
  margin-top: 2px;
  font-weight: 500;
  font-size: 16px;
  color: ${(props) => props.theme.black};
  display: none;

  ${media.atLeastMobile`
    display: block;
  `}
`

const CTAWrapper = styled.div`
  display: flex;
  align-items: center;
`

const CTAButton = styled(Button)`
  margin-right: 12px;

  & div {
    color: ${(props) => props.theme.white};
    font-weight: 600;
    font-size: 14px;
  }
`
const CloseLink = styled.div`
  cursor: pointer;
`

const CEURRewards = ({ cacheActions, showBanner }: Props) => {
  if (!showBanner) return null

  const newCoinAnnouncement = 'ceur-rewards'
  const coin = 'CEUR'
  if (!window.coins[coin]) return null
  const { coinfig } = window.coins[coin]
  const { displaySymbol } = coinfig

  return (
    <Wrapper>
      <NewCoinWrapper>
        <Icon name={coin} size='36px' style={{ marginRight: '16px' }} />
        <div>
          <VerbText>
            <FormattedMessage
              id='copy.earn_up_to_ceur'
              defaultMessage='Earn up to 4% in {displaySymbol} Rewards'
              values={{ displaySymbol }}
            />
          </VerbText>
          <Description>
            <FormattedMessage
              id='layouts.wallet.header.announcements.ceur.description1'
              defaultMessage='Buy {displaySymbol} with no fees and earn up to 4% in annual rewards, paid monthly.'
              values={{ displaySymbol }}
            />
          </Description>
        </div>
      </NewCoinWrapper>

      <CTAWrapper>
        <CTAButton data-e2e='ceurLearnMore' nature='primary' small style={{ borderRadius: '4px' }}>
          <Link href='https://why.blockchain.com/celo' target='_blank' rel='noopener noreferrer'>
            <Text>
              <FormattedMessage id='copy.learn_more' defaultMessage='Learn More' />
            </Text>
          </Link>
        </CTAButton>
        <CloseLink
          data-e2e='newCoinCloseButton'
          onClick={() => cacheActions.announcementDismissed(newCoinAnnouncement)}
        >
          <Icon size='20px' color='grey400' name='close-circle' />
        </CloseLink>
      </CTAWrapper>
    </Wrapper>
  )
}

const mapStateToProps = (state) => ({
  showBanner: selectors.core.walletOptions.getCeloEurRewards(state).getOrElse(false)
})
const mapDispatchToProps = (dispatch: Dispatch) => ({
  cacheActions: bindActionCreators(actions.cache, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type Props = ConnectedProps<typeof connector>

export default connector(CEURRewards)
