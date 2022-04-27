import React from 'react'
import { FormattedMessage } from 'react-intl'

import { Flex } from 'components/Flex'
import Flyout, { FlyoutChild } from 'components/Flyout'
import { useFlyoutOpenState } from 'components/Flyout/hooks'
import { FlyoutContainer, FlyoutContent, FlyoutHeader } from 'components/Flyout/Layout'
import { Padding } from 'components/Padding'

import { GenericErrorFlyoutComponent } from './GenericErrorFlyout.types'

export const GenericErrorFlyout: GenericErrorFlyoutComponent = ({
  close = () => null,
  userClickedOutside = false,
  children,
  actions
}) => {
  const { isOpen, onPressClose } = useFlyoutOpenState({
    initialValue: true,
    onClose: () => close('GENERIC_ERROR_MODAL')
  })

  return (
    <Flyout isOpen={isOpen && !userClickedOutside} position={0} onClose={onPressClose} total={1}>
      <FlyoutChild>
        <FlyoutContainer>
          <FlyoutHeader onClick={onPressClose} mode='close' data-e2e='showWalletCloseFlyout' />

          <FlyoutContent mode='middle'>
            <Padding horizontal={40}>
              <Flex flexDirection='column' gap={40}>
                <Flex gap={24} flexDirection='column' alignItems='stretch' justifyContent='center'>
                  {children}
                </Flex>

                {actions}
              </Flex>
            </Padding>
          </FlyoutContent>
        </FlyoutContainer>
      </FlyoutChild>
    </Flyout>
  )
}
