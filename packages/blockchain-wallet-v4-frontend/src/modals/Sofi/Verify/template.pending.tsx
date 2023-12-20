import React from 'react'
import { FormattedMessage } from 'react-intl'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'

import { Button, Image, Text, TextGroup } from 'blockchain-info-components'
import { FlyoutContainer, FlyoutContent, FlyoutFooter } from 'components/Flyout/Layout'
import { actions } from 'data'
import { ModalName } from 'data/types'

const FormBody = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px;
  height: 100%;
  flex: 1;
`

const SofiMigrationPending = () => {
  const dispatch = useDispatch()

  const dashboardClick = () => {
    dispatch(actions.modals.closeModal(ModalName.SOFI_VERIFY_ID))
    dispatch(
      actions.modals.showModal(ModalName.SOFI_MIGRATED_BALANCES, { origin: 'SofiMigration' })
    )
  }
  return (
    <FlyoutContainer>
      <FlyoutContent mode='top'>
        <FormBody>
          <Image name='identity-verification-pending' height='88px' style={{ marginTop: '24px' }} />
          <Text
            size='20px'
            color='textBlack'
            weight={600}
            lineHeight='1.5'
            style={{ marginTop: '16px', textAlign: 'center' }}
          >
            <FormattedMessage
              id='scenes.sofi.flyout.finishingmigration.title'
              defaultMessage='Finishing Migration'
            />
          </Text>

          <Text
            size='16px'
            color='grey600'
            weight={500}
            lineHeight='1.5'
            style={{ marginTop: '16px', textAlign: 'center' }}
          >
            <FormattedMessage
              id='scenes.sofi.flyout.finishingmigration.body1'
              defaultMessage='We’ve successfully received your information.'
            />
          </Text>
          <Text
            size='16px'
            color='grey600'
            weight={500}
            lineHeight='1.5'
            style={{ marginTop: '16px', textAlign: 'center' }}
          >
            <FormattedMessage
              id='scenes.sofi.flyout.finishingmigration.body1'
              defaultMessage='We’re experiencing high volumes of migrations, and we’ll notify you of the status of your migration.'
            />
          </Text>
        </FormBody>
      </FlyoutContent>
      <FlyoutFooter>
        <Button
          nature='primary'
          fullwidth
          height='48px'
          data-e2e='viewDashboard'
          style={{ marginBottom: '16px', marginTop: '56px' }}
          onClick={dashboardClick}
        >
          <Text color='whiteFade900' size='16px' weight={600}>
            <FormattedMessage id='buttons.view_status' defaultMessage='View Status' />
          </Text>
        </Button>
      </FlyoutFooter>
    </FlyoutContainer>
  )
}

export default SofiMigrationPending
