import React, { useEffect } from 'react'
import { FormattedMessage } from 'react-intl'
import { useDispatch } from 'react-redux'
import { SemanticColors, Text } from '@blockchain-com/constellation'

import { actions } from 'data'
import { Analytics } from 'data/types'

import { NoResultsWrapper } from './styles'
import { EmptyProps } from './types'

const COUNTER = 'COUNTER'

const Empty = ({ search = '', swapSide }: EmptyProps) => {
  const dispatch = useDispatch()
  useEffect(() => {
    if (swapSide === COUNTER) {
      dispatch(
        actions.analytics.trackEvent({
          key: Analytics.DEX_SWAP_OUTPUT_NOT_FOUND,
          properties: { text_searched: search }
        })
      )
    }
  }, [search, swapSide])
  return (
    <NoResultsWrapper>
      <Text color={SemanticColors.title} variant='body1'>
        <FormattedMessage id='dex.tokens.empty.no-results' defaultMessage='No results for' />
      </Text>
      <Text color={SemanticColors.body} variant='body2'>
        {search}
      </Text>
    </NoResultsWrapper>
  )
}

export default Empty
