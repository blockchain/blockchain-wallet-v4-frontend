import React, { useCallback, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { IconChevronDown, IconChevronUp, PaletteColors } from '@blockchain-com/constellation'

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
              {isToggled ? (
                <IconChevronUp color={PaletteColors['blue-600']} label='chevron-up' size='small' />
              ) : (
                <IconChevronDown
                  color={PaletteColors['blue-600']}
                  label='chevron-down'
                  size='small'
                />
              )}
            </Flex>
          </Button>
        </Padding>
      </Flex>
    </>
  )
}
