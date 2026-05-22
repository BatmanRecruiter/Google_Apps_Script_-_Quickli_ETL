function onOpen() {
  createCustomMenu_(); // Run when sheet opens
}

function createCustomMenu_() {
  const ui = SpreadsheetApp.getUi(); // Create the UI object one time

  // --- Existing Quickli <> Batcave Menu ---
  ui.createMenu('Quickli <> Batcave')
    .addItem('LIR', 'reorderAndCleanSheet_LIR')
    .addItem('URL', 'reorderAndCleanSheet_URL')
    .addToUi();

  // --- New Dedupe Menu ---
  ui.createMenu('Dedupe')
    .addItem('Dedupe W', 'sortAndDedupeColumnW')
    .addToUi();
}

// ========== LIR Search Reorder ==========
function reorderAndCleanSheet_LIR() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getActiveSheet();
  const originalName = sheet.getName();
  const data = sheet.getDataRange().getValues();
  if (data.length < 2) {
    SpreadsheetApp.getUi().alert('No data to process.');
    return;
  }
  const headers = data[0];
  const headerMap = {};
  headers.forEach((header, idx) => {
    headerMap[String(header).trim().toLowerCase()] = idx;
  });

  const newLayout = [
    null, null, null, null,
    "public_url",
    "Full Name",
    "emails",
    null, null, null,
    "phones",
    "job_1_job_company_name",
    "job_1_job_title",
    "job_1_years_in_job",
    "job_1_job_end_date",
    "job_2_job_company_name",
    "job_2_job_title",
    "location",
    "edu_1_edu_school_name",
    "edu_1_edu_degree_name",
    "edu_1_edu_field_of_study",
    "edu_1_edu_end_year",
    "member_id"
  ];

  const outHeaders = newLayout.map(h => h === null ? "" : h);
  const outData = [outHeaders];

  for (let r = 1; r < data.length; r++) {
    const row = data[r];
    const outRow = [];
    for (let c = 0; c < newLayout.length; c++) {
      const col = newLayout[c];
      if (col === null) {
        outRow.push("");
      } else if (col === "Full Name") {
        const fnIdx = headerMap["first_name"] ?? -1;
        const lnIdx = headerMap["last_name"] ?? -1;
        const fn = fnIdx >= 0 ? row[fnIdx] : "";
        const ln = lnIdx >= 0 ? row[lnIdx] : "";
        outRow.push((fn + " " + ln).trim());
      } else if (col === "phones") {
        const idx = headerMap["phones"];
        if (idx !== undefined) {
          let val = row[idx];
          if (typeof val === "string") {
            val = val.replace(/[\[\]\(\)\-']/g, "");
          }
          outRow.push(val);
        } else {
          outRow.push("");
        }
      } else if (col === "emails") {
        const idx = headerMap["emails"];
        if (idx !== undefined) {
          let val = row[idx];
          if (typeof val === "string") {
            val = val.replace(/[\[\]']/g, "");
          }
          outRow.push(val);
        } else {
          outRow.push("");
        }
      } else if (col === "location") {
        const idx = headerMap["location"];
        outRow.push(idx !== undefined ? row[idx] : "");
      } else if (col === "edu_1_edu_end_year") {
        const idx = headerMap["edu_1_edu_end_year"];
        if (idx !== undefined) {
          const val = row[idx];
          const match = String(val).match(/\b(\d{4})\b/);
          outRow.push(match ? match[1] : "");
        } else {
          outRow.push("");
        }
      } else if (col === "job_1_job_end_date") {
        const idx = headerMap["job_1_job_end_date"];
        outRow.push(idx !== undefined ? row[idx] : "");
      } else {
        const idx = headerMap[col];
        outRow.push(idx !== undefined ? row[idx] : "");
      }
    }
    outData.push(outRow);
  }

  const newSheetName = originalName + " SORTED";
  const existing = ss.getSheetByName(newSheetName);
  if (existing) ss.deleteSheet(existing);

  const newSheet = ss.insertSheet(newSheetName);
  newSheet.getRange(1, 1, outData.length, outData[0].length).setValues(outData);

  const job1EndIdx = outHeaders.indexOf("job_1_job_end_date");
  if (job1EndIdx !== -1) {
    newSheet.getRange(2, job1EndIdx + 1, outData.length - 1, 1).setNumberFormat("@STRING@");
  }
  newSheet.setFrozenRows(1);
  newSheet.autoResizeColumns(1, outHeaders.length);
}

// ========== URL Scrape Reorder ==========
function reorderAndCleanSheet_URL() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getActiveSheet();
  const originalName = sheet.getName();
  const data = sheet.getDataRange().getValues();
  if (data.length < 2) {
    SpreadsheetApp.getUi().alert('No data to process.');
    return;
  }
  const headers = data[0];
  const headerMap = {};
  headers.forEach((header, idx) => {
    headerMap[String(header).trim().toLowerCase()] = idx;
  });

  const newLayout = [
    null, null, null, null,
    "input_data",
    "Full Name",
    "emails",
    null, null, null,
    "phones",
    "job_1_company_name",
    "job_1_title",
    "job_1_years",
    "job_1_end_date",
    "job_2_company_name",
    "job_2_title",
    "city_state",
    "edu_1_school_name",
    "edu_1_degree",
    "edu_1_field_of_study",
    "edu_1_end_year",
    "member_id"
  ];

  const outHeaders = newLayout.map(h => h === null ? "" : h);
  const outData = [outHeaders];

  for (let r = 1; r < data.length; r++) {
    const row = data[r];
    const outRow = [];
    for (let c = 0; c < newLayout.length; c++) {
      const col = newLayout[c];
      if (col === null) {
        outRow.push("");
      } else if (col === "Full Name") {
        const fnIdx = headerMap["first_name"] ?? -1;
        const lnIdx = headerMap["last_name"] ?? -1;
        const fn = fnIdx >= 0 ? row[fnIdx] : "";
        const ln = lnIdx >= 0 ? row[lnIdx] : "";
        outRow.push((fn + " " + ln).trim());
      } else if (col === "phones") {
        const idx = headerMap["phones"];
        if (idx !== undefined) {
          let val = row[idx];
          if (typeof val === "string") {
            val = val.replace(/[\[\]\(\)\-']/g, "");
          }
          outRow.push(val);
        } else {
          outRow.push("");
        }
      } else if (col === "emails") {
        const idx = headerMap["emails"];
        if (idx !== undefined) {
          let val = row[idx];
          if (typeof val === "string") {
            val = val.replace(/[\[\]']/g, "");
          }
          outRow.push(val);
        } else {
          outRow.push("");
        }
      } else if (col === "city_state") {
        const idx = headerMap["city_state"];
        outRow.push(idx !== undefined ? row[idx] : "");
      } else if (col === "edu_1_end_year") {
        const idx = headerMap["edu_1_end_year"];
        if (idx !== undefined) {
          const val = row[idx];
          const match = String(val).match(/\b(\d{4})\b/);
          outRow.push(match ? match[1] : "");
        } else {
          outRow.push("");
        }
      } else if (col === "job_1_end_date") {
        const idx = headerMap["job_1_end_date"];
        outRow.push(idx !== undefined ? row[idx] : "");
      } else {
        const idx = headerMap[col];
        outRow.push(idx !== undefined ? row[idx] : "");
      }
    }
    outData.push(outRow);
  }

  const newSheetName = originalName + " SORTED";
  const existing = ss.getSheetByName(newSheetName);
  if (existing) ss.deleteSheet(existing);

  const newSheet = ss.insertSheet(newSheetName);
  newSheet.getRange(1, 1, outData.length, outData[0].length).setValues(outData);

  const job1EndIdx = outHeaders.indexOf("job_1_end_date");
  if (job1EndIdx !== -1) {
    newSheet.getRange(2, job1EndIdx + 1, outData.length - 1, 1).setNumberFormat("@STRING@");
  }
  newSheet.setFrozenRows(1);
  newSheet.autoResizeColumns(1, outHeaders.length);
}