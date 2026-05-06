# 後中醫英文

整理後中醫英文備考資料、單字卡、文法/閱讀資源、題庫與輸出成果的專案。

## 資料夾

- `source/`：原始教材、PDF、音檔、匯出資料與未整理來源。
- `notes/`：整理後筆記，優先使用 Markdown。
- `references/`：考情、來源清單、參考連結與資料追蹤。
- `questions/`：題庫、答案、解析與題目圖片。
- `output/`：可交付成果，例如 App、HTML、匯出表格、報告。
- `scripts/`：可重複執行的整理、轉檔或建置工具。
- `英文0/`：既有英文資料與單字卡 App，暫時保留原位置。

## 目前既有資料

- `英文0/APP/`：既有多裝置同步單字卡 HTML、Apps Script 與 Google Sheet 捷徑。
- `英文0/APP/單字庫/`：既有單字庫 Google Sheet 捷徑。
- `英文0/英文資源/`：旋元佑文法、文法解題、字彙、閱讀與音頻等大型資源。

## 建議流程

1. 原始來源先放 `source/` 或保留在 `英文0/英文資源/`，不要直接覆蓋。
2. 單字、文法、閱讀筆記整理到 `notes/`。
3. 題庫資料先定義欄位，再放入 `questions/`。
4. 可使用的 App 或網頁成果集中放 `output/`。
5. 可重跑的轉換流程寫入 `scripts/`。

## GitHub Pages App

- `index.html`：英文單字卡 GitHub Pages 入口，以 `英文0/APP/英文單字卡_多裝置同步版_v17.html` 為功能基準，已加入深色介面、內建 CSV 題庫與 Apps Script 進度同步。
- `output/github-pages/`：發布備份與說明。
- `data/`：GitHub Pages 版內建 CSV 題庫，目前只保留中國醫 114 自建英文單字庫。
- `apps-script/Code.gs`：多裝置進度同步後端備份。

GitHub Pages 設定建議使用 repository root，讓 Pages 直接讀取根目錄 `index.html`。

目前部署架構為：GitHub Pages 放 App 與題庫 CSV；Apps Script / Google Sheets 負責進度同步。題庫更新直接修改 `data/114_cmu_english_vocab.csv` 後推送到 GitHub。
