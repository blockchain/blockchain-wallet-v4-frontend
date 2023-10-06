import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { IconCloseCircleV2, PaletteColors } from '@blockchain-com/constellation'
import { bindActionCreators } from '@reduxjs/toolkit'
import { Dispatch } from 'redux'

import { Image, Text } from 'blockchain-info-components'
import { actions } from 'data'

import ANNOUNCEMENTS from '../constants'
import { BannerButton, CloseLink, Column, Copy, IconWrapper, Row, Wrapper } from '../styles'

const ContinueToGold = ({ cacheActions, verifyIdentity }: Props) => {
  return (
    <Wrapper>
      <Row>
        <IconWrapper>
          <Image name='tier-gold' size='32px' />
        </IconWrapper>
        <Column>
          <Text size='20px' weight={600} color='grey800'>
            <FormattedMessage
              id='scenes.home.banner.continue_to_gold.increase_your_limits'
              defaultMessage='Increase your limits'
            />
          </Text>
          <Copy size='16px' color='grey600' weight={500}>
            <FormattedMessage
              id='scenes.home.banner.continue_to_full_access.description'
              defaultMessage='Continue your verification to become full access and increase your limits and payment methods'
            />
          </Copy>
        </Column>
      </Row>
      <BannerButton onClick={verifyIdentity} jumbo data-e2e='continueToGoldSDD' nature='primary'>
        <FormattedMessage
          id='scenes.home.banner.continue_to_full_access.button'
          defaultMessage='Continue to Full Access'
        />
      </BannerButton>
      <CloseLink
        data-e2e='newCoinCloseButton'
        onClick={() => cacheActions.announcementDismissed(ANNOUNCEMENTS.CONTINUE_TO_GOLD)}
      >
        <IconCloseCircleV2
          label='close'
          color={PaletteColors['grey-600']}
          data-e2e='continueToGoldCloseModalIcon'
          size='medium'
        />
      </CloseLink>
    </Wrapper>
  )
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  cacheActions: bindActionCreators(actions.cache, dispatch),
  verifyIdentity: () =>
    dispatch(
      actions.components.identityVerification.verifyIdentity({
        needMoreInfo: false,
        origin: 'DashboardPromo',
        tier: 2
      })
    )
})

const connector = connect(undefined, mapDispatchToProps)
type Props = ConnectedProps<typeof connector>

export default connector(ContinueToGold)
