import React from 'react'
import { FormattedMessage } from 'react-intl'

import { Text } from 'blockchain-info-components'

export const CONFIRM_STEPS = {
  connect: {
    name: 'connect',
    index: 1,
    title: () => (
      <FormattedMessage
        id='modals.lockbox.connectionprompt.connect.title'
        defaultMessage='Connect Your Lockbox'
      />
    ),
    content: (appName, isTx) =>
      isTx ? (
        <FormattedMessage
          id='modals.lockbox.connectionprompt.connect.content'
          defaultMessage='Connect and unlock your hardware device. Then open the {appName} app on the device.'
          values={{ appName }}
        />
      ) : (
        <React.Fragment>
          <FormattedMessage
            id='modals.lockbox.connectionprompt.connect.generic'
            defaultMessage='Connect and unlock your hardware device. Then open the {appName} app on the device.'
            values={{ appName }}
          />
          <Text weight={500} size='14px' style={{ marginTop: '20px' }}>
            <FormattedMessage
              id='modals.lockbox.connectionprompt.connect.managernote'
              defaultMessage='Note: If you do not have the {appName} app on your device you can install it via the App Manager.'
              values={{ appName }}
            />
          </Text>
        </React.Fragment>
      ),
    image: () => 'lockbox-send-connect',
    srcset: () => ({
      'lockbox-send-connect2': '2x',
      'lockbox-send-connect3': '3x'
    })
  },
  ready: {
    name: 'ready',
    index: 2,
    title: () => (
      <FormattedMessage
        id='modals.lockbox.connectionprompt.ready.title'
        defaultMessage='Review Transaction Details'
      />
    ),
    content: () => (
      <FormattedMessage
        id='modals.lockbox.connectionprompt.ready.content'
        defaultMessage='Review the transaction details on your device screen. Press the top right button to confirm and sign the transaction.'
      />
    ),
    image: () => 'lockbox-send-review',
    srcset: () => ({
      'lockbox-send-review2': '2x',
      'lockbox-send-review3': '3x'
    })
  },
  success: {
    name: 'success',
    index: 3,
    title: (appName, isTx) =>
      isTx ? (
        <FormattedMessage
          id='modals.lockbox.connectionprompt.success.title'
          defaultMessage='Your {appName} Transaction Was Sent'
          values={{ appName }}
        />
      ) : (
        <FormattedMessage
          id='modals.lockbox.connectionprompt.success.titlegeneric'
          defaultMessage='{appName} Success'
          values={{ appName }}
        />
      ),
    content: (appName, isTx) =>
      isTx ? (
        <FormattedMessage
          id='modals.lockbox.connectionprompt.success.content'
          defaultMessage='Please allow for it to confirm on the network.'
        />
      ) : (
        <FormattedMessage
          id='modals.lockbox.connectionprompt.success.contentgeneric'
          defaultMessage='{appName} successfully connected.'
          values={{ appName }}
        />
      ),
    image: () => 'lockbox-success',
    srcset: () => ({
      'lockbox-success2': '2x',
      'lockbox-success3': '3x'
    })
  },
  error: {
    name: 'error',
    index: 3,
    title: (appName, isTx) =>
      isTx ? (
        <FormattedMessage
          id='modals.lockbox.connectionprompt.error.txtitle'
          defaultMessage='Transaction Failed'
        />
      ) : (
        <FormattedMessage
          id='modals.lockbox.connectionprompt.error.generictitle'
          defaultMessage='An Error Occurred'
        />
      ),
    content: () => (
      <FormattedMessage
        id='modals.lockbox.connectionprompt.error.content'
        defaultMessage='Something went wrong. Please reconnect your device and try again.'
      />
    ),
    image: () => 'lockbox-failed',
    srcset: () => ({
      'lockbox-failed2': '2x',
      'lockbox-failed3': '3x'
    })
  }
}
