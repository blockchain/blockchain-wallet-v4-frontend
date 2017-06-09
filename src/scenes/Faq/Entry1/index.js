import React from 'react'
import { NavLink } from 'react-router-dom'

const title = 'How do you buy bitcoin?'

const content = (
  <span>
    It’s simple, secure and seamless.
    <NavLink to='/buy-sell'>Click here to get started.</NavLink>
  </span>
)

export default {
  title, content
}
