/* eslint-disable no-console */
import React from 'react'
import { FormattedMessage } from 'react-intl'
import { useDispatch } from 'react-redux'

import { NftAsset } from '@core/network/api/nfts/types'
import { Button } from 'blockchain-info-components'
import { CellHeaderText } from 'components/Table'
import { actions } from 'data'
import { NftOrderStepEnum } from 'data/components/nfts/types'

export const getActionColumn = (defaultEthAddr, asset?: NftAsset) => ({
  Cell: ({ row: { original: values } }) => {
    const dispatch = useDispatch()
    const isOwner = defaultEthAddr.toLowerCase() === asset?.owner?.address
    const isMaker = defaultEthAddr.toLowerCase() === values.maker.address.toLowerCase()
    const canPerformAction = isOwner || isMaker

    return (
      <>
        {canPerformAction ? (
          <Button
            nature={isOwner ? 'primary' : 'empty-blue'}
            onClick={() =>
              dispatch(
                actions.components.nfts.nftOrderFlowOpen({
                  asset_contract_address: values.metadata.asset.address,
                  offer: isOwner ? undefined : values,
                  order: isOwner ? values : undefined,
                  step: isOwner ? NftOrderStepEnum.ACCEPT_OFFER : NftOrderStepEnum.CANCEL_OFFER,
                  token_id: values.metadata.asset.id
                })
              )
            }
            size='xsmall'
            data-e2e='actionOffer'
          >
            {isOwner ? (
              <FormattedMessage id='buttons.accept_offer' defaultMessage='Accept Offer' />
            ) : (
              <FormattedMessage id='buttons.cancel_offer' defaultMessage='Cancel Offer' />
            )}
          </Button>
        ) : null}
      </>
    )
  },
  Header: () => (
    <CellHeaderText>
      <FormattedMessage id='copy.actions' defaultMessage='Actions' />
    </CellHeaderText>
  ),
  accessor: 'cancel_order',
  disableGlobalFilter: true
})
