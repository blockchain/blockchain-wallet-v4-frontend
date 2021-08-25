import React from 'react'

import { FlyoutFooter, Button } from '../../src'

export default {
  title: 'Flyouts/Footer',
  component: FlyoutFooter,
}

export const ButtonFooter = (args) => {
  return (
    <FlyoutFooter {...args}>
      <Button nature='primary' fullwidth>Continue</Button>
    </FlyoutFooter>
  )
}
