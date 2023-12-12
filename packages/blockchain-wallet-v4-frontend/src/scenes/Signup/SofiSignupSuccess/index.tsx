import React from 'react'
import { FormattedMessage } from 'react-intl'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'

import { Button, Image, Text } from 'blockchain-info-components'
import { Wrapper } from 'components/Public'
import { actions, selectors } from 'data'
import { ModalName } from 'data/types'
import { useRemote } from 'hooks'
import { isBrowserAndroid, isBrowserIOS } from 'services/browser'
import { isMobile } from 'services/styles'

const ContentWrapper = styled.div`
  display: flex;
  text-align: center;
  align-items: center;
  flex-direction: column;
`

const SofiSuccess = () => {
  const { data } = useRemote(selectors.modules.profile.getSofiMigrationStatus)
  const status = data.migrationStatus.migration_status

  const dispatch = useDispatch()
  // Add check here to make sure that there is wallet data
  // route should navigate to login if there's no wallet data
  const sofiWalletRedirect = () => {
    dispatch(actions.router.push('/home'))
    dispatch(
      actions.modals.showModal(ModalName.SOFI_BLOCKCHAIN_WELCOME, {
        origin: 'SofiMigration'
      })
    )
  }
  const downloadMobileApp = () => {
    if (isBrowserAndroid()) {
      window.open('https://play.google.com/store/apps/details?id=piuk.blockchain.android', '_blank')
    } else if (isBrowserIOS()) {
      window.open('https://itunes.apple.com/us/app/blockchain-bitcoin-wallet/id493253309', '_blank')
    }
  }

  return (
    <Wrapper>
      <ContentWrapper>
        {status === 'SUCCESS' && <Image name='checkmark-circle-green' height='40px' />}
        {status === 'PENDING' && <Image name='sofi-migration-pending' height='40px' />}

        <Text size='20px' weight={600} color='black' lineHeight='1.5' style={{ marginTop: '8px' }}>
          {status === 'SUCCESS' && (
            <FormattedMessage id='scenes.sofi.signup.success' defaultMessage='You’re all set!' />
          )}
          {status === 'PENDING' && (
            <FormattedMessage id='scenes.sofi.signup.pending' defaultMessage='Migration started' />
          )}
        </Text>
        {isMobile() ? (
          <>
            <Text
              color='grey900'
              lineHeight='1.5'
              style={{ marginBottom: '16px', marginTop: '8px' }}
              size='16px'
              weight={500}
            >
              {status === 'SUCCESS' && (
                <FormattedMessage
                  id='scenes.sofi.signup.success.mobile.title'
                  defaultMessage='Your account was created successfully. Go to the Blockchain.com App to keep enjoying your crypto experience.'
                />
              )}
              {status === 'PENDING' && (
                <FormattedMessage
                  id='scenes.sofi.signup.pending.mobile.title'
                  defaultMessage='We are migrating your account. This process might take up to 24 hours. Go to the Blockchain.com App to view your account.'
                />
              )}
            </Text>
            <Button data-e2e='viewAccount' fullwidth nature='primary' onClick={downloadMobileApp}>
              <Text color='white' size='16px' weight={600}>
                <FormattedMessage
                  id='buttons.download_app'
                  defaultMessage='Download the Blockchain.com App'
                />
              </Text>
            </Button>
          </>
        ) : (
          <>
            <Text
              color='grey900'
              lineHeight='1.5'
              style={{ marginBottom: '16px', marginTop: '8px' }}
              size='16px'
              weight={500}
            >
              {status === 'SUCCESS' && (
                <FormattedMessage
                  id='scenes.sofi.signup.success.title'
                  defaultMessage='Your account was successfully created. Your crypto balances have been migrated.'
                />
              )}
              {status === 'PENDING' && (
                <FormattedMessage
                  id='scenes.sofi.signup.pending.title'
                  defaultMessage='We are migrating your account. This process might take up to 24 hours.'
                />
              )}
            </Text>
            <Button data-e2e='viewAccount' fullwidth nature='primary' onClick={sofiWalletRedirect}>
              <Text color='white' size='16px' weight={600}>
                <FormattedMessage id='buttons.view_my_account' defaultMessage='View my account' />
              </Text>
            </Button>
          </>
        )}
      </ContentWrapper>
    </Wrapper>
  )
}

export default SofiSuccess
