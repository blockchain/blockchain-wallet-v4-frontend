import React from 'react'
import * as ReactBootstrap from 'react-bootstrap'

import HelpBlock from './HelpBlock'
import PasswordBox from './PasswordBox'
import TextBox from './TextBox'

const Form = (props) => (<ReactBootstrap.Form {...props} />)

const FormGroup = (props) => (<ReactBootstrap.FormGroup {...props} />)

const ControlLabel = (props) => (<ReactBootstrap.ControlLabel {...props} />)

const FormControl = (props) => (<ReactBootstrap.FormControl {...props} />)

export { Form, FormGroup, ControlLabel, FormControl, HelpBlock, TextBox, PasswordBox }
