import { DEFAULT_CARD_FORMAT, getCardTypeByValue } from '../../model'

export const normalizeCreditCard = (
  value: string,
  previousValue: string | undefined = undefined
): string | undefined => {
  if (!value) return value

  const { format, maxCardNumberLength } = getCardTypeByValue(value) || {
    format: DEFAULT_CARD_FORMAT,
    maxCardNumberLength: 16
  }

  if (value.replace(/[^\d]/g, '').length > maxCardNumberLength) {
    return previousValue
  }

  if (format.global) {
    const match = value.match(format)
    return match ? match.join(' ') : ''
  }

  const execResult = format.exec(value.split(' ').join(''))
  if (execResult) {
    return execResult
      .splice(1, 3)
      .filter((x) => x)
      .join(' ')
  }

  return value
}
