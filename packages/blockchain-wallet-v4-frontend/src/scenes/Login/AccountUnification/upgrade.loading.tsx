import React from 'react'
import { FormattedMessage } from 'react-intl'

import { Image, Text } from 'blockchain-info-components'

import { CenteredColumn } from '../model'

const UpgradeLoading = () => {
  return (
    <>
      <CenteredColumn style={{ textAlign: 'center' }}>
        <Image name='account-icons' />
        <Text size='20px' weight={600} color='grey900' lineHeight='1.5' style={{ margin: '8px 0' }}>
          <FormattedMessage
            id='scenes.login.upgrade_loading.upgrading.header'
            defaultMessage='Upgrading Your Account'
          />
        </Text>
      </CenteredColumn>
    </>
  )
}

export default UpgradeLoading
