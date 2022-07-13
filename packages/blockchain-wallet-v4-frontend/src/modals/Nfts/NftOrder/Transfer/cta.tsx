import React from 'react'
import { FormattedMessage } from 'react-intl'

import { NftAsset } from '@core/network/api/nfts/types'
import { Button, HeartbeatLoader, Text } from 'blockchain-info-components'

import NftNotInvited from '../../components/NftNotInvited'
import PendingEthTxMessage from '../../components/PendingEthTxMessage'
import { Props as OwnProps } from '.'

const CTA: React.FC<Props> = ({ asset, formValues, isInvited, nftActions, orderFlow }) => {
  const { userHasPendingTxR } = orderFlow
  const disabled = formValues ? !formValues.to || orderFlow.isSubmitting : true

  if (!isInvited) return <NftNotInvited />

  const userHasPendingTx = userHasPendingTxR.getOrElse(false)

  if (userHasPendingTx)
    return (
      <>
        <PendingEthTxMessage />
        <br />
        <Button jumbo nature='primary' fullwidth data-e2e='transferNft' disabled>
          <FormattedMessage id='copy.transfer' defaultMessage='Transfer' />
        </Button>
      </>
    )

  return (
    <div>
      {orderFlow.fees.cata({
        Failure: (e) => (
          <>
            <Text size='14px' weight={600} style={{ marginBottom: '8px', maxHeight: '200px' }}>
              {e}
            </Text>
            <Button jumbo nature='sent' fullwidth data-e2e='sellNft' disabled>
              <FormattedMessage id='copy.transfer' defaultMessage='Transfer' />
            </Button>
          </>
        ),
        Loading: () => (
          <Button jumbo nature='primary' fullwidth data-e2e='sellNft' disabled>
            <FormattedMessage id='copy.transfer' defaultMessage='Transfer' />
          </Button>
        ),
        NotAsked: () => null,
        Success: (fees) => (
          <Button
            jumbo
            nature='primary'
            fullwidth
            data-e2e='transferNft'
            disabled={disabled}
            type='submit'
            onClick={() =>
              nftActions.createTransfer({
                asset,
                gasData: fees,
                to: formValues.to
              })
            }
          >
            {orderFlow.isSubmitting ? (
              <HeartbeatLoader color='blue100' height='20px' width='20px' />
            ) : (
              <FormattedMessage id='copy.transfer' defaultMessage='Transfer' />
            )}
          </Button>
        )
      })}
    </div>
  )
}

type Props = OwnProps & { asset: NftAsset }

export default CTA
