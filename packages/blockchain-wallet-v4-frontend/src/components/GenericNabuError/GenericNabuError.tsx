import React from 'react'

import { ErrorContent, ErrorIconWithSeverity, GenericErrorLayout } from 'components/GenericError'

import { GenericNabuErrorComponent } from './GenericNabuError.types'

const GenericNabuError: GenericNabuErrorComponent = ({ error }) => {
  const icon = error?.icon

  return (
    <GenericErrorLayout>
      {!!icon && <ErrorIconWithSeverity iconStatusUrl={icon.status.url} iconUrl={icon.url} />}

      <ErrorContent title={error.title} message={error.message} />
    </GenericErrorLayout>
  )
}

export default GenericNabuError
