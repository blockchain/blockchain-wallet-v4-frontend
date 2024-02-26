import React, { Suspense } from 'react'
import { useSelector } from 'react-redux'

import { getModals } from 'data/modals/selectors'

import { CLOSABLE_MODALS_DICTIONARY, NON_CLOSABLE_MODALS_DICTIONARY } from './modalsDict'
// Do not lazy load this modal
import NewVersionAvailable from './Settings/NewVersionAvailable'

const Modals = () => {
  const modals = useSelector(getModals)

  return (
    <Suspense fallback={null}>
      {modals.map((modal) => {
        const ClosableComponent = CLOSABLE_MODALS_DICTIONARY[modal.type]
        if (ClosableComponent) {
          return <ClosableComponent key={modal.type} />
        }
        const UnclosableModal = NON_CLOSABLE_MODALS_DICTIONARY[modal.type]
        if (UnclosableModal) {
          return <UnclosableModal key={modal.type} disableOutsideClose />
        }
        return null
      })}

      {/* This should always be loaded */}
      <NewVersionAvailable disableOutsideClose />
    </Suspense>
  )
}

export default Modals
