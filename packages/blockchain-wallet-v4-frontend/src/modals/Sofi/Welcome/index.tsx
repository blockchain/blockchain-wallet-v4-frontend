import React, { useEffect } from 'react'
import { FormattedMessage } from 'react-intl'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'

import {
  Button,
  HeartbeatLoader,
  Image,
  Modal,
  ModalBody,
  ModalHeader,
  SpinningLoader,
  Text
} from 'blockchain-info-components'
import { actions, selectors } from 'data'
import { RootState } from 'data/rootReducer'
import { ModalName, SofiUserMigrationStatus } from 'data/types'
import modalEnhancer from 'providers/ModalEnhancer'

import { ModalPropsType } from '../../types'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  margin: 20px 0 10px;
  border: 1px solid ${(props) => props.theme.grey200};
`
const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 5px;
  box-sizing: border-box;
`

const IconRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  & > :first-child {
    margin-right: 4px;
  }
`

const Body = styled(ModalBody)`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`

const SofiWelcome = (props: Props) => {
  const dispatch = useDispatch()
  const sofiMigrationStatus = useSelector(
    (state: RootState) => state.profile.sofiMigrationStatus
  ).getOrElse(null)
  const sofiMigrationStatusFromPolling = useSelector(
    (state: RootState) => state.profile.sofiMigrationStatusFromPolling
  ).getOrElse(null)
  // TODO: may need to optimize this to load if both statuses are null
  // so it doesn't start as one or finish in another.
  // i don't think this will happen in real cases since migration since this
  // modal shows only after ssn verification
  const statusPending =
    sofiMigrationStatus === SofiUserMigrationStatus.PENDING ||
    sofiMigrationStatusFromPolling === SofiUserMigrationStatus.PENDING

  const continueButtonClick = () => {
    if (!statusPending) {
      dispatch(
        actions.modals.showModal(ModalName.SOFI_MIGRATED_BALANCES, { origin: 'SofiMigration' })
      )
    }
    dispatch(actions.modals.closeModal(ModalName.SOFI_BLOCKCHAIN_WELCOME))
  }

  return (
    <Modal size='medium' position={props.position} total={props.total}>
      <Body>
        <Image name='sofi-blockchain-migration' width='250px' />
        <Text size='20px' weight={600} color='grey900' lineHeight='1.5'>
          <FormattedMessage
            id='scenes.sofi.welcome.header'
            defaultMessage='Welcome to Blockchain.com!'
          />
        </Text>
        <Text
          size='16px'
          weight={500}
          color='grey600'
          lineHeight='1.5'
          style={{ marginBottom: '64px', marginTop: '16px', textAlign: 'center' }}
        >
          {statusPending ? (
            <FormattedMessage
              id='scenes.sofi.welcome.modal.pending'
              defaultMessage='We are migrating your account. This process might take up to 24 hours.'
            />
          ) : (
            <FormattedMessage
              id='scenes.sofi.welcome.modal.body'
              defaultMessage='Congrats! You can now continue your crypto experience with Blockchain.com.'
            />
          )}
        </Text>
        <Button nature='primary' fullwidth data-e2e='sofiContinue' onClick={continueButtonClick}>
          <FormattedMessage id='buttons.continue' defaultMessage='Continue' />
        </Button>
      </Body>
    </Modal>
  )
}

type Props = ModalPropsType

export default modalEnhancer(ModalName.SOFI_BLOCKCHAIN_WELCOME)(SofiWelcome)
