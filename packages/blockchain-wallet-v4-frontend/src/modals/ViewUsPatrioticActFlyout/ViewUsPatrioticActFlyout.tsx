import React, { useCallback, useState } from 'react'
import { FormattedMessage } from 'react-intl'

import { Icon, Text } from 'blockchain-info-components'
import { Divider } from 'components/Divider'
import { Flex } from 'components/Flex'
import Flyout, { duration } from 'components/Flyout'
import { Padding } from 'components/Padding'
import { ModalName } from 'data/types'
import modalEnhancer from 'providers/ModalEnhancer'

import { CloseIconContainer } from './ViewUsPatrioticActFlyout.model'
import { ViewUsPatrioticActFlyoutComponent } from './ViewUsPatrioticActFlyout.types'

export const ViewUsPatrioticActFlyout: ViewUsPatrioticActFlyoutComponent = ({
  close,
  position,
  total,
  userClickedOutside
}) => {
  const [isOpen, setOpen] = useState<boolean>(true)

  const handleClose = useCallback(async () => {
    setOpen(false)

    await new Promise((resolve) => {
      setTimeout(() => {
        close?.call(ModalName.VIEW_PRIVATE_KEY_WALLET)

        setTimeout(resolve, 0)
      }, duration)
    })
  }, [close])

  const closeButton = (
    <CloseIconContainer onClick={handleClose}>
      <Icon data-e2e='bankDetailsCloseIcon' name='close' size='20px' color='grey600' />
    </CloseIconContainer>
  )

  return (
    <Flyout
      position={position}
      isOpen={isOpen}
      userClickedOutside={userClickedOutside}
      onClose={handleClose}
      data-e2e='privateKeyModal'
      total={total}
    >
      <Padding horizontal={40} top={40} bottom={32}>
        <Flex justifyContent='space-between' alignItems='center' gap={16}>
          <Flex gap={16} alignItems='center'>
            <Text weight={600} size='20px' lineHeight='30px' color='grey900'>
              <FormattedMessage id='modals.patriotic_act.title' defaultMessage='US Patriot Act' />
            </Text>
          </Flex>

          {closeButton}
        </Flex>
      </Padding>
      <Divider />

      <Padding horizontal={40} top={24} bottom={24}>
        <Text weight={600} size='24px' color='grey900'>
          <FormattedMessage
            id='modals.patriotic_act.subtitle'
            defaultMessage='US Patriot Act Disclosure'
          />
        </Text>

        <Padding top={8}>
          <Text weight={500} size='16px' color='grey900' style={{ marginBottom: '4px' }}>
            <FormattedMessage
              id='modals.patriotic_act.section_title'
              defaultMessage='USA PATRIOT ACT Section 326 - Customer'
            />
          </Text>
          <Text weight={500} size='16px' color='grey900' style={{ marginBottom: '4px' }}>
            <FormattedMessage
              id='modals.patriotic_act.section_subtitle'
              defaultMessage='Identification Program'
            />
          </Text>
          <Text weight={400} size='16px' color='grey600'>
            <FormattedMessage
              id='modals.patriotic_act.section_description'
              defaultMessage='To help the government fight the funding of terrorism and money laundering activities, Federal law requires all financial institutions to obtain, verify, and record information that identifies each person who opens an account.'
            />
          </Text>

          <Padding top={32}>
            <Text weight={500} size='16px' color='grey900' style={{ marginBottom: '4px' }}>
              <FormattedMessage
                id='modals.patriotic_act.purpose_title'
                defaultMessage='What this means for you'
              />
            </Text>
            <Text weight={400} size='16px' color='grey600'>
              <FormattedMessage
                id='modals.patriotic_act.purpose_description'
                defaultMessage={`When you open an account, we will ask for your name, address, date of birth, and other information that will allow us to identify you. We may also ask to see your driver's license or other identifying documents.`}
              />
            </Text>
          </Padding>
        </Padding>
      </Padding>
    </Flyout>
  )
}

const enhance = modalEnhancer(ModalName.US_PATRIOTIC_ACT, { transition: duration })

export default enhance(ViewUsPatrioticActFlyout)
