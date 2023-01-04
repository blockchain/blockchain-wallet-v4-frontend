import { useIntl } from 'react-intl'
import { add, format } from 'date-fns'

import { DepositTerms, DisplayMode } from 'data/types'

const useValue = (type: 'Trade' | 'Withdraw', depositTerms?: DepositTerms) => {
  const { formatMessage } = useIntl()

  if (!depositTerms) {
    return undefined
  }

  const minutesMax = depositTerms[`availableTo${type}MinutesMax`]
  const minutesMin = depositTerms[`availableTo${type}MinutesMin`]
  const displayMode = depositTerms[`availableTo${type}DisplayMode`]

  switch (displayMode) {
    case DisplayMode.IMMEDIATELY:
      return formatMessage({ defaultMessage: 'Immediately', id: 'copy.immediately' })
    case DisplayMode.MAX_DAY: // 18th of October
      return format(add(new Date(), { minutes: minutesMax }), "do 'of' MMMM")
    case DisplayMode.MAX_MINUTE: // in 2 minutes
      return formatMessage(
        { defaultMessage: 'in {minutesMax} minute(s)', id: 'copy.in_minutes' },
        { minutesMax }
      )
    case DisplayMode.MINUTE_RANGE: // between 1 and 2 minutes || in 1 minute(s)
      return minutesMin === minutesMax
        ? formatMessage(
            { defaultMessage: 'in {minutesMax} minute(s)', id: 'copy.in_minutes' },
            { minutesMax }
          )
        : formatMessage(
            {
              defaultMessage: 'between {minutesMin} and {minutesMax} minutes',
              id: 'copy.between_minutes'
            },
            { minutesMax, minutesMin }
          )
    case DisplayMode.DAY_RANGE: // Between 16th and the 18th || on the 18th
      const dayMin = format(add(new Date(), { minutes: minutesMin }), 'do')
      const dayMax = format(add(new Date(), { minutes: minutesMax }), 'do')
      return dayMin === dayMax
        ? formatMessage(
            {
              defaultMessage: 'on the {dayMax}',
              id: 'copy.on_the_day'
            },
            { dayMax }
          )
        : formatMessage(
            {
              defaultMessage: 'between {dayMin} and the {dayMax}',
              id: 'copy.between_and_the'
            },
            { dayMax, dayMin }
          )
    case DisplayMode.NONE:
    default:
      return undefined
  }
}

export default useValue
