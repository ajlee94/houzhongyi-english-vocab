const PROGRESS_SHEET_NAME = 'progress';
const PROGRESS_HEADERS = [
  'userKey',
  'deckKey',
  'deckName',
  'updatedAt',
  'progressJson',
  'progressUpdatedAt',
  'signatureJson',
  'version'
];

const DECK_INDEX_SHEET_NAME = 'deck_index';
const DECK_INDEX_HEADERS = [
  'userKey',
  'updatedAt',
  'decksJson',
  'version'
];

function doGet(e) {
  const action = String((e && e.parameter && e.parameter.action) || '').trim();
  const callback = String((e && e.parameter && e.parameter.callback) || '').trim();
  let result;
  try {
    if (action === 'load') {
      const userKey = String(e.parameter.userKey || '').trim();
      const deckKey = String(e.parameter.deckKey || '').trim();
      result = loadProgress_(userKey, deckKey);
    } else if (action === 'loadDeckIndex') {
      const userKey = String(e.parameter.userKey || '').trim();
      result = loadDeckIndex_(userKey);
    } else {
      result = { ok: false, message: 'Unsupported action' };
    }
  } catch (err) {
    result = { ok: false, message: err.message || String(err) };
  }
  return buildJsonResponse_(result, callback);
}

function doPost(e) {
  const requestId = String((e && e.parameter && e.parameter.requestId) || '').trim();
  let result;
  try {
    const action = String((e && e.parameter && e.parameter.action) || '').trim();
    const payloadRaw = String((e && e.parameter && e.parameter.payload) || '').trim();
    const payload = payloadRaw ? JSON.parse(payloadRaw) : {};
    if (action === 'save') {
      result = saveProgress_(payload);
    } else if (action === 'saveDeckIndex') {
      result = saveDeckIndex_(payload);
    } else {
      result = { ok: false, message: 'Unsupported action' };
    }
  } catch (err) {
    result = { ok: false, message: err.message || String(err) };
  }
  result.requestId = requestId;
  return HtmlService.createHtmlOutput(buildPostMessageHtml_(result));
}

function buildPostMessageHtml_(result) {
  const json = JSON.stringify(result)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026');
  return `<!doctype html><html><body><script>
    (function(){
      var data = ${json};
      data.source = 'flashcard-cloud-sync';
      if (window.parent && window.parent !== window) {
        window.parent.postMessage(data, '*');
      }
      document.body.textContent = data.ok ? 'saved' : (data.message || 'error');
    })();
  <\/script></body></html>`;
}

function buildJsonResponse_(obj, callback) {
  const text = callback
    ? `${callback}(${JSON.stringify(obj)})`
    : JSON.stringify(obj);
  return ContentService
    .createTextOutput(text)
    .setMimeType(callback ? ContentService.MimeType.JAVASCRIPT : ContentService.MimeType.JSON);
}

function getSheet_(sheetName, headers) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
  }
  ensureHeaderRow_(sheet, headers);
  return sheet;
}

function getProgressSheet_() {
  return getSheet_(PROGRESS_SHEET_NAME, PROGRESS_HEADERS);
}

function getDeckIndexSheet_() {
  return getSheet_(DECK_INDEX_SHEET_NAME, DECK_INDEX_HEADERS);
}

function ensureHeaderRow_(sheet, headers) {
  const lastRow = sheet.getLastRow();
  const requiredCols = headers.length;
  if (sheet.getMaxColumns() < requiredCols) {
    sheet.insertColumnsAfter(sheet.getMaxColumns(), requiredCols - sheet.getMaxColumns());
  }
  if (lastRow === 0) {
    sheet.getRange(1, 1, 1, requiredCols).setValues([headers]);
    return;
  }

  const firstRow = sheet.getRange(1, 1, 1, requiredCols).getValues()[0];
  if (isHeaderRow_(firstRow, headers)) {
    sheet.getRange(1, 1, 1, requiredCols).setValues([headers]);
    return;
  }

  const hasAnyValue = firstRow.some(v => String(v || '').trim() !== '');
  if (hasAnyValue) {
    sheet.insertRowBefore(1);
  }
  sheet.getRange(1, 1, 1, requiredCols).setValues([headers]);
}

function isHeaderRow_(rowValues, headers) {
  for (var i = 0; i < headers.length; i += 1) {
    if (String(rowValues[i] || '').trim() !== headers[i]) return false;
  }
  return true;
}

function saveProgress_(payload) {
  const userKey = String(payload.userKey || '').trim();
  const deckKey = String(payload.deckKey || '').trim();
  const deckName = String(payload.deckName || '').trim();
  const progress = payload.progress || null;

  if (!userKey) throw new Error('Missing userKey');
  if (!deckKey) throw new Error('Missing deckKey');
  if (!progress) throw new Error('Missing progress');

  const lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    const sheet = getProgressSheet_();
    const now = new Date();
    const progressJson = JSON.stringify(progress);
    const progressUpdatedAt = getProgressUpdatedAt_(progress);
    const signatureJson = JSON.stringify(progress.signature || {});
    const version = Number(progress.version || 0) || '';
    const rowNumber = findProgressRow_(sheet, userKey, deckKey);
    const targetRow = rowNumber || (sheet.getLastRow() + 1);
    const existingDeckName = rowNumber ? String(sheet.getRange(rowNumber, 3).getValue() || '').trim() : '';

    sheet.getRange(targetRow, 1, 1, PROGRESS_HEADERS.length).setValues([[
      userKey,
      deckKey,
      deckName || existingDeckName,
      now,
      progressJson,
      progressUpdatedAt || '',
      signatureJson,
      version
    ]]);
    SpreadsheetApp.flush();

    return {
      ok: true,
      message: 'saved',
      updatedAt: now.toISOString(),
      row: targetRow
    };
  } finally {
    lock.releaseLock();
  }
}

