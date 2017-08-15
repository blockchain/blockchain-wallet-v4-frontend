import React from 'react'

import { Button, PrimaryButton, SecondaryButton } from 'components/Buttons'
import * as comp from 'components'
console.log(comp)

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
