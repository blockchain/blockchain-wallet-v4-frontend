import React from 'react'
import { Faq, FaqContent, FaqHeader } from './../FaqItem'

const FaqRow = props => {
  const { toggled, handleToggle } = props

  return (
    <Faq>
      <FaqHeader toggled={toggled} handleToggle={handleToggle}>
        {props.title}
      </FaqHeader>
      <FaqContent toggled={toggled}>
        {props.description}
      </FaqContent>
    </Faq>
  )
}

export default FaqRow
