/* eslint-disable no-console */
import React from 'react'
import { FormattedMessage } from 'react-intl'
import { useDispatch } from 'react-redux'
import { colors } from '@blockchain-com/constellation'

import { Button, Text } from 'blockchain-info-components'
import { CellHeaderText } from 'components/Table'
import { actions } from 'data'
import { NftOrderStepEnum } from 'data/components/nfts/types'

export const getOfferCancelColumn = (defaultEthAddr) => ({
  Cell: ({ row: { original: values } }) => {
    const dispatch = useDispatch()
    return (
      <>
        {defaultEthAddr.toLowerCase() === values.maker.address.toLowerCase() && (
          <Button
            nature='empty-blue'
            onClick={() =>
              dispatch(
                actions.components.nfts.nftOrderFlowOpen({
                  asset_contract_address: values.metadata.asset.address,
                  offer: values,
                  step: NftOrderStepEnum.CANCEL_OFFER,
                  token_id: values.metadata.asset.id,
                  walletUserIsAssetOwnerHack: true
                })
              )
            }
            size='xsmall'
            width='7em'
            data-e2e='submitProfileDetails'
          >
            <Text color={colors.blue600} size='14px' weight={500}>
              <FormattedMessage id='buttons.cancel_offer' defaultMessage='Cancel Offer' />
            </Text>
          </Button>
        )}
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
