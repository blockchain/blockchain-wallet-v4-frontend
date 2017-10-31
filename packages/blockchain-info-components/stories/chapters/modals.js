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
  .add('Modal initializing', () =>
    <Modal>
      <ModalHeader>This is my header</ModalHeader>
      <ModalBody loading>This is my content</ModalBody>
      <ModalFooter>This is my footer</ModalFooter>
    </Modal>)
  .add('Modal with size', () =>
    <Modal size='small'>
      <ModalHeader>This is my header</ModalHeader>
      <ModalBody>This is my content</ModalBody>
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
  .add('Modal with callback on close', () =>
    <Modal>
      <ModalHeader closeCallback={() => console.log('click on close!')}>This is my header</ModalHeader>
      <ModalBody>This is my content</ModalBody>
    </Modal>)
  .add('Modal with footer right', () =>
    <Modal>
      <ModalHeader>This is my header</ModalHeader>
      <ModalBody>This is my content</ModalBody>
      <ModalFooter align='right'>This is my footer</ModalFooter>
    </Modal>)
  .add('Modal with footer center', () =>
    <Modal>
      <ModalHeader>This is my header</ModalHeader>
      <ModalBody>This is my content</ModalBody>
      <ModalFooter align='center'>This is my footer</ModalFooter>
    </Modal>)
  .add('Modal with footer spaced', () =>
    <Modal>
      <ModalHeader>This is my header</ModalHeader>
      <ModalBody>This is my content</ModalBody>
      <ModalFooter align='spaced'><span>Footer content left</span><span>Footer content right</span></ModalFooter>
    </Modal>)
  .add('Multiple modals', () =>
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
    </div>)
