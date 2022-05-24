import React, { useCallback } from 'react'
import { FormattedMessage } from 'react-intl'
import { connect } from 'react-redux'
import { Icon } from '@blockchain-com/constellation'
import { IconAlert, IconCloseCircleV2 } from '@blockchain-com/icons'
import { bindActionCreators, compose } from 'redux'
import styled from 'styled-components'

import { Button, Link, Modal, ModalBody, Text } from 'blockchain-info-components'
import { Flex } from 'components/Flex'
import { actions, selectors } from 'data'
import { RootState } from 'data/rootReducer'
import { CURRENT_SANCTIONS, ModalName, ProductEligibilityForUser } from 'data/types'
import modalEnhancer from 'providers/ModalEnhancer'

const GroupHeader = styled(Text)`
  font-size: 20px;
  font-weight: 600;
  color: ${(props) => props.theme.black};
  text-align: center;
  margin-bottom: 20px;
`
const GroupDescription = styled(Text)`
  font-size: 16px;
  font-weight: 500;
  max-width: 324px;
  color: ${(props) => props.theme.grey900};
  text-align: center;
`
const ImageWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-bottom: 18px;
`
const Header = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;
  padding: 16px;
  justify-content: flex-end;
`
const CloseIconContainer = styled.div`
  cursor: pointer;
`

const StyledModal = styled(Modal)`
  max-width: 404px;
`

const SanctionsNotice = ({ cacheActions, close, products }) => {
  const handleCloseClick = useCallback(() => {
    cacheActions.announcementDismissed('sanctions-notice')
    close()
  }, [cacheActions, close])

  const closeNow = useCallback(() => {
    close()
  }, [close])

  const messageToShow =
    products?.notifications[0] && products?.notifications[0]?.reason !== CURRENT_SANCTIONS
      ? products?.notifications[0]?.message
      : null

  return (
    <StyledModal>
      <Header>
        <CloseIconContainer onClick={handleCloseClick}>
          <Icon label='close' color='grey600' data-e2e='completeProfileCloseModalIcon' size='md'>
            <IconCloseCircleV2 />
          </Icon>
        </CloseIconContainer>
      </Header>
      <ModalBody>
        <Flex flexDirection='column' style={{ marginBottom: '24px' }}>
          <ImageWrapper>
            <Icon label='alert' color='orange400' size='lg'>
              <IconAlert />
            </Icon>
          </ImageWrapper>
          <GroupHeader>
            <FormattedMessage
              id='modals.sanctions_notifications.title'
              defaultMessage='Account Restricted'
            />
          </GroupHeader>
          <Flex justifyContent='center'>
            <GroupDescription>
              {messageToShow || (
                <FormattedMessage
                  id='modals.sanctions_notifications.description'
                  defaultMessage='Currently, trading is not allowed for balances over €10.000 due to regulatory sanctions. However, you can still hold or withdraw.'
                />
              )}
            </GroupDescription>
          </Flex>
        </Flex>
        <Flex justifyContent='center' gap={16}>
          <Link
            href='https://ec.europa.eu/commission/presscorner/detail/en/ip_22_2332'
            target='_blank'
            rel='noopener noreferrer'
          >
            <Button
              nature='empty-secondary'
              data-e2e='learnMoreSanctions'
              height='48px'
              size='16px'
              disabled={false}
            >
              <FormattedMessage id='buttons.learn_more' defaultMessage='Learn More' />
            </Button>
          </Link>
          <Button
            nature='primary'
            data-e2e='linkBankContinue'
            height='48px'
            size='16px'
            type='submit'
            disabled={false}
            onClick={closeNow}
          >
            <FormattedMessage
              id='modals.sanctions_notifications.i_understand'
              defaultMessage='I Understand'
            />
          </Button>
        </Flex>
      </ModalBody>
    </StyledModal>
  )
}

const mapStateToProps = (state: RootState) => ({
  products: selectors.custodial.getProductEligibilityForUser(state).getOrElse({
    notifications: []
  } as ProductEligibilityForUser)
})

const mapDispatchToProps = (dispatch) => ({
  cacheActions: bindActionCreators(actions.cache, dispatch)
})

const enhance = compose(
  modalEnhancer(ModalName.SANCTIONS_NOTICE_MODAL),
  connect(mapStateToProps, mapDispatchToProps)
)

export default enhance(SanctionsNotice)
