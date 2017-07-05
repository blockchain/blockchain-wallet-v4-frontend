import React from 'react'
import * as ReactBootstrap from 'react-bootstrap'

const Modal = (props) => (<ReactBootstrap.Modal {...props} />)

const ModalHeader = (props) => (<ReactBootstrap.ModalHeader {...props} />)

const ModalBody = (props) => (<ReactBootstrap.ModalBody {...props} />)

const ModalFooter = (props) => (<ReactBootstrap.ModalFooter {...props} />)

export { Modal, ModalHeader, ModalBody, ModalFooter }
