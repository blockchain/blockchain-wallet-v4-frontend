import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { Icon } from '@blockchain-com/constellation'
import { IconChevronDown, IconChevronUp } from '@blockchain-com/icons'

import { Button } from 'blockchain-info-components'
import { Flex } from 'components/Flex'
import { Padding } from 'components/Padding'

import { ExpansionPanelComponent } from './types'

export const ExpansionPanel: ExpansionPanelComponent = ({ children }) => {
  const [isToggled, handleToggle] = useState(false)

  return (
    <>
      {isToggled ? <div>{children}</div> : ''}
      <Padding top={10}>
        <Button
          nature='white-blue'
          small
          style={{ margin: '8px auto 0px' }}
          data-e2e={isToggled ? 'showLess' : 'showMore'}
          onClick={() => {
            handleToggle(!isToggled)
          }}
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
    </>
  )
}
