import React from 'react'
import CSSModules from 'react-css-modules'

import style from './style.scss'

const Search = (props) => {
  return (
    <div styleName='search'>
      <input type='text' styleName='search' value={props.search} onChange={props.change} />
      <i className='icon-search' styleName='icon' />
    </div>
  )
}

export default CSSModules(Search, style)
