import React from 'react'
import * as ReactBootstrap from 'react-bootstrap'

import CheckBox from './CheckBox'
import HelpBlock from './HelpBlock'
import LabelError from './LabelError'
import PasswordBox from './PasswordBox'
import TextBox from './TextBox'

const Form = (props) => (<ReactBootstrap.Form {...props} />)

const FormGroup = (props) => (<ReactBootstrap.FormGroup {...props} />)

const ControlLabel = (props) => (<ReactBootstrap.ControlLabel {...props} />)

const FormControl = (props) => (<ReactBootstrap.FormControl {...props} />)

export { CheckBox, ControlLabel, Form, FormGroup, FormControl, HelpBlock, LabelError, TextBox, PasswordBox }
