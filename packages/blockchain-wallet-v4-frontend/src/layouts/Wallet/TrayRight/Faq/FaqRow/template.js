import React from 'react'
import PropTypes from 'prop-types'
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

FaqRow.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  toggled: PropTypes.bool.isRequired,
  handleToggle: PropTypes.func.isRequired
}

export default FaqRow
