import React from 'react'
import * as Reactstrap from 'reactstrap'

const Container = (props) => (<Reactstrap.Container {...props} />)

const Row = (props) => (<Reactstrap.Row {...props} />)

const Col = (props) => (<Reactstrap.Col {...props} />)

export { Container, Row, Col }
