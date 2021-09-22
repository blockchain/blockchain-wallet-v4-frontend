import React from 'react'
import { FormattedMessage } from 'react-intl'

import { Image, Text } from 'blockchain-info-components'

import { Props } from '../../index'
import { CenteredColumn } from '../../model'

const WalletSuccess = (props: Props) => {
  return (
    <>
      <CenteredColumn style={{ textAlign: 'center' }}>
        <Image name='wallet-logo' style={{ marginBottom: '20px' }} />
        <Text size='20px' weight={500} color='grey600' lineHeight='1.5'>
          <FormattedMessage
            id='scenes.login.upgrade_success.wallet'
            defaultMessage='Upgrade successful, taking you to Blockchain.com Wallet...'
          />
        </Text>
      </CenteredColumn>
    </>
  )
}

export default WalletSuccess
