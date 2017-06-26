import React from 'react'
import CSSModules from 'react-css-modules'

import style from './style.scss'

const FilterStatus = (props) => {
  return (
    <div styleName='filter-status'>
      { props.items.map(function (item, index) {
        return <span key={index} styleName={`${item.value === props.selected ? 'selected' : 'default'}`} onClick={() => props.click(item.value)}>{item.text}</span>
      })}
    </div>
  )
}

export default CSSModules(FilterStatus, style)
