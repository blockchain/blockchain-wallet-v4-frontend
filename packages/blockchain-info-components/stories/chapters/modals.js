import React from 'react'
import { storiesOf } from '@storybook/react'
import { withInfo } from '@storybook/addon-info'

import Layout from '../components/layout'
import { Modal, ModalHeader, ModalBody, ModalFooter } from '../../src'

storiesOf('Modals', module)
  .addDecorator(story => (<Layout height='600px'>{story()}</Layout>))
  .addDecorator((story, context) => withInfo({ text: 'Documentation', inline: true })(story)(context))
  .add('Modal', () =>
    <Modal>
      <ModalHeader>This is my header</ModalHeader>
      <ModalBody>This is my content</ModalBody>
      <ModalFooter>This is my footer</ModalFooter>
    </Modal>)
  .add('Modal with icon', () =>
    <Modal>
      <ModalHeader icon='alert'>This is my header</ModalHeader>
      <ModalBody>This is my content</ModalBody>
    </Modal>)
  .add('Modal without close button', () =>
    <Modal>
      <ModalHeader closeButton={false}>This is my header</ModalHeader>
      <ModalBody>This is my content</ModalBody>
    </Modal>)
  .add('Multiple modals', () =>
    <div>
      <Modal position={1} total={2} size='large'>
        <ModalHeader>This is my first header</ModalHeader>
        <ModalBody>This is my first modal</ModalBody>
      </Modal>
      <Modal position={2} total={2} size='medium'>
        <ModalHeader>This is my second header</ModalHeader>
        <ModalBody>This is my second modal</ModalBody>
      </Modal>
    </div>)
