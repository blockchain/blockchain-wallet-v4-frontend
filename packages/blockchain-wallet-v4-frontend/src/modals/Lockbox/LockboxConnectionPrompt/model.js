import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Text } from 'blockchain-info-components'

export const CONFIRM_STEPS = {
  connect: {
    name: 'connect',
    index: 1,
    title: () => (
      <FormattedMessage
        id='modals.promptforlockbox.connectcoinapp.title.connect'
        defaultMessage='Connect Your Lockbox'
      />
    ),
    content: (coin, isTx) =>
      isTx ? (
        <FormattedMessage
          id='modals.promptforlockbox.connectcoinapp.content'
          defaultMessage='Connect and unlock your hardware device. Then open the {coin} app on the device.'
          values={{ coin }}
        />
      ) : (
        <React.Fragment>
          <FormattedMessage
            id='modals.promptforlockbox.connectcoinapp.contentgeneric'
            defaultMessage='Connect and unlock your hardware device. Then open the {coin} app on the device.'
            values={{ coin }}
          />
          <Text weight={400} size='14px' style={{ marginTop: '20px' }}>
            <FormattedMessage
              id='modals.promptforlockbox.connectcoinapp.contentgenericnote'
              defaultMessage='Note: If you do not have the {coin} app on your device you can install it via the settings page.'
              values={{ coin }}
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
        id='modals.promptforlockbox.connectcoinapp.title.review'
        defaultMessage='Review Transaction Details'
      />
    ),
    content: () => (
      <FormattedMessage
        id='modals.promptforlockbox.connectcoinapp.review'
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
    title: (coin, isTx) =>
      isTx ? (
        <FormattedMessage
          id='modals.promptforlockbox.connectcoinapp.title.success'
          defaultMessage='Your {coin} Transaction Was Sent'
          values={{ coin }}
        />
      ) : (
        <FormattedMessage
          id='modals.promptforlockbox.connectcoinapp.title.successgeneric'
          defaultMessage='{coin} Success'
          values={{ coin }}
        />
      ),
    content: (coin, isTx) =>
      isTx ? (
        <FormattedMessage
          id='modals.promptforlockbox.connectcoinapp.success'
          defaultMessage='Please allow for it to confirm on the network.'
        />
      ) : (
        <FormattedMessage
          id='modals.promptforlockbox.connectcoinapp.successgeneric'
          defaultMessage='{coin} successfully connected.'
          values={{ coin }}
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
    title: (coin, isTx) =>
      isTx ? (
        <FormattedMessage
          id='modals.promptforlockbox.connectcoinapp.title.error'
          defaultMessage='Transaction Failed'
          values={{ coin }}
        />
      ) : (
        <FormattedMessage
          id='modals.promptforlockbox.connectcoinapp.title.errorgeneric'
          defaultMessage='An Error Occurred'
        />
      ),
    content: () => (
      <FormattedMessage
        id='modals.promptforlockbox.connectcoinapp.error'
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
