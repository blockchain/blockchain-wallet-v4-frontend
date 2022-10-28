import { useCallback } from 'react'
import { useDispatch } from 'react-redux'

import { actions } from 'data'
import { ModalName } from 'data/types'

import {
  OpenViewUsPatrioticActCallback,
  OpenViewUsPatrioticActHook
} from './useOpenViewUsPatrioticAct.types'

export const useOpenViewUsPatrioticAct: OpenViewUsPatrioticActHook = () => {
  const dispatch = useDispatch()

  const openViewUsPatrioticAct: OpenViewUsPatrioticActCallback = useCallback(
    ({ origin }) => {
      dispatch(
        actions.modals.showModal(ModalName.US_PATRIOTIC_ACT, {
          origin
        })
      )
    },
    [dispatch]
  )

  return openViewUsPatrioticAct
}
