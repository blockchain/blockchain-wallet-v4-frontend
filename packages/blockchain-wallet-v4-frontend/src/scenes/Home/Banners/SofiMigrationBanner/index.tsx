import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'

import { Icon, Image, Text } from 'blockchain-info-components'
import { actions } from 'data'

import ANNOUNCEMENTS from '../constants'
import { CloseLink, Column, Copy, IconWrapper, Row, Wrapper } from '../styles'

const SofiMigration = ({ cacheActions }: Props) => {
  return (
    <Wrapper>
      <Row>
        <IconWrapper>
          <Image name='sofi-migration-pending' size='32px' />
        </IconWrapper>
        <Column>
          <Text size='20px' weight={600} color='grey800'>
            <FormattedMessage
              id='banners.sofi.migration.pending.title'
              defaultMessage='Migration in progress'
            />
          </Text>
          <Copy size='16px' color='grey600' weight={500}>
            <FormattedMessage
              id='banners.sofi.migration.pending.description'
              defaultMessage='We are migrating your account. This process might take up to 24 hours.'
            />
          </Copy>
        </Column>
      </Row>
      <CloseLink
        data-e2e='sofiMigrationBannerInProgressClose'
        onClick={() => cacheActions.announcementDismissed(ANNOUNCEMENTS.SOFI_MIGRATION)}
      >
        <Icon size='20px' color='grey400' name='close-circle' />
      </CloseLink>
    </Wrapper>
  )
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  cacheActions: bindActionCreators(actions.cache, dispatch),
  modalActions: bindActionCreators(actions.modals, dispatch)
})

const connector = connect(undefined, mapDispatchToProps)

type Props = ConnectedProps<typeof connector>

export default connector(SofiMigration)
