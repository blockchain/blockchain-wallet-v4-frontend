// Cowboys Promo Events
export enum Events {
  BLOCKCHAIN_COM_LOG_IN_CLICKED = 'Blockchain Com Log In Clicked',
  BLOCKCHAIN_COM_LOG_IN_VIEWED = 'Blockchain Com Log In Viewed',
  BLOCKCHAIN_COM_SIGN_UP_CLICKED = 'Blockchain Com Sign Up Clicked',
  BLOCKCHAIN_COM_SIGN_UP_SUBMITTED = 'Blockchain Com Sign Up Submitted',
  BLOCKCHAIN_COM_SIGN_UP_VIEWED = 'Blockchain Com Sign Up Viewed',
  COWBOYS_ADDRESS_CONFIRMED = 'Cowboys Address Confirmed',
  COWBOYS_ADDRESS_VIEWED = 'Cowboys Address Viewed',
  COWBOYS_BUY_CRYPTO_CLICKED = 'Cowboys Buy Crypto Clicked',
  COWBOYS_COMPLETE_SIGN_UP_ANNOUCEMENT_CLICKED = 'Cowboys Complete Sign-Up Annoucement Clicked',
  COWBOYS_EMAIL_COMPLETE = 'Cowboys Email Complete',
  COWBOYS_EMAIL_ENTERED = 'Cowboys Email Entered',
  COWBOYS_EMAIL_FAILED = 'Cowboys Email Failed',
  COWBOYS_LANDING_VIEWED = 'Cowboys Landing Viewed',
  COWBOYS_LEARN_MORE_CLICKED = 'Cowboys Learn More Clicked',
  COWBOYS_PERSONAL_INFO_CONFIRMED = 'Cowboys Personal Info Confirmed',
  COWBOYS_PERSONAL_INFO_VIEWED = 'Cowboys Personal Info Viewed',
  COWBOYS_RAFFLE_INTERSTITIAL_BUY_CRYPTO_CLICKED = 'Cowboys Raffle Interstitial Buy Crypto Clicked',
  COWBOYS_RAFFLE_INTERSTITIAL_CLOSED = 'Cowboys Raffle Interstitial Closed',
  COWBOYS_RAFFLE_INTERSTITIAL_VIEWED = 'Cowboys Raffle Interstitial Viewed',
  COWBOYS_REFER_FRIENDS_ANNOUNCEMENT_CLICKED = 'Cowboys Refer Friends Announcement Clicked',
  COWBOYS_VERIFY_EMAIL_ANNOUNCEMENT_CLICKED = 'Cowboys Verify Email Announcement Clicked',
  COWBOYS_VERIFY_IDENTITY_ANNOUNCEMENT_CLICKED = 'Cowboys Verify Identity Announcement Clicked',
  COWBOYS_VERIFY_IDENTITY_INTERSTITIAL_CLOSED = 'Cowboys Verify Identity Interstitial Closed',
  COWBOYS_VERIFY_IDENTITY_INTERSTITIAL_VERIFY_ID_CLICKED = 'Cowboys Verify Identity Interstitial Verify ID Clicked',
  COWBOYS_VERIFY_IDENTITY_INTERSTITIAL_VIEWED = 'Cowboys Verify Identity Interstitial Viewed',
  COWBOYS_WELCOME_INTERSTITIAL_CLOSED = 'Cowboys Welcome Interstitial Closed',
  COWBOYS_WELCOME_INTERSTITIAL_CONTINUE_CLICKED = 'Cowboys Welcome Interstitial Continue Clicked',
  COWBOYS_WELCOME_INTERSTITIAL_VIEWED = 'Cowboys Welcome Interstitial Viewed'
}

type AnnouncementType = 'get_tickets' | 'signed_up'

type CowboysActions = {
  key:
    | Events.BLOCKCHAIN_COM_LOG_IN_CLICKED
    | Events.BLOCKCHAIN_COM_LOG_IN_VIEWED
    | Events.BLOCKCHAIN_COM_SIGN_UP_CLICKED
    | Events.BLOCKCHAIN_COM_SIGN_UP_SUBMITTED
    | Events.BLOCKCHAIN_COM_SIGN_UP_VIEWED
    | Events.COWBOYS_ADDRESS_CONFIRMED
    | Events.COWBOYS_ADDRESS_VIEWED
    | Events.COWBOYS_BUY_CRYPTO_CLICKED
    | Events.COWBOYS_EMAIL_COMPLETE
    | Events.COWBOYS_EMAIL_ENTERED
    | Events.COWBOYS_EMAIL_FAILED
    | Events.COWBOYS_LEARN_MORE_CLICKED
    | Events.COWBOYS_PERSONAL_INFO_CONFIRMED
    | Events.COWBOYS_PERSONAL_INFO_VIEWED
    | Events.COWBOYS_RAFFLE_INTERSTITIAL_BUY_CRYPTO_CLICKED
    | Events.COWBOYS_RAFFLE_INTERSTITIAL_CLOSED
    | Events.COWBOYS_RAFFLE_INTERSTITIAL_VIEWED
    | Events.COWBOYS_REFER_FRIENDS_ANNOUNCEMENT_CLICKED
    | Events.COWBOYS_VERIFY_EMAIL_ANNOUNCEMENT_CLICKED
    | Events.COWBOYS_VERIFY_IDENTITY_ANNOUNCEMENT_CLICKED
    | Events.COWBOYS_VERIFY_IDENTITY_INTERSTITIAL_CLOSED
    | Events.COWBOYS_VERIFY_IDENTITY_INTERSTITIAL_VERIFY_ID_CLICKED
    | Events.COWBOYS_VERIFY_IDENTITY_INTERSTITIAL_VIEWED
    | Events.COWBOYS_WELCOME_INTERSTITIAL_CLOSED
    | Events.COWBOYS_WELCOME_INTERSTITIAL_CONTINUE_CLICKED
    | Events.COWBOYS_WELCOME_INTERSTITIAL_VIEWED
  properties: {}
}

type CowboysCompleteSignUpAnnouncementClicked = {
  key: Events.COWBOYS_COMPLETE_SIGN_UP_ANNOUCEMENT_CLICKED
  properties: {
    type: AnnouncementType
  }
}
type CowboysLandingViewed = {
  key: Events.COWBOYS_LANDING_VIEWED
  properties: {
    origin: string
    utm_medium: string
    utm_source: string
    utm_term: string
  }
}

// track event actions to be used inside codebase when we do trigger event
export type TrackEventAction =
  | CowboysActions
  | CowboysCompleteSignUpAnnouncementClicked
  | CowboysLandingViewed
