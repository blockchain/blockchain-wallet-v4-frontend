import React from 'react'
import { Faq, FaqContent, FaqHeader } from 'components/FaqItem'

const FaqRow = props => {
  const { title: Title, description: Description, toggled, handleToggle } = props

  return (
    <Faq>
      <FaqHeader toggled={toggled} handleToggle={handleToggle}>
        <Title />
      </FaqHeader>
      <FaqContent toggled={toggled}>
        <Description />
      </FaqContent>
    </Faq>
  )
}

export default FaqRow
