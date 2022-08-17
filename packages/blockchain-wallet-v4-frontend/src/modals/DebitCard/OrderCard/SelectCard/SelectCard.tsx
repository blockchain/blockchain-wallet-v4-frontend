import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { actions, selectors } from 'data'
import { useRemote } from 'hooks'

import { Loading, LoadingTextEnum } from '../../../components'
import { LoadingWrapper } from '../OrderCard.model'
import SelectCardFailure from './SelectCard.template.failure'
import SelectCardNotAsked from './SelectCard.template.notasked'
import SelectCardSuccess from './SelectCard.template.success'

const SelectCard = ({ handleClose }: { handleClose: () => void }) => {
  const { hasData, hasError, isLoading } = useRemote(
    selectors.components.debitCard.getCardCreationData
  )
  const [{ productCode }] = useSelector(selectors.components.debitCard.getProducts)
  const dispatch = useDispatch()

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
