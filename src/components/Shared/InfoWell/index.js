import React from 'react'

import style from './style.scss'

const InfoWell = ({ children }) => (
  <div className={style.infoWell}>
    {children}
  </div>
)

export default InfoWell
