import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { Dispatch } from 'redux'
import styled from 'styled-components'

import { Button, Icon, Image, Text } from 'blockchain-info-components'
import { actions } from 'data'
import { media } from 'services/styles'

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border: 1px solid ${(props) => props.theme.grey000};
  border-radius: 8px;
  padding: 20px;

  ${media.atLeastLaptop`
    height: 142px;
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

const SpacedRow = styled(Row)`
  justify-content: space-between;
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
`
const Copy = styled(Text)`
  display: flex;
  align-items: flex-start;
  ${media.mobile`
    font-size: 12px;
  `}
  ${media.tablet`
    font-size: 14px;
  `}
`
const BannerButton = styled(Button)`
  height: 32px;
  font-size: 14px;
  ${media.mobile`
    margin-top: 16px;
    padding: 10px;
  `}
`

const CloseLink = styled.div`
  cursor: pointer;
`

const UpgradeToGoldBanner = ({ onClose, verifyIdentity }: Props) => (
  <Wrapper>
    <Column>
      <SpacedRow>
        <PendingIconWrapper>
          <Image name='tier-gold' size='32px' />
        </PendingIconWrapper>
        <Text size='16px' weight={600} color='grey900' style={{ flex: 1 }}>
          <FormattedMessage
            id='modals.send.banner.title'
            defaultMessage='Uprade to Gold. Send More Crypto.'
          />
        </Text>
        <CloseLink data-e2e='upgradeToGoldCloseButton' onClick={onClose}>
          <Icon size='20px' color='grey400' name='close-circle' />
        </CloseLink>
      </SpacedRow>

      <Row style={{ marginBottom: '8px' }}>
        <Copy size='14px' color='grey900' weight={500}>
          <FormattedMessage
            id='modals.send.banner.description'
            defaultMessage='Verify your ID now and unlock Gold level trading. Send up to {dayAmount} a day. Now, your limit is {yearAmount} annually.'
            values={{ dayAmount: '$100K', yearAmount: '$2k' }}
          />
        </Copy>
      </Row>
      <Row>
        <BannerButton
          onClick={onClose}
          data-e2e='notNow'
          nature='empty-blue'
          style={{ marginRight: '8px' }}
        >
          <FormattedMessage id='copy.not_now' defaultMessage='Not Now' />
        </BannerButton>
        <BannerButton onClick={verifyIdentity} data-e2e='continueToGold' nature='primary'>
          <FormattedMessage id='modals.send.banner.get_started' defaultMessage='Get Stared' />
        </BannerButton>
      </Row>
    </Column>
  </Wrapper>
)

const mapDispatchToProps = (dispatch: Dispatch) => ({
  verifyIdentity: () =>
    dispatch(
      actions.components.identityVerification.verifyIdentity({
        needMoreInfo: false,
        origin: 'Send',
        tier: 2
      })
    )
})

const connector = connect(undefined, mapDispatchToProps)
type Props = ConnectedProps<typeof connector> & { onClose: () => void }

export default connector(UpgradeToGoldBanner)
