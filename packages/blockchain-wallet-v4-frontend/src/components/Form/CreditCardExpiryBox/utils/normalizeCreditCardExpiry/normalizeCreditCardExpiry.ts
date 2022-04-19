export const normalizeCreditCardExpiry = (
  value: string,
  previousValue: string | undefined = undefined
): string | undefined => {
  if (!value) return value
  if (value.length > 5) return previousValue

  const onlyNumsOrSlash = value.replace(/[^\d/]/g, '').replace(/\/{1,}/, '/')
  const prevOnlyNumsOrSlash = previousValue || ''

  if (!prevOnlyNumsOrSlash && onlyNumsOrSlash === '/') return ''

  if (prevOnlyNumsOrSlash.length === 1 && onlyNumsOrSlash[onlyNumsOrSlash.length - 1] === '/') {
    return `0${prevOnlyNumsOrSlash}/`
  }

  if (onlyNumsOrSlash.length < prevOnlyNumsOrSlash.length) {
    return onlyNumsOrSlash
  }
  if (onlyNumsOrSlash.length === 2) {
    return `${onlyNumsOrSlash}/`
  }
  if (onlyNumsOrSlash.length === 4 && !onlyNumsOrSlash.includes('/')) {
    const num = onlyNumsOrSlash
    return `${num.substring(0, 2)}/${num.substring(2, 4)}`
  }
  return onlyNumsOrSlash
}
