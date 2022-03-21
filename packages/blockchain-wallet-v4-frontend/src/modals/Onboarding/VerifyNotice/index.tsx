import React, { useCallback } from 'react'
import { FormattedMessage } from 'react-intl'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import styled from 'styled-components'

import { Button, Icon, Image, Modal, ModalBody, Text } from 'blockchain-info-components'
import { actions } from 'data'
import { ModalName } from 'data/modals/types'
import modalEnhancer from 'providers/ModalEnhancer'

const Group = styled.div`
  margin-bottom: 20px;
`
const GroupHeader = styled(Text)`
  font-size: 20px;
  font-weight: 600;
  color: ${(props) => props.theme.black};
  text-align: center;
  margin-bottom: 20px;
`
const GroupDescription = styled(Text)`
  font-size: 14px;
  font-weight: 500;
  color: ${(props) => props.theme.grey600};
  text-align: center;
`

const ImageWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
`
const Header = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;
  padding: 16px;
  justify-content: flex-end;
`

const CloseIconContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${(props) => props.theme.grey000};
  backdrop-filter: blur(54.3656px);
  > span {
    justify-content: center;
  }
`

const VerifyNotice = ({ cacheActions, close, modalActions }) => {
  const handleCloseClick = useCallback(() => {
    cacheActions.announcementDismissed('verify-notice')
    close()
  }, [cacheActions, close])

  const verifyNowClick = useCallback(() => {
    close()
    modalActions.showModal(ModalName.UPGRADE_NOW_SILVER_MODAL, {
      origin: 'VerifyNotice'
    })
  }, [modalActions, close])

  return (
    <Modal>
      <Header>
        <CloseIconContainer>
          <Icon
            cursor
            data-e2e='completeProfileCloseModalIcon'
            name='close'
            size='20px'
            color='grey600'
            role='button'
            onClick={handleCloseClick}
          />
        </CloseIconContainer>
      </Header>
      <ModalBody>
        <Group>
          <ImageWrapper>
            <Image name='verify-notice' size='88px' />
          </ImageWrapper>
          <GroupHeader>
            <FormattedMessage
              id='modals.verify_notifications.title'
              defaultMessage='We are updating our account verification requirements'
            />
          </GroupHeader>
          <GroupDescription>
            <FormattedMessage
              id='modals.verify_notifications.description'
              defaultMessage='To buy, sell, and swap, you will need to verify your identity by March 27, 2022.'
            />
          </GroupDescription>
        </Group>
        <Group>
          <Button
            nature='primary'
            data-e2e='linkBankContinue'
            height='48px'
            size='16px'
            type='submit'
            disabled={false}
            onClick={verifyNowClick}
            fullwidth
          >
            <FormattedMessage id='buttons.verify_now' defaultMessage='Verify Now' />
          </Button>
        </Group>
      </ModalBody>
    </Modal>
  )
}

const mapDispatchToProps = (dispatch) => ({
  cacheActions: bindActionCreators(actions.cache, dispatch),
  modalActions: bindActionCreators(actions.modals, dispatch)
})

const enhance = compose(
  modalEnhancer(ModalName.VERIFY_NOTICE),
  connect(undefined, mapDispatchToProps)
)

export default enhance(VerifyNotice)
