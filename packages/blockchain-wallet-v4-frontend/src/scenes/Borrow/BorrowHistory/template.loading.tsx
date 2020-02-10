import { FormattedMessage } from 'react-intl'
import { History, MainTitle } from './template.success'
import React from 'react'

interface Props {}

const Loading: React.FC<Props> = () => {
  return (
    <History>
      <MainTitle size='24px' color='grey800' weight={600}>
        <FormattedMessage
          id='scenes.borrow.loading.history'
          defaultMessage='Loading History...'
        />
      </MainTitle>
    </History>
  )
}

export default Loading
