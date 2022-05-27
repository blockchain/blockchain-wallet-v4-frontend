import { nonTraitFilters } from 'data/components/nfts/utils'
import { OwnerQuery } from 'generated/graphql.types'

import { NftFilterFormValuesType } from '../NftFilter'

export const getTraitFilters = (formValues: NftFilterFormValuesType) =>
  formValues ? Object.keys(formValues).filter((val) => nonTraitFilters.indexOf(val) === -1) : null

export const getMinMaxFilters = (formValues: NftFilterFormValuesType) =>
  formValues ? Object.keys(formValues).filter((val) => val === 'min' || val === 'max') : null

export const getCollectionsFilter = (
  formValues: NftFilterFormValuesType,
  collections: OwnerQuery['assets'][0]['collection'][]
) =>
  formValues?.collections
    ? collections
        .filter((collection) =>
          Object.keys(formValues.collections)
            .filter((collection) => formValues.collections[collection])
            .includes(collection.slug)
        )
        .map(({ name }) => name) || null
    : null

export const getEventsFilter = (formValues: NftFilterFormValuesType) =>
  formValues?.events
    ? Object.keys(formValues.events).filter((event) => formValues.events[event])
    : null

export const getSortBy = (formValues: NftFilterFormValuesType) => formValues?.sortBy
