# AnesthesiaSheet Support

Public support and privacy pages for AnesthesiaSheet.

- [Support](https://better-day-tech.github.io/anesthesia-sheet-support/support/)
- [Offline Recovery](https://better-day-tech.github.io/anesthesia-sheet-support/recovery/)
- [Privacy Policy](https://better-day-tech.github.io/anesthesia-sheet-support/privacy/)
- [Terms of Use](https://better-day-tech.github.io/anesthesia-sheet-support/terms/)

Bug reports and feature requests are accepted through GitHub Issues. Do not include patient, staff, or facility identifiers, real-case data, or identifiable screenshots in public posts.

Security and privacy issues use GitHub private vulnerability reporting. Before publishing the site, enable that repository setting and verify the private-report link from the Support page.

AnesthesiaSheet is not an official anesthesia record, medical device, diagnostic tool, or medication order system.

The shipping Release is record-only. It does not include dose/rate calculators, pharmacokinetic models, drug-effect predictions, emergency treatment guidance, automated clinical recommendations, alarms, or notifications.

Users may confirm and store facility-specific dilution concentrations for manual transcription into a medication log. The values are not recommendations, remain hidden from the intraoperative screen until confirmed by the user, and are not used to calculate a dose or infusion rate.

The recovery page only distributes the versioned, self-contained offline recovery tool. Decryption is disabled when the tool is served over HTTP(S); users download it and open it locally. The tool has no external dependencies, analytics, or network requests.

## Local verification

Run these checks after changing the recovery tool or site navigation:

```sh
node tests/recovery-smoke.mjs
node tests/site-links-smoke.mjs
(cd downloads && shasum -a 256 -c SHA256SUMS.txt)
```
