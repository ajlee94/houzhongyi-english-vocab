# 後中醫英文

整理後中醫英文備考資料、單字卡、文法/閱讀資源、題庫與輸出成果的專案。

## 搬移後目前狀態

- 目前資料夾：`D:\codex\英文單字APP`。
- 此資料夾是從舊專案搬移出的工作副本；目前已初始化為 Git 倉庫，初始分支為 `master`。
- 現在的可用 App 入口是根目錄 `index.html`，同步發布備份在 `output/github-pages/index.html`。
- 現在不再內建 GitHub CSV 單字檔；新增題庫改走 App 內「題庫管理」貼 Google Sheets 或 CSV 網址。
- `source/歷屆試題/` 保留歷屆試題來源資料，不要為了 App 發布整包納入公開 repo。
- `output/ui-validation-20260509/` 是前次 UI 驗證輸出；其中 PNG 與 JSON 報告可留存，瀏覽器 profile/cache 只是測試暫存。
- 詳細搬移盤點見 `references/搬移後資料夾盤點_20260520.md`。

## 資料夾

- `source/`：原始教材、PDF、音檔、匯出資料與未整理來源。
- `notes/`：整理後筆記，優先使用 Markdown。
- `references/`：考情、來源清單、參考連結與資料追蹤。
- `questions/`：題庫、答案、解析與題目圖片。
- `output/`：可交付成果，例如 App、HTML、匯出表格、報告。
- `scripts/`：可重複執行的整理、轉檔或建置工具。
- `英文0/`：舊專案中的既有英文資料與單字卡 App；目前搬移後的 `D:\codex\英文單字APP` 未包含此資料夾。

注意：目前搬移後的資料夾未包含舊專案的 `英文0/`；若日後需要原始 App 版本或大型教材，需回舊專案或備份來源查找。

## 舊專案既有資料

- 舊專案曾有 `英文0/APP/`：既有多裝置同步單字卡 HTML、Apps Script 與 Google Sheet 捷徑。
- 舊專案曾有 `英文0/APP/單字庫/`：既有單字庫 Google Sheet 捷徑。
- 舊專案曾有 `英文0/英文資源/`：旋元佑文法、文法解題、字彙、閱讀與音頻等大型資源。
- 目前搬移後資料夾主要保留 GitHub Pages App、`apps-script/` 後端備份與 `source/歷屆試題/` 來源資料。

## 建議流程

1. 原始來源先放 `source/` 或保留在 `英文0/英文資源/`，不要直接覆蓋。
2. 單字、文法、閱讀筆記整理到 `notes/`。
3. 題庫資料先定義欄位，再放入 `questions/`。
4. 可使用的 App 或網頁成果集中放 `output/`。
5. 可重跑的轉換流程寫入 `scripts/`。

## GitHub Pages App

- `index.html`：英文單字卡 GitHub Pages 入口，以 `英文0/APP/英文單字卡_多裝置同步版_v17.html` 為功能基準，已加入深色介面、Google Sheets / CSV 題庫網址新增與 Apps Script 進度同步。
- `output/github-pages/`：發布備份與說明。
- `data/`：舊版 GitHub CSV 題庫資料夾；目前 App 不再依賴內建單字 CSV。
- `apps-script/Code.gs`：多裝置進度同步後端備份。

GitHub Pages 設定建議使用 repository root，讓 Pages 直接讀取根目錄 `index.html`。

目前部署架構為：GitHub Pages 放 App；題庫由使用者在 App 內貼 Google Sheets 或 CSV 網址新增。Apps Script / Google Sheets 負責學習進度與題庫清單設定同步。
