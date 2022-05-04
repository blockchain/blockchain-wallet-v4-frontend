import React from 'react'

import { ErrorContent, GenericErrorLayout, ImageWithSeverity } from 'components/GenericError'

import { GenericNabuErrorComponent } from './GenericNabuError.types'

const GenericNabuError: GenericNabuErrorComponent = ({ error }) => {
  const iconSrc = error.icon

  return (
    <GenericErrorLayout>
      {!!iconSrc && (
        <ImageWithSeverity>
          <img alt='' style={{ height: 72, width: 72 }} src={iconSrc} />
        </ImageWithSeverity>
      )}

      <ErrorContent title={error.title} message={error.message} />
    </GenericErrorLayout>
  )
}

export default GenericNabuError
