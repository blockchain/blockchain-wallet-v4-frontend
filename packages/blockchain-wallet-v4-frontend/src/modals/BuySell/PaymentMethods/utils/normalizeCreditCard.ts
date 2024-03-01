import { getCardTypeByValueOrDefault } from '../model'

export const normalizeCreditCard = (
  value: string,
  previousValue: string | undefined = undefined
): string | undefined => {
  if (!value) return value

  const { format, maxCardNumberLength } = getCardTypeByValueOrDefault(value)

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
