export const getBankLogoImageName = bankName => {
  switch (bankName) {
    case 'Acorns':
      return 'bank-logo-acorns'
    case 'Ally Bank':
    case 'Ally':
      return 'bank-logo-ally'
    case 'Bank Of America':
    case 'Bank of America (Fidelity NetBenefits)':
      return 'bank-logo-bank-of-america'
    case 'BB&T':
      return 'bank-logo-bbt'
    case 'Capital One':
      return 'bank-logo-capital-one'
    case 'Chase':
      return 'bank-logo-chase'
    case 'Citi Bank':
      return 'bank-logo-citi-bank'
    case 'Citizens':
    case 'Citizens Bank of Philadelphia':
    case 'Citizens State Bank (WI)':
    case 'Citizens Tri-County Bank':
      return 'bank-logo-citizens'
    case 'Dag Site':
      return 'bank-logo-dag-site'
    case 'Navy Federal':
    case 'Navy Federal Credit Union':
      return 'bank-logo-navy-federal'
    case 'PNC':
    case 'PNC Bank':
      return 'bank-logo-pnc'
    case 'Regions':
    case 'Regions Bank':
    case 'Regions Bank (Mortgage)':
    case 'Regions Bank - Credit Cards':
    case 'Regions Retirement 24/7':
      return 'bank-logo-regions'
    case 'Robinhood':
      return 'bank-logo-robinhood'
    case 'SunTrust':
    case 'Suntrust Bank':
      return 'bank-logo-suntrust'
    case 'TD Ameritrade Inc.':
    case 'TD Canada Trust':
    case 'TD':
      return 'bank-logo-td'
    case 'U.S. Bank':
      return 'bank-logo-us-bank'
    case 'USAA':
      return 'bank-logo-usaa'
    case 'Venmo':
      return 'bank-logo-venmo'
    case 'Wells Fargo':
    case 'Wells Fargo Asset Management':
    case 'Wells Fargo Retirement Services':
      return 'bank-logo-wells-fargo'
    default:
      return 'bank'
  }
}
