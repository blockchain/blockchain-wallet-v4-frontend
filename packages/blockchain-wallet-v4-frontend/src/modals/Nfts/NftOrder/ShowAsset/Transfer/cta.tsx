import React from 'react'
import { FormattedMessage } from 'react-intl'

import { NftAsset } from '@core/network/api/nfts/types'
import { Link, Text } from 'blockchain-info-components'
import { NftOrderStepEnum } from 'data/components/nfts/types'

import { Props as OwnProps } from '../..'

const CTA: React.FC<Props> = (props) => {
  const { nftActions } = props

  return (
    <>
      <Text size='12px' weight={500} style={{ margin: '8px 0', textAlign: 'center' }}>
        Or
      </Text>
      <Link
        weight={600}
        size='14px'
        onClick={() => nftActions.setOrderFlowStep({ step: NftOrderStepEnum.TRANSFER })}
        style={{ display: 'block', textAlign: 'center', width: '100%' }}
      >
        <FormattedMessage id='copy.transfer' defaultMessage='Transfer' />
      </Link>
    </>
  )
}

type Props = OwnProps & { asset: NftAsset }

export default CTA
