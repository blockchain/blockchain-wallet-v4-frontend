import React from 'react'
import { FormattedMessage } from 'react-intl'

import { Button, Image, Link, Text } from 'blockchain-info-components'
import { ProductAuthOptions } from 'data/types'

import { Props } from '../../index'
import { CenteredColumn } from '../../model'

const UpgradeSuccess = (props: Props) => {
  const { product, redirect } = props.productAuthMetadata
  const exchangeRedirect = decodeURIComponent(redirect as string)

  return (
    <CenteredColumn style={{ textAlign: 'center' }}>
      <Image name='account-icons' style={{ marginBottom: '20px' }} />
      <Text size='20px' weight={600} color='grey900' lineHeight='1.5' style={{ margin: '8px 0' }}>
        <FormattedMessage id='scenes.login.upgrade_success' defaultMessage='Upgrade Successful.' />
      </Text>
      <Text size='16px' weight={500} color='grey600' lineHeight='1.5'>
        <FormattedMessage
          id='scenes.login.upgrade_success.copy'
          defaultMessage='You can now use your Wallet email and password to log in to your Blockchain.com Wallet and the Exchange.'
        />
      </Text>
      {product === ProductAuthOptions.WALLET && (
        <Button
          nature='primary'
          fullwidth
          height='48px'
          onClick={() => props.authActions.loginRoutine()}
          data-e2e='iUnderstandWalletRedirect'
          style={{ marginTop: '16px' }}
        >
          <FormattedMessage id='buttons.i_understand' defaultMessage='I Understand' />
        </Button>
      )}
      {product === ProductAuthOptions.EXCHANGE && (
        <Button
          nature='primary'
          fullwidth
          height='48px'
          data-e2e='iUnderstandExchangeRedirect'
          style={{ marginTop: '16px' }}
        >
          <Link
            href={`${exchangeRedirect}/auth?jwt=${props.jwtToken}`}
            rel='noopener noreferrer'
            target='_blank'
            color='white'
          >
            <FormattedMessage id='buttons.i_understand' defaultMessage='I Understand' />
          </Link>
        </Button>
      )}
    </CenteredColumn>
  )
}

export default UpgradeSuccess
