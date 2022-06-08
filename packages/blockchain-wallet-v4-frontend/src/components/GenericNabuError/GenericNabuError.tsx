import React, { useMemo } from 'react'

import { Button } from 'blockchain-info-components'
import {
  ActionsList,
  ErrorContent,
  ErrorIconWithSeverity,
  GenericErrorLayout
} from 'components/GenericError'
import { isNabuErrorCloseAction, isNabuErrorLaunchAction } from 'services/errors'

import { GenericNabuErrorComponent } from './GenericNabuError.types'

const GenericNabuError: GenericNabuErrorComponent = ({ error, onClickClose, onClickLaunch }) => {
  const { icon } = error
  const { actions } = error

  return (
    <GenericErrorLayout>
      {!!icon && <ErrorIconWithSeverity iconStatusUrl={icon.status.url} iconUrl={icon.url} />}

      <ErrorContent title={error.title} message={error.message} />

      {!!actions?.length && (
        <ActionsList>
          {actions.map((action) => {
            if (isNabuErrorCloseAction(action)) {
              return (
                <Button key={action.title} data-e2e='close-action' onClick={onClickClose}>
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
                  onClick={() => onClickLaunch?.(action)}
                >
                  {action.title}
                </Button>
              )
            }

            throw Error('Nabu Action type not handled')
          })}
        </ActionsList>
      )}
    </GenericErrorLayout>
  )
}

export default GenericNabuError
