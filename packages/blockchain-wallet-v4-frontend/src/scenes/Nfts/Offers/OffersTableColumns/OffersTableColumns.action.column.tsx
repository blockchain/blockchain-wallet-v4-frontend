/* eslint-disable no-console */
import React from 'react'
import { FormattedMessage } from 'react-intl'
import { useDispatch } from 'react-redux'

import { NftAsset } from '@core/network/api/nfts/types'
import { Button } from 'blockchain-info-components'
import { CellHeaderText } from 'components/Table'
import { actions } from 'data'
import { NftOrderStepEnum } from 'data/components/nfts/types'

import { getIsSharedStorefront } from '../../utils/NftUtils'

export const getActionColumn = (defaultEthAddr, isOwner: boolean, asset?: NftAsset) => ({
  Cell: ({ row: { original: values } }) => {
    const dispatch = useDispatch()
    const IS_SHARED_STOREFRONT = getIsSharedStorefront(asset as NftAsset)
    const isMaker = defaultEthAddr.toLowerCase() === values.maker.address.toLowerCase()
    const canPerformAction = isOwner || isMaker

    return (
      <>
        {canPerformAction && asset ? (
          <Button
            style={{ padding: '4px 8px' }}
            nature={isOwner ? 'primary' : 'empty-blue'}
            onClick={() => {
              if (IS_SHARED_STOREFRONT) {
                dispatch(
                  actions.components.nfts.nftOrderFlowOpen_LEGACY({
                    asset_contract_address: asset.asset_contract.address,
                    order: values,
                    step: isOwner ? NftOrderStepEnum.ACCEPT_OFFER : NftOrderStepEnum.CANCEL_OFFER,
                    token_id: asset.token_id
                  })
                )
              } else {
                dispatch(
                  actions.components.nfts.nftOrderFlowOpen({
                    asset_contract_address: asset.asset_contract.address,
                    seaportOrder: values,
                    step: isOwner ? NftOrderStepEnum.ACCEPT_OFFER : NftOrderStepEnum.CANCEL_OFFER,
                    token_id: asset.token_id
                  })
                )
              }
            }}
            small
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