function loadProgress_(userKey, deckKey) {
  userKey = String(userKey || '').trim();
  deckKey = String(deckKey || '').trim();

  if (!userKey) throw new Error('Missing userKey');
  if (!deckKey) throw new Error('Missing deckKey');

  const sheet = getProgressSheet_();
  const rowNumber = findProgressRow_(sheet, userKey, deckKey);
  if (!rowNumber) {
    return { ok: false, message: '找不到這份題庫的雲端進度' };
  }

  const values = sheet.getRange(rowNumber, 1, 1, PROGRESS_HEADERS.length).getValues()[0];
  const progress = safeParseJson_(values[4], {});

  return {
    ok: true,
    payload: {
      userKey: String(values[0] || '').trim(),
      deckKey: String(values[1] || '').trim(),
      deckName: String(values[2] || '').trim(),
      updatedAt: toIsoString_(values[3]),
      progress: progress,
      progressUpdatedAt: String(values[5] || '').trim(),
      row: rowNumber
    }
  };
}

function saveDeckIndex_(payload) {
  const userKey = String(payload.userKey || '').trim();
  const index = payload.index || null;
  if (!userKey) throw new Error('Missing userKey');
  if (!index || typeof index !== 'object') throw new Error('Missing index');

  const decks = Array.isArray(index.decks) ? index.decks : [];
  const updatedAt = String(index.updatedAt || '').trim() || new Date().toISOString();
  const version = Number(index.version || 0) || '';

  const lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    const sheet = getDeckIndexSheet_();
    const rowNumber = findDeckIndexRow_(sheet, userKey);
    const targetRow = rowNumber || (sheet.getLastRow() + 1);
    sheet.getRange(targetRow, 1, 1, DECK_INDEX_HEADERS.length).setValues([[
      userKey,
      updatedAt,
      JSON.stringify(decks),
      version
    ]]);
    SpreadsheetApp.flush();
    return {
      ok: true,
      message: 'saved',
      updatedAt: updatedAt,
      row: targetRow
    };
  } finally {
    lock.releaseLock();
  }
}

function loadDeckIndex_(userKey) {
  userKey = String(userKey || '').trim();
  if (!userKey) throw new Error('Missing userKey');

  const sheet = getDeckIndexSheet_();
  const rowNumber = findDeckIndexRow_(sheet, userKey);
  if (!rowNumber) {
    return { ok: false, message: '找不到雲端題庫清單' };
  }

  const values = sheet.getRange(rowNumber, 1, 1, DECK_INDEX_HEADERS.length).getValues()[0];
  return {
    ok: true,
    payload: {
      userKey: String(values[0] || '').trim(),
      updatedAt: toIsoString_(values[1]),
      decks: safeParseJson_(values[2], []),
      version: Number(values[3] || 0) || 0,
      row: rowNumber
    }
  };
}

function findProgressRow_(sheet, userKey, deckKey) {
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return 0;

  const values = sheet.getRange(2, 1, lastRow - 1, 2).getValues();
  for (var i = 0; i < values.length; i += 1) {
    const rowUserKey = String(values[i][0] || '').trim();
    const rowDeckKey = String(values[i][1] || '').trim();
    if (rowUserKey === userKey && rowDeckKey === deckKey) {
      return i + 2;
    }
  }
  return 0;
}

function findDeckIndexRow_(sheet, userKey) {
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return 0;

  const values = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
  for (var i = 0; i < values.length; i += 1) {
    const rowUserKey = String(values[i][0] || '').trim();
    if (rowUserKey === userKey) {
      return i + 2;
    }
  }
  return 0;
}

function getProgressUpdatedAt_(progress) {
  if (!progress || typeof progress !== 'object') return '';
  const candidates = [
    progress.updatedAt,
    progress.exportedAt,
    progress.state && progress.state.updatedAt
  ];
  for (var i = 0; i < candidates.length; i += 1) {
    const value = String(candidates[i] || '').trim();
    if (value) return value;
  }
  return '';
}

function safeParseJson_(text, fallback) {
  try {
    return text ? JSON.parse(text) : fallback;
  } catch (err) {
    return fallback;
  }
}

function toIsoString_(value) {
  if (!value) return '';
  if (Object.prototype.toString.call(value) === '[object Date]' && !isNaN(value.getTime())) {
    return value.toISOString();
  }
  const parsed = new Date(value);
  return isNaN(parsed.getTime()) ? String(value) : parsed.toISOString();
}
