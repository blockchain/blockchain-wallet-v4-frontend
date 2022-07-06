import React, { useCallback, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { Icon } from '@blockchain-com/constellation'
import { IconChevronDown, IconChevronUp } from '@blockchain-com/icons'

import { Button } from 'blockchain-info-components'
import { Flex } from 'components/Flex'
import { Padding } from 'components/Padding'

import { ExpansionPanelComponent } from './types'

export const ExpansionPanel: ExpansionPanelComponent = ({ children }) => {
  const [isToggled, setToggle] = useState(false)

  const handleToggle = useCallback(() => {
    setToggle((t) => !t)
  }, [isToggled])

  return (
    <>
      {isToggled ? <div>{children}</div> : ''}
      <Flex justifyContent='center'>
        <Padding top={10}>
          <Button
            nature='white-blue'
            small
            data-e2e={isToggled ? 'showLess' : 'showMore'}
            onClick={handleToggle}
          >
            <Flex gap={8} alignItems='center'>
              <FormattedMessage
                id={`buttons.${isToggled ? 'show_less' : 'show_more'}`}
                defaultMessage={isToggled ? 'Show less' : 'Show more'}
              />
              <Icon label={isToggled ? 'chevron-up' : 'chevron-down'} color='blue600' size='sm'>
                {isToggled ? <IconChevronUp /> : <IconChevronDown />}
              </Icon>
            </Flex>
          </Button>
        </Padding>
      </Flex>
    </>
  )
}
