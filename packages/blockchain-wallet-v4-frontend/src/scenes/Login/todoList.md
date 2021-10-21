1) clean up selectors in index.tsx
   - single formValues import
   - move everything to selectors.ts
2) handleBackArrowClick is repeatedly many times, write once and share adding logic to do specific things at times
3) cleanup continueLoginProcess function
4) Login/AccountUnification/UpgradeSuccess probably only needs one template