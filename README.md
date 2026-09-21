# Quickli Data ETL — Google Apps Script

A bound Google Apps Script for Google Sheets that adds custom menus to reorder, clean, and dedupe Quickli export data into a standardized "Batcave" layout.

## Features

- **Custom menu on open** — auto-injects **Quickli <> Batcave** and **Dedupe** menus into the Sheets toolbar via the `onOpen()` simple trigger.
- **LIR reorder** (`reorderAndCleanSheet_LIR`) — restructures LIR Search exports into a fixed 23-column Batcave layout, merges first/last name into "Full Name", strips brackets/parens/dashes from phones and emails, and extracts a 4-digit graduation year from `edu_1_edu_end_year`.
- **URL reorder** (`reorderAndCleanSheet_URL`) — same pipeline as LIR, but mapped against the URL-scrape header schema (`job_1_company_name`, `city_state`, `edu_1_end_year`, etc.).
- **Dedupe W** (`sortAndDedupeColumnW`) — sorts and dedupes column W. Referenced from the menu; the function lives in a companion file that is **not yet in this repo** (see [Known gaps](#known-gaps)).
- **Output sheet** — writes results to a new tab named `<original> SORTED`, replacing any existing copy, with a frozen header row and auto-resized columns.
- **Number formatting** — forces `job_1_job_end_date` / `job_1_end_date` to text format so dates aren't auto-converted by Sheets.

## Installation

1. Open the target Google Sheet → **Extensions → Apps Script**.
2. Delete the boilerplate `Code.gs` content and paste in the contents of this repo's `.js` file.
3. Click **Save** (💾) and name the project (e.g., *Quickli Data ETL*).
4. From the function dropdown, select `onOpen` and click **Run** once to authorize the script.
5. Reload the spreadsheet — two new menus, **Quickli <> Batcave** and **Dedupe**, will appear in the menu bar.

> **Note:** This must be a *bound* script (created via Extensions → Apps Script from inside the sheet). Standalone scripts cannot create custom menus.

## Usage

### Quickli <> Batcave → LIR

1. Open a sheet containing a raw LIR export (with headers like `first_name`, `last_name`, `emails`, `phones`, `public_url`, `job_1_job_company_name`, etc.).
2. Click **Quickli <> Batcave → LIR**.
3. A new tab `<sheet name> SORTED` is created with the cleaned, reordered data.

### Quickli <> Batcave → URL

1. Open a sheet containing a URL-scrape export (headers like `input_data`, `job_1_company_name`, `city_state`, `edu_1_end_year`).
2. Click **Quickli <> Batcave → URL**.
3. Output appears in a new `<sheet name> SORTED` tab.

### Dedupe → Dedupe W

Sorts and deduplicates rows by column W on the active sheet.

## Output Layout (LIR + URL)

| Col | Field |
| --- | --- |
| A–D | *(blank padding)* |
| E | `public_url` / `input_data` |
| F | Full Name (first + last merged) |
| G | emails (cleaned) |
| H–J | *(blank padding)* |
| K | phones (cleaned) |
| L | job_1 company |
| M | job_1 title |
| N | job_1 years |
| O | job_1 end date (text-formatted) |
| P | job_2 company |
| Q | job_2 title |
| R | location / city_state |
| S | edu_1 school |
| T | edu_1 degree |
| U | edu_1 field of study |
| V | edu_1 end year (4-digit) |
| W | member_id |

## Header Matching

Header lookup is case-insensitive and trims whitespace, so source headers like `Emails`, `EMAILS`, or `emails` all resolve correctly via the internal `headerMap`.

## Cleaning Rules

- **Phones:** removes `[ ] ( ) -` and apostrophes.
- **Emails:** removes `[ ]` and apostrophes.
- **Education end year:** extracts the first 4-digit year via regex `\b(\d{4})\b`.
- **Missing source columns:** silently filled with empty strings (no errors).

## Requirements

- Google account with edit access to the target spreadsheet.
- Script must be container-bound to the spreadsheet.
- Authorization scope: `SpreadsheetApp` (read/write the active sheet).

## Troubleshooting

- **Menu doesn't appear:** run `onOpen` manually from the Apps Script editor once and reload the sheet.
- **Dedupe W errors:** ensure the `sortAndDedupeColumnW` function is defined in another file in the same Apps Script project — it's referenced but not included in the main ETL script.
- **Dates look wrong:** the script forces `@STRING@` format on the job-1 end-date column; if you re-format the column, raw values may be re-interpreted by Sheets.

## Known gaps

- `sortAndDedupeColumnW` is called by the **Dedupe → Dedupe W** menu item but is not defined in this repo. Until it is added, that menu item only works in Apps Script projects that already contain the function in a separate file.
- `reorderAndCleanSheet_LIR` and `reorderAndCleanSheet_URL` are near-identical copies that differ only in their header names. They could be merged into one shared function that takes the layout as an input.

## Working on this from another computer

The code lives on GitHub, so any computer can get a copy:

```bash
git clone https://github.com/BatmanRecruiter/Google_Apps_Script_-_Quickli_ETL.git
```

Before starting work, run `git pull` to grab the latest changes. When finished, `git add`, `git commit`, and `git push` to send your changes back up so the other computer can pull them.

Note that this repo is a *backup* of the script. The live copy runs inside the Google Sheet (Extensions → Apps Script), so after editing here, paste the updated code into the Apps Script editor for it to take effect.
