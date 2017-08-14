import React from 'react'

import { Button, PrimaryButton, SecondaryButton, ButtonGroup } from 'components/Button'

const ButtonContainer = (props) => {
  return (
    <div>
      <Button>Button</Button>
      <br />
      <PrimaryButton>PrimaryButton</PrimaryButton>
      <br />
      <SecondaryButton>SecondaryButton</SecondaryButton>
    </div>
  )
}

export default ButtonContainer
