# 內建題庫 CSV

此資料夾提供 GitHub Pages 版英文單字卡直接載入的內建題庫。

目前內建：

- `114_cmu_english_vocab.csv`：中國醫 114 英文單字庫，381 筆。

部署方式：

- GitHub Pages 讀取根目錄 `index.html`。
- App 題庫資料從 `data/114_cmu_english_vocab.csv` 讀取。
- Apps Script / Google Sheets 只負責同步學習進度與題庫清單，不再承擔題庫內容來源。
- 114 內建題庫的同步 key 沿用舊 Google Sheet 題庫 URL，讓既有雲端進度可以接上。
