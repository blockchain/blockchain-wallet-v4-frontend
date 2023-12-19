import React from 'react'
import { FormattedMessage } from 'react-intl'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'

import { Button, Image, Modal, ModalBody, Text } from 'blockchain-info-components'
import { actions, selectors } from 'data'
import { RootState } from 'data/rootReducer'
import { ModalName, SofiUserMigrationStatus } from 'data/types'
import modalEnhancer from 'providers/ModalEnhancer'

import { ModalPropsType } from '../../types'

const Body = styled(ModalBody)`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`

const SofiWelcome = (props: Props) => {
  const dispatch = useDispatch()
  const sofiMigrationStatus = useSelector(
    (state: RootState) => state.profile.sofiUserMigrationStatus
  )

  // TODO: may need to optimize this to load if both statuses are null
  // so it doesn't start as one or finish in another.
  // i don't think this will happen in real cases since migration since this
  // modal shows only after ssn verification
  const statusPending = sofiMigrationStatus === SofiUserMigrationStatus.PENDING

  const statusSuccess = sofiMigrationStatus === SofiUserMigrationStatus.SUCCESS
  const statusFailure = sofiMigrationStatus === SofiUserMigrationStatus.FAILURE
  const statusAwaitingUser = sofiMigrationStatus === SofiUserMigrationStatus.AWAITING_USER

  const continueButtonClick = () => {
    dispatch(actions.modals.closeModal(ModalName.SOFI_BLOCKCHAIN_WELCOME))
    if (statusPending || statusSuccess) {
      dispatch(
        actions.modals.showModal(ModalName.SOFI_MIGRATED_BALANCES, { origin: 'SofiMigration' })
      )
    }
    if (statusAwaitingUser) {
      dispatch(actions.modals.showModal(ModalName.SOFI_VERIFY_ID, { origin: 'SofiMigration' }))
    }
  }

  return (
    <Modal size='medium' position={props.position} total={props.total}>
      <Body>
        <Image name='sofi-blockchain-migration' width='250px' />
        <Text size='20px' weight={600} color='grey900' lineHeight='1.5'>
          {statusFailure ? (
            <FormattedMessage
              id='scenes.sofi.signup.failure.generic.header'
              defaultMessage='Uh oh! Something went wrong.'
            />
          ) : (
            <FormattedMessage
              id='scenes.sofi.welcome.header'
              defaultMessage='Welcome to Blockchain.com!'
            />
          )}
        </Text>
        <Text
          size='16px'
          weight={500}
          color='grey600'
          lineHeight='1.5'
          style={{ marginBottom: '64px', marginTop: '16px', textAlign: 'center' }}
        >
          {statusSuccess && (
            <FormattedMessage
              id='scenes.sofi.welcome.modal.body'
              defaultMessage='Congrats! You can now continue your crypto experience with Blockchain.com.'
            />
          )}
          {statusAwaitingUser && (
            <FormattedMessage
              id='scenes.sofi.welcome.modal.awaiting'
              defaultMessage='You`re almost there! We have just verify your SoFi account before the migration is finished.'
            />
          )}
          {statusPending && (
            <FormattedMessage
              id='scenes.sofi.welcome.modal.pending'
              defaultMessage='We are migrating your account. This process might take up to 24 hours.'
            />
          )}
          {statusFailure && (
            <FormattedMessage
              id='scenes.sofi.signup.failure.expired.body'
              defaultMessage='Restart your crypto account migration from your account on the SoFi website.'
            />
          )}
        </Text>
        <Button nature='primary' fullwidth data-e2e='sofiContinue' onClick={continueButtonClick}>
          {statusFailure ? (
            <FormattedMessage id='buttons.ok' defaultMessage='OK' />
          ) : (
            <FormattedMessage id='buttons.continue' defaultMessage='Continue' />
          )}
        </Button>
      </Body>
    </Modal>
  )
}

type Props = ModalPropsType

export default modalEnhancer(ModalName.SOFI_BLOCKCHAIN_WELCOME)(SofiWelcome)
