import React from 'react'
import { Faq, FaqContent, FaqHeader } from './../FaqItem'

const FaqRow = ({ title, description, toggled, handleToggle, ...rest }) => {
  return (
    <Faq {...rest}>
      <FaqHeader toggled={toggled} handleToggle={handleToggle}>
        {title}
      </FaqHeader>
      <FaqContent toggled={toggled}>
        {description}
      </FaqContent>
    </Faq>
  )
}

export default FaqRow
