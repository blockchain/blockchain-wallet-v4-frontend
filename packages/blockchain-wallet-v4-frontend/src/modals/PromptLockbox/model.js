import React from 'react'
import { FormattedMessage } from 'react-intl'

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
    content: coin => (
      <FormattedMessage
        id='modals.promptforlockbox.connectcoinapp'
        defaultMessage='Connect and unlock your hardware device. Then open the {coin} app on the device.'
        values={{ coin }}
      />
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
    title: coin => (
      <FormattedMessage
        id='modals.promptforlockbox.connectcoinapp.title.success'
        defaultMessage='Your {coin} Transaction Was Sent'
        values={{ coin }}
      />
    ),
    content: () => (
      <FormattedMessage
        id='modals.promptforlockbox.connectcoinapp.success'
        defaultMessage='Your transaction was sent. Please allow for it to confirm on the network.'
      />
    ),
    image: () => 'lockbox-send-confirmed',
    srcset: () => ({
      'lockbox-send-confirmed2': '2x',
      'lockbox-send-confirmed3': '3x'
    })
  },
  error: {
    name: 'error',
    index: 3,
    title: coin => (
      <FormattedMessage
        id='modals.promptforlockbox.connectcoinapp.title.error'
        defaultMessage='Transaction Failed'
        values={{ coin }}
      />
    ),
    content: () => (
      <FormattedMessage
        id='modals.promptforlockbox.connectcoinapp.error'
        defaultMessage='Something went wrong. Please reconnect your device and try again.'
      />
    ),
    image: () => '',
    srcset: () => ({})
  }
}
