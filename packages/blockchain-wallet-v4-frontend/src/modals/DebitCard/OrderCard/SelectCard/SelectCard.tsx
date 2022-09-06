import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { actions, selectors } from 'data'
import { DebitCardError } from 'data/components/debitCard/model'
import { useRemote } from 'hooks'

import { Loading, LoadingTextEnum } from '../../../components'
import { LoadingWrapper } from '../OrderCard.model'
import SelectCardFailure from './SelectCard.template.failure'
import SelectCardNotAsked from './SelectCard.template.notasked'
import SelectCardSuccess from './SelectCard.template.success'

// we only have one for the MVP, so we can just use the first virtual card
const PRODUCT_CODE = 'VIRTUAL1'

const SelectCard = ({ handleClose }: { handleClose: () => void }) => {
  const { hasData, hasError, isLoading } = useRemote(
    selectors.components.debitCard.getCardCreationData
  )

  const products = useSelector(selectors.components.debitCard.getProducts)

  const dispatch = useDispatch()

  // for now we only have virtual cards, so we can just use the first product
  const productCode = products.find(({ productCode }) => productCode === PRODUCT_CODE)?.productCode

  if (!productCode) throw new Error(DebitCardError.NO_PRODUCT_CODE)

  const handleCreateCard = () => {
    dispatch(actions.components.debitCard.createCard(productCode))
  }

  if (hasError) {
    return <SelectCardFailure handleClose={handleClose} handleRetry={handleCreateCard} />
  }

  if (isLoading) {
    return (
      <LoadingWrapper>
        <Loading text={LoadingTextEnum.PROCESSING} />
      </LoadingWrapper>
    )
  }

  if (hasData) {
    return <SelectCardSuccess handleClose={handleClose} />
  }

  return <SelectCardNotAsked handleClose={handleClose} handleCreateCard={handleCreateCard} />
}

export default SelectCard
