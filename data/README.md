# 內建題庫 CSV

此資料夾提供 GitHub Pages 版英文單字卡直接載入的內建題庫。

目前內建：

- `114_cmu_english_vocab.csv`：中國醫 114 英文單字庫，381 筆。
- `decks.json`：GitHub 題庫清單。App 的「未入庫題庫」會讀取此檔，顯示已上傳但尚未加入目前題庫清單的 CSV。

部署方式：

- GitHub Pages 讀取根目錄 `index.html`。
- App 題庫資料從 `data/114_cmu_english_vocab.csv` 讀取。
- 新增題庫時，將 CSV 放入 `data/`，並在 `data/decks.json` 新增一筆題庫資料。
- 題庫更新直接修改此 CSV 後推送到 GitHub。
- 學習進度透過 Apps Script / Google Sheets 同步；本機瀏覽器仍會保留 localStorage 快取。
