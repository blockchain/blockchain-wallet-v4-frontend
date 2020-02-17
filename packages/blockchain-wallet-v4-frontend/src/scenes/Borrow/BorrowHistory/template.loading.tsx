import { FormattedMessage } from 'react-intl'
import { MainTitle } from './template.success'
import React from 'react'

interface Props {}

const Loading: React.FC<Props> = () => {
  return (
    <MainTitle size='24px' color='grey800' weight={600}>
      <FormattedMessage
        id='scenes.borrow.loading.history'
        defaultMessage='Loading History...'
      />
    </MainTitle>
  )
}

export default Loading
