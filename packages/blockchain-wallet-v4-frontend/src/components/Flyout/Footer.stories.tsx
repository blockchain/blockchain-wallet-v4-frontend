import React from 'react'

import { Button } from 'blockchain-info-components'

import Footer from './Footer'

export default {
  component: Footer,
  title: 'Flyouts/Footer'
}

export const ButtonFooter = (args) => {
  return (
    <Footer {...args}>
      <Button data-e2e='foooo' nature='primary' fullwidth>
        Continue
      </Button>
    </Footer>
  )
}
