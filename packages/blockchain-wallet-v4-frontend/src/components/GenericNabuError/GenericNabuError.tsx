import React, { useCallback } from 'react'

import { Button } from 'blockchain-info-components'
import {
  ActionsList,
  ErrorContent,
  ErrorIconWithSeverity,
  GenericErrorLayout
} from 'components/GenericError'
import { useDeepLink } from 'services/deepLinkListener'
import { isNabuErrorCloseAction, isNabuErrorLaunchAction } from 'services/errors'
import { NabuErrorLaunchAction } from 'services/errors/NabuError/NabuError.types'

import { GenericNabuErrorComponent } from './GenericNabuError.types'

const GenericNabuError: GenericNabuErrorComponent = ({ error, onDismiss }) => {
  const { onClickDeepLink } = useDeepLink()
  const { icon } = error
  const { actions } = error

  const handleOnClickLaunchAction = useCallback(
    (action: NabuErrorLaunchAction) => {
      onDismiss?.()
      onClickDeepLink(action.url)
    },
    [onClickDeepLink, onDismiss]
  )

  return (
    <GenericErrorLayout>
      {!!icon && <ErrorIconWithSeverity iconStatusUrl={icon.status.url} iconUrl={icon.url} />}

      <ErrorContent title={error.title} message={error.message} />

      {!!actions?.length && (
        <ActionsList>
          {actions
            .map((action) => {
              if (isNabuErrorCloseAction(action)) {
                return (
                  <Button key={action.title} data-e2e='close-action' onClick={onDismiss}>
                    {action.title}
                  </Button>
                )
              }

              if (isNabuErrorLaunchAction(action)) {
                return (
                  <Button
                    key={action.title}
                    data-e2e='close-action'
                    nature='primary'
                    onClick={() => handleOnClickLaunchAction(action)}
                  >
                    {action.title}
                  </Button>
                )
              }

              return null
            })
            .filter((action) => !!action)}
        </ActionsList>
      )}
    </GenericErrorLayout>
  )
}

export default GenericNabuError
