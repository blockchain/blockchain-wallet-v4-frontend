import { OwnerQuery } from 'generated/graphql'

import { NftFilterFormValuesType } from '../NftFilter'

const nonTraitFilters = ['min', 'max', 'sortBy', 'forSale']

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

export const getSortBy = (formValues: NftFilterFormValuesType) => formValues?.sortBy
