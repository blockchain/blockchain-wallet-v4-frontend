import React from 'react'
import { IconClose, PaletteColors } from '@blockchain-com/constellation'

import { Flex } from 'components/Flex'
import { GenericNabuError } from 'components/GenericNabuError'
import { Padding } from 'components/Padding'

import { IconButton } from './GenericNabuErrorFlyout.styles'
import { GenericNabuErrorFlyoutComponent } from './GenericNabuErrorFlyout.types'

const GenericNabuErrorFlyout: GenericNabuErrorFlyoutComponent = ({ error, onDismiss }) => {
  return (
    <Flex flexDirection='column' style={{ height: '100%' }}>
      <Padding top={40} horizontal={40}>
        <Flex justifyContent='flex-end'>
          <IconButton onClick={onDismiss} type='button'>
            <IconClose color={PaletteColors['grey-600']} label='close' size='small' />
          </IconButton>
        </Flex>
      </Padding>

      <Flex alignItems='center' justifyContent='center' style={{ flexGrow: 1 }}>
        <Padding horizontal={40}>
          <GenericNabuError error={error} onDismiss={onDismiss} />
        </Padding>
      </Flex>
    </Flex>
  )
}

export default GenericNabuErrorFlyout
