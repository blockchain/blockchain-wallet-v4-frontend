/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react'
import { useDispatch } from 'react-redux'

import { actions } from 'data'

const CryptoAddress: React.FC<Props> = ({ canCopy, children, onCopySuccess }) => {
  const dispatch = useDispatch()

  if (!children) return null

  return (
    <span
      onClick={() => {
        if (canCopy) {
          navigator.clipboard.writeText(children).then(() => {
            if (onCopySuccess) {
              onCopySuccess(children)
            }
          })

          dispatch(actions.alerts.displaySuccess('Copied to clipboard!'))
        }
      }}
      style={{ cursor: canCopy ? 'grab' : 'inherit' }}
    >
      {children.slice(0, 5)}...
      {children.slice(children.length - 5, children.length)}
    </span>
  )
}

type Props = {
  canCopy?: boolean
  children: string
  onCopySuccess?(address?: string): void
}

export default CryptoAddress
