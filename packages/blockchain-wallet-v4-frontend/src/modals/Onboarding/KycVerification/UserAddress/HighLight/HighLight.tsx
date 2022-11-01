import React from 'react'

type Props = {
  hightLight: string
  text: string
}

const HighLight = ({ hightLight = '', text = '' }: Props) => {
  if (!hightLight.trim()) {
    return <span>{text}</span>
  }
  const regex = new RegExp(`(${hightLight})`, 'gi')
  const parts = text.split(regex)

  return (
    <span>
      {parts.filter(String).map((part, i) => {
        // eslint-disable-next-line
        return regex.test(part) ? <mark key={i}>{part}</mark> : <span key={i}>{part}</span>
      })}
    </span>
  )
}

export default HighLight
