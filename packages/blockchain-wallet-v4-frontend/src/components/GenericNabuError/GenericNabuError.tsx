import React, { useCallback } from 'react'
import { IconAlert } from '@blockchain-com/icons'

import { Button } from 'blockchain-info-components'
import { IconBadge } from 'components/Badge'
import {
  ActionsList,
  ErrorContent,
  ErrorIconWithSeverity,
  GenericErrorLayout
} from 'components/GenericError'
import { useDeepLink } from 'services/deepLinkListener'
import { NabuErrorAction } from 'services/errors'

import { GenericNabuErrorComponent } from './GenericNabuError.types'

const GenericNabuError: GenericNabuErrorComponent = ({ error, onDismiss }) => {
  const { onClickDeepLink } = useDeepLink()
  const { icon } = error
  const { actions } = error

  const handleOnClickLaunchAction = useCallback(
    (action: NabuErrorAction) => {
      const { url } = action

      onDismiss?.()

      if (url) {
        onClickDeepLink(url)
      }
    },
    [onClickDeepLink, onDismiss]
  )

  return (
    <GenericErrorLayout>
      <ErrorIconWithSeverity
        iconStatusUrl={icon?.status?.url || ''}
        iconUrl={icon?.url || ''}
        statusFallback={
          <IconBadge color='orange600' size={1.5}>
            <IconAlert />
          </IconBadge>
        }
      />

      <ErrorContent title={error.title} message={error.message} />

      {!!actions?.length && (
        <ActionsList>
          {actions.map((action) => (
            <Button
              key={action.title}
              data-e2e='close-action'
              nature='primary'
              onClick={() => handleOnClickLaunchAction(action)}
            >
              {action.title}
            </Button>
          ))}
        </ActionsList>
      )}
    </GenericErrorLayout>
  )
}

export default GenericNabuError
