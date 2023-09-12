import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'
import styled from 'styled-components'

import { Icon, Text } from 'blockchain-info-components'
import { actions } from 'data'

import ANNOUNCEMENTS from '../constants'
import { BannerButton, CloseLink, Column, Copy, PendingIconWrapper, Row, Wrapper } from '../styles'

const StyledRow = styled(Row)`
  margin-right: 12px;
`

const FinishKyc = (props: Props) => {
  return (
    <Wrapper>
      <StyledRow>
        <PendingIconWrapper>
          <Icon name='pending' color='orange600' size='20px' />
        </PendingIconWrapper>
        <Column>
          <Text size='20px' weight={600} color='grey800'>
            <FormattedMessage
              id='scenes.home.banner.finishsigningup'
              defaultMessage='Finish Signing Up'
            />
          </Text>
          <Copy size='16px' color='grey600' weight={500}>
            <FormattedMessage
              id='scenes.home.banner.signupapprove'
              defaultMessage='Once you finish and get approved, start buying crypto.'
            />
          </Copy>
        </Column>
      </StyledRow>
      <BannerButton
        onClick={() =>
          props.identityVerificationActions.verifyIdentity({
            needMoreInfo: false,
            origin: 'DashboardPromo',
            tier: 2
          })
        }
        jumbo
        data-e2e='openKycTier2'
        nature='primary'
      >
        <FormattedMessage id='buttons.continue' defaultMessage='Continue' />
      </BannerButton>
      <CloseLink
        data-e2e='newCoinCloseButton'
        onClick={() => props.cacheActions.announcementDismissed(ANNOUNCEMENTS.KYC_FINISH)}
      >
        <Icon size='20px' color='grey400' name='close-circle' />
      </CloseLink>
    </Wrapper>
  )
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  cacheActions: bindActionCreators(actions.cache, dispatch),
  identityVerificationActions: bindActionCreators(actions.components.identityVerification, dispatch)
})

const connector = connect(undefined, mapDispatchToProps)

type Props = ConnectedProps<typeof connector>

export default connector(FinishKyc)
