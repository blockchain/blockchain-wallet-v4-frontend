import React from 'react'

import { RouterLink } from 'components/generic/Link'

const NavItemRouter = (props) => {
  return (
    <li>
      <RouterLink {...props} />
    </li>
  )
}

export default NavItemRouter
