1) clean up selectors in index.tsx
   - single formValues import
   - move everything to selectors.ts
   - consider writing selectors to grab batches of "auth data" from redux instead of just single values
2) handleBackArrowClick is repeatedly many times, write once and share adding logic to do specific things at times
3) cleanup continueLoginProcess function