# 內建題庫 CSV

此資料夾提供 GitHub Pages 版英文單字卡直接載入的內建題庫。

目前內建：

- `114_cmu_english_vocab.csv`：中國醫 114 英文單字庫，381 筆。

部署方式：

- GitHub Pages 讀取根目錄 `index.html`。
- App 題庫資料從 `data/114_cmu_english_vocab.csv` 讀取。
- 題庫更新直接修改此 CSV 後推送到 GitHub。
- 學習進度透過 Apps Script / Google Sheets 同步；本機瀏覽器仍會保留 localStorage 快取。
