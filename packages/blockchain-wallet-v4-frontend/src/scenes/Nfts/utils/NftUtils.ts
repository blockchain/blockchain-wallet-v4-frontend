import { NftAsset } from '@core/network/api/nfts/types'
import {
  OPENSEA_SHARED_MARKETPLACE,
  OPENSEA_SHARED_MARKETPLACE_RINKEBY
} from '@core/redux/payment/nfts/constants'
import { nonTraitFilters } from 'data/components/nfts/utils'
import { OwnerQuery } from 'generated/graphql.types'

import { NftFilterFormValuesType } from '../NftFilter'

export const getTraitFilters = (formValues: NftFilterFormValuesType) =>
  formValues ? Object.keys(formValues).filter((val) => nonTraitFilters.indexOf(val) === -1) : null

export const getMinMaxFilters = (formValues: NftFilterFormValuesType) =>
  formValues ? Object.keys(formValues).filter((val) => val === 'min' || val === 'max') : null

export const getCollectionFilter = (
  formValues: NftFilterFormValuesType,
  collections: OwnerQuery['assets'][0]['collection'][]
) =>
  formValues
    ? collections.find((collection) => collection.slug === formValues.collection)?.name || null
    : null

export const getEventFilter = (formValues: NftFilterFormValuesType) =>
  formValues ? formValues.event : null

export const getForSaleFilter = (formValues: NftFilterFormValuesType) =>
  formValues ? formValues.forSale : null

export const getVerifiedFilter = (formValues: NftFilterFormValuesType) =>
  formValues ? formValues.verifiedOnly : null

export const getSortBy = (formValues: NftFilterFormValuesType) => formValues?.sortBy

export const getIsSharedStorefront = (asset?: NftAsset) => {
  if (!asset) return false
  return (
    asset.asset_contract.address === OPENSEA_SHARED_MARKETPLACE_RINKEBY ||
    asset.asset_contract.address === OPENSEA_SHARED_MARKETPLACE
  )
}
