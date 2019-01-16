import React from 'react'
import { FormattedMessage } from 'react-intl'
// import styled from 'styled-components'

import { Text } from 'blockchain-info-components'

export const TOUR_STEPS = [
  {
    target: '.tour-step1',
    content: (
      <React.Fragment>
        <Text size='18px' weight={400} style={{ marginBottom: '16px' }}>
          <FormattedMessage
            id='scenes.lockbox.tour.stepone.title'
            defaultMessage='Welcome to your Lockbox!'
          />
        </Text>
        <Text size='14px' weight={300}>
          <FormattedMessage
            id='scenes.lockbox.tour.stepone.content'
            defaultMessage="Lockbox is organized by asset. Select an asset to view it's transaction history."
          />
        </Text>
      </React.Fragment>
    ),
    placement: 'bottom',
    disableBeacon: true,
    disableOverlayClose: true,
    hideCloseButton: true,
    spotlightClicks: true
  },
  {
    target: '.tour-step2',
    content: (
      <React.Fragment>
        <Text size='18px' weight={400} style={{ marginBottom: '16px' }}>
          <FormattedMessage
            id='scenes.lockbox.tour.steptwo.title'
            defaultMessage='Asset List'
          />
        </Text>
        <Text size='14px' weight={300}>
          <FormattedMessage
            id='scenes.lockbox.tour.steptwo.content'
            defaultMessage='These are the assets available to your Lockbox.  Your balances are shown by default.  Clicking on an asset with filter the transaction list to show just that asset.'
          />
        </Text>
      </React.Fragment>
    ),
    placement: 'bottom',
    disableBeacon: true,
    disableOverlayClose: true,
    hideCloseButton: true,
    spotlightClicks: true
  },
  {
    target: '.tour-step3',
    content: (
      <React.Fragment>
        <Text size='18px' weight={400} style={{ marginBottom: '16px' }}>
          <FormattedMessage
            id='scenes.lockbox.tour.stepthree.title'
            defaultMessage='Transaction Search'
          />
        </Text>
        <Text size='14px' weight={300}>
          <FormattedMessage
            id='scenes.lockbox.tour.stepthree.content'
            defaultMessage='Here you can search for any transaction made with your Lockbox by entering coin names, addresses or descriptions.'
          />
        </Text>
      </React.Fragment>
    ),
    placement: 'bottom',
    disableBeacon: true,
    disableOverlayClose: true,
    hideCloseButton: true,
    spotlightClicks: true
  },
  {
    target: '.tour-step4',
    content: (
      <React.Fragment>
        <Text size='18px' weight={400} style={{ marginBottom: '16px' }}>
          <FormattedMessage
            id='scenes.lockbox.tour.stepfour.title'
            defaultMessage='App Manager'
          />
        </Text>
        <Text size='14px' weight={300}>
          <FormattedMessage
            id='scenes.lockbox.tour.stepfour.content'
            defaultMessage='Want to add, update or remove applications?  Click here to manage all applications on your device.'
          />
        </Text>
      </React.Fragment>
    ),
    placement: 'bottom-end',
    disableBeacon: true,
    disableOverlayClose: true,
    hideCloseButton: true,
    spotlightClicks: true
  },
  {
    target: '.tour-step5',
    content: (
      <React.Fragment>
        <Text size='18px' weight={400} style={{ marginBottom: '16px' }}>
          <FormattedMessage
            id='scenes.lockbox.tour.stepfive.title'
            defaultMessage='Lockbox Settings'
          />
        </Text>
        <Text size='14px' weight={300}>
          <FormattedMessage
            id='scenes.lockbox.tour.stepfive.content'
            defaultMessage='Clicking here will bring you to the settings page where you can rename your device, install firmware updates, verify your devices authenticity and much more!'
          />
        </Text>
      </React.Fragment>
    ),
    placement: 'bottom-end',
    disableBeacon: true,
    disableOverlayClose: true,
    hideCloseButton: true,
    spotlightClicks: true
  }
]
