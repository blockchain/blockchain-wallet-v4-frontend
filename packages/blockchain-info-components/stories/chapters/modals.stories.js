import React from 'react'
import { withInfo } from '@storybook/addon-info'
import { addDecorator } from '@storybook/react'

import Layout from '../components/layout'
import { Modal, ModalHeader, ModalBody, ModalFooter } from '../../src'

addDecorator(withInfo)

export default {
  title: 'Modals',
  parameters: {
    info: { text: 'Documentation', inline: true }
  },
  decorators: [(story) => <Layout height='600px'>{story()}</Layout>]
}

export const _Modal = () => (
  <Modal>
    <ModalHeader>This is my header</ModalHeader>
    <ModalBody>This is my content</ModalBody>
    <ModalFooter>This is my footer</ModalFooter>
  </Modal>
)

export const ModalInitializing = () => (
  <Modal>
    <ModalHeader>This is my header</ModalHeader>
    <ModalBody loading>This is my content</ModalBody>
    <ModalFooter>This is my footer</ModalFooter>
  </Modal>
)

ModalInitializing.story = {
  name: 'Modal initializing'
}

export const ModalWithSize = () => (
  <Modal size='small'>
    <ModalHeader>This is my header</ModalHeader>
    <ModalBody>This is my content</ModalBody>
  </Modal>
)

ModalWithSize.story = {
  name: 'Modal with size'
}

export const ModalWithIcon = () => (
  <Modal>
    <ModalHeader icon='alert'>This is my header</ModalHeader>
    <ModalBody>This is my content</ModalBody>
  </Modal>
)

ModalWithIcon.story = {
  name: 'Modal with icon'
}

export const ModalWithoutCloseButton = () => (
  <Modal>
    <ModalHeader closeButton={false}>This is my header</ModalHeader>
    <ModalBody>This is my content</ModalBody>
  </Modal>
)

ModalWithoutCloseButton.story = {
  name: 'Modal without close button'
}

export const ModalWithCallbackOnClose = () => (
  <Modal>
    <ModalHeader closeCallback={() => console.log('click on close!')}>
      This is my header
    </ModalHeader>
    <ModalBody>This is my content</ModalBody>
  </Modal>
)

ModalWithCallbackOnClose.story = {
  name: 'Modal with callback on close'
}

export const ModalWithFooterRight = () => (
  <Modal>
    <ModalHeader>This is my header</ModalHeader>
    <ModalBody>This is my content</ModalBody>
    <ModalFooter align='right'>This is my footer</ModalFooter>
  </Modal>
)

ModalWithFooterRight.story = {
  name: 'Modal with footer right'
}

export const ModalWithFooterCenter = () => (
  <Modal>
    <ModalHeader>This is my header</ModalHeader>
    <ModalBody>This is my content</ModalBody>
    <ModalFooter align='center'>This is my footer</ModalFooter>
  </Modal>
)

ModalWithFooterCenter.story = {
  name: 'Modal with footer center'
}

export const ModalWithFooterSpaced = () => (
  <Modal>
    <ModalHeader>This is my header</ModalHeader>
    <ModalBody>This is my content</ModalBody>
    <ModalFooter align='spaced'>
      <span>Footer content left</span>
      <span>Footer content right</span>
    </ModalFooter>
  </Modal>
)

ModalWithFooterSpaced.story = {
  name: 'Modal with footer spaced'
}

export const MultipleModals = () => (
  <div>
    <Modal position={1} total={2} size='large'>
      <ModalHeader>This is my first header</ModalHeader>
      <ModalBody>This is my first modal</ModalBody>
      <ModalBody>This is my first footer</ModalBody>
    </Modal>
    <Modal position={2} total={2} size='medium'>
      <ModalHeader>This is my second header</ModalHeader>
      <ModalBody>This is my second modal</ModalBody>
    </Modal>
  </div>
)

MultipleModals.story = {
  name: 'Multiple modals'
}
