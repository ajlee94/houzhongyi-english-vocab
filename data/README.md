# 題庫資料夾

此資料夾是舊版 GitHub Pages 內建題庫資料夾。

目前狀態：

- App 不再內建 GitHub CSV 單字檔。
- 舊版 `decks.json` 題庫清單已移除；目前 App 不再讀取此檔。

部署方式：

- GitHub Pages 讀取根目錄 `index.html`。
- 新增題庫時，建議在 App 的「題庫管理」貼上 Google Sheets 網址，再按「新增題庫」與「載入題庫」。
- 學習進度透過 Apps Script / Google Sheets 同步；本機瀏覽器仍會保留 localStorage 快取。
