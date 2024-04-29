import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { Button as ConstellationButton } from '@blockchain-com/constellation'

import { Text } from 'blockchain-info-components'

import { ListContainer } from './Lines.styles'

type Props = {
  lines: string[]
}

export const Lines = ({ lines }: Props) => {
  const [isCollapsed, setIsCollapsed] = useState(false)

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed)
  }

  return (
    <div>
      <ListContainer $isCollapsed={isCollapsed}>
        <ul>
          {lines.map((line) => (
            <li key={line}>
              <Text size='14px' weight={500} color='grey900' lineHeight='150%'>
                {line}
              </Text>
            </li>
          ))}
        </ul>
      </ListContainer>
      <ConstellationButton
        type='button'
        variant='minimal'
        onClick={toggleCollapse}
        data-e2e='toggle-button'
        size='small'
        text={
          isCollapsed ? (
            <FormattedMessage defaultMessage='Read more' id='buttons.read_more' />
          ) : (
            <FormattedMessage defaultMessage='Read less' id='buttons.read_less' />
          )
        }
      />
    </div>
  )
}
