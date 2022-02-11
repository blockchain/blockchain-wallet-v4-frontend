import React, { useCallback } from 'react'
import { FormattedMessage } from 'react-intl'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import styled from 'styled-components'

import { Button, Icon, Modal, ModalBody, Text } from 'blockchain-info-components'
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
const GroupContent = styled(Text)`
  font-size: 14px;
  font-weight: 500;
  color: ${(props) => props.theme.black};
  text-align: center;
  a {
    color: ${(props) => props.theme.blue600};
    text-decoration: none;
  }
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

function EntitiesMigration({ cacheActions, close }) {
  const handleCloseClick = useCallback(() => {
    cacheActions.announcementDismissed('entities-migration')
    close()
  }, [cacheActions, close])

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
          <GroupHeader>
            <FormattedMessage
              id='modals.entity_migration.title'
              defaultMessage='New Legal Entity'
            />
          </GroupHeader>
          <GroupContent
            style={{
              marginBottom: '48px'
            }}
          >
            <FormattedMessage
              id='modals.entity_migration.description'
              defaultMessage='Starting later this month, UK customers will be served by our European subsidiary, Blockchain (LT), UAB. You will not experience any changes in user experience or lose access to your funds during this transition. <a>Learn more.</a>'
              values={{
                a: (msg) => (
                  <a
                    href='https://support.blockchain.com/hc/en-us/articles/4418431131668'
                    rel='noopener noreferrer'
                    target='_blank'
                  >
                    {msg}
                  </a>
                )
              }}
            />
          </GroupContent>
        </Group>
        <Group>
          <Button
            nature='primary'
            data-e2e='linkBankContinue'
            height='48px'
            size='16px'
            type='submit'
            disabled={false}
            onClick={handleCloseClick}
            fullwidth
          >
            <FormattedMessage id='copy.i_understand:' defaultMessage='I understand' />
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
  modalEnhancer(ModalName.ENTITIES_MIGRATION_MODAL),
  connect(undefined, mapDispatchToProps)
)

export default enhance(EntitiesMigration)
