import React, { useCallback } from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'

import { Icon, Image, Text } from 'blockchain-info-components'
import { actions } from 'data'
import { ModalName } from 'data/modals/types'

import ANNOUNCEMENTS from '../constants'
import { BannerButton, CloseLink, Column, Copy, IconWrapper, Row, Wrapper } from '../styles'

const SofiFinishMigration = ({ cacheActions, modalActions }: Props) => {
  const showModal = useCallback(() => {
    modalActions.showModal(ModalName.SOFI_VERIFY_ID, {
      origin: 'SofiFinishMigration'
    })
  }, [modalActions])

  return (
    <Wrapper>
      <Row>
        <IconWrapper>
          <Image name='sofi-finish-migration' size='32px' />
        </IconWrapper>
        <Column>
          <Text size='20px' weight={600} color='grey800'>
            <FormattedMessage
              id='banners.sofi.migration.finish.title'
              defaultMessage='Finish migrating from SoFi'
            />
          </Text>
          <Copy size='16px' color='grey600' weight={500}>
            <FormattedMessage
              id='banners.sofi.migration.finish.description'
              defaultMessage='One more thing before your migration is done.'
            />
          </Copy>
        </Column>
      </Row>
      <BannerButton onClick={showModal} jumbo data-e2e='openSDDFlow' nature='primary'>
        <FormattedMessage
          id='banners.sofi.migration.finish.button'
          defaultMessage='Finish Migration'
        />
      </BannerButton>
    </Wrapper>
  )
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  cacheActions: bindActionCreators(actions.cache, dispatch),
  modalActions: bindActionCreators(actions.modals, dispatch)
})

const connector = connect(null, mapDispatchToProps)

type Props = ConnectedProps<typeof connector>

export default connector(SofiFinishMigration)
