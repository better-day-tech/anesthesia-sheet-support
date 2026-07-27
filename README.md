# AnesthesiaSheet Support

[日本語](#日本語) | [English](#english)

## 日本語

AnesthesiaSheetの公開サポート、プライバシー、利用条件、オフライン復元ページです。

- [サポート](https://better-day-tech.github.io/anesthesia-sheet-support/support/)
- [オフライン復元](https://better-day-tech.github.io/anesthesia-sheet-support/recovery/)
- [プライバシーポリシー](https://better-day-tech.github.io/anesthesia-sheet-support/privacy/)
- [利用条件](https://better-day-tech.github.io/anesthesia-sheet-support/terms/)
- [English pages](https://better-day-tech.github.io/anesthesia-sheet-support/en/)

不具合報告と機能要望はGitHub Issuesで受け付けています。患者、職員、施設を識別できる情報、実症例データ、識別可能なスクリーンショットを公開投稿に含めないでください。セキュリティまたはプライバシー上の問題は、GitHubの非公開脆弱性報告を使用してください。

AnesthesiaSheetは公式麻酔記録、医療機器、診断ツール、投薬指示システムではありません。Release版は記録専用であり、用量・投与速度計算、薬物動態モデル、薬効予測、緊急治療ガイダンス、自動的な臨床推奨、アラーム、通知を提供しません。

施設別の希釈濃度は、利用者が確認して手入力記録へ転記するための任意設定です。アプリの推奨値ではなく、利用者が確認するまで術中画面に表示されず、用量や投与速度の計算には使われません。

この公開リポジトリには、静的な公開文書、Issueフォーム、画像、検証用テスト、バージョン付きオフライン復元ツールだけを含めます。アプリ本体のソース、署名資料、秘密鍵、実データ、復旧キーは含めません。復元ツールの暗号方式と復元コードは相互運用性と検証可能性のため公開していますが、鍵や利用者データは含みません。

## English

This repository contains the public support, privacy, terms, and offline recovery pages for AnesthesiaSheet.

These English pages correspond to the app's selectable Japanese and English interfaces.

- [Support](https://better-day-tech.github.io/anesthesia-sheet-support/en/support/)
- [Offline Recovery](https://better-day-tech.github.io/anesthesia-sheet-support/en/recovery/)
- [Privacy Policy](https://better-day-tech.github.io/anesthesia-sheet-support/en/privacy/)
- [Terms of Use](https://better-day-tech.github.io/anesthesia-sheet-support/en/terms/)
- [Japanese pages](https://better-day-tech.github.io/anesthesia-sheet-support/)

Bug reports and feature requests are accepted through GitHub Issues. Do not include patient, staff, or facility identifiers, real-case data, or identifiable screenshots in public posts. Use GitHub private vulnerability reporting for security or privacy issues.

AnesthesiaSheet is not an official anesthesia record, medical device, diagnostic tool, or medication order system. The shipping Release is record-only. It does not include dose or rate calculators, pharmacokinetic models, drug-effect predictions, emergency treatment guidance, automated clinical recommendations, alarms, or notifications.

Facility-specific dilution concentrations are optional user-confirmed settings for manual transcription into a medication log. They are not app recommendations, remain hidden from the intraoperative screen until confirmed by the user, and are not used to calculate a dose or infusion rate.

This public repository is limited to static public documents, Issue forms, images, verification tests, and the versioned offline recovery tool. It does not include application source code, signing material, private keys, real data, or recovery keys. The recovery tool publishes the cryptographic format and recovery code for interoperability and review; it contains no key or user data.

## Local verification

Run these checks after changing the recovery tool or site navigation:

```sh
node tests/recovery-smoke.mjs
node tests/site-links-smoke.mjs
node tests/public-surface-audit.mjs
(cd downloads && shasum -a 256 -c SHA256SUMS.txt)
```
