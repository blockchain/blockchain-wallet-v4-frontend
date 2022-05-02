import React from 'react'
import { FormattedMessage } from 'react-intl'
import { useDispatch } from 'react-redux'
import { colors } from '@blockchain-com/constellation'

import { Button, Text } from 'blockchain-info-components'
import { CellHeaderText } from 'components/Table'
import { actions } from 'data'
import { NftOrderStepEnum } from 'data/components/nfts/types'

export const getOfferCancelColumn = () => ({
  Cell: ({ row: { original: values } }) => {
    const dispatch = useDispatch()
    return (
      // if(OfferBySelf) {
      //   <Button
      //     nature='empty-blue'
      //     onClick={() =>
      //       dispatch(
      //         actions.components.nfts.nftOrderFlowOpen({
      //           asset_contract_address: Offer.address,
      //           offer: Offer,
      //           step: NftOrderStepEnum.CANCEL_OFFER,
      //           token_id: OfferTokenId,
      //           walletUserIsAssetOwnerHack: true
      //         })
      //       )
      //     }
      //     size='xsmall'
      //     data-e2e='submitProfileDetails'
      //   >
      //     <Text color={colors.blue600} size='14px' weight={500}>
      //       <FormattedMessage id='modals.prompt.button' defaultMessage='Cancel Offer' />
      //     </Text>
      //   </Button>
      // }
      <div />
    )
  },
  Header: () => <CellHeaderText />,
  accessor: 'cancel_order',
  disableGlobalFilter: true
})
