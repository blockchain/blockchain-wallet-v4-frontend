import { useCallback } from 'react'
import { useDispatch } from 'react-redux'

import { actions } from 'data'
import { ModalName } from 'data/types'

import {
  OpenTransactionReportModalCallback,
  OpenTransactionReportModalHook
} from './useOpenTransactionReportModal.types'

const useOpenTransactionReportModal: OpenTransactionReportModalHook = () => {
  const dispatch = useDispatch()

  const open: OpenTransactionReportModalCallback = useCallback(
    ({ coin, origin }) => {
      dispatch(
        actions.modals.showModal(ModalName.TRANSACTION_REPORT_MODAL, {
          coin,
          origin
        })
      )
    },
    [dispatch]
  )

  return open
}

export default useOpenTransactionReportModal
