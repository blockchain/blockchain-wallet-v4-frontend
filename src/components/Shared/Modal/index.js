import React from 'react'
import * as Reactstrap from 'reactstrap'

const Modal = (props) => (<Reactstrap.Modal {...props} />)

const ModalHeader = (props) => (<Reactstrap.ModalHeader {...props} />)

const ModalBody = (props) => (<Reactstrap.ModalBody {...props} />)

const ModalFooter = (props) => (<Reactstrap.ModalFooter {...props} />)

export { Modal, ModalHeader, ModalBody, ModalFooter }
