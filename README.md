Quickli Data ETL — Google Apps Script
A bound Google Apps Script for Google Sheets that adds custom menus to reorder, clean, and dedupe Quickli export data into a standardized "Batcave" layout.

Features
Custom menu on open — auto-injects "Quickli <> Batcave" and "Dedupe" menus into the Sheets toolbar via the onOpen() simple trigger.

LIR reorder (reorderAndCleanSheet_LIR) — restructures LIR Search exports into a fixed 23-column Batcave layout, merges first/last name into "Full Name", strips brackets/parens/dashes from phones and emails, and extracts a 4-digit graduation year from edu_1_edu_end_year.

URL reorder (reorderAndCleanSheet_URL) — same pipeline as LIR, but mapped against the URL-scrape header schema (job_1_company_name, city_state, edu_1_end_year, etc.).

Dedupe W (sortAndDedupeColumnW) — sorts and dedupes column W (referenced from the menu; function lives in a companion file).

Output sheet — writes results to a new tab named <original> SORTED, replacing any existing copy, with frozen header row and auto-resized columns.

Number formatting — forces job_1_job_end_date / job_1_end_date to text format so dates aren't auto-converted by Sheets.

Installation
Open the target Google Sheet → Extensions → Apps Script.

Delete the boilerplate Code.gs content and paste in the contents of this repo's .js file.

Click Save (💾) and name the project (e.g., Quickli Data ETL).

From the function dropdown, select onOpen and click Run once to authorize the script.

Reload the spreadsheet — two new menus, Quickli <> Batcave and Dedupe, will appear in the menu bar.

Note: This must be a bound script (created via Extensions → Apps Script from inside the sheet). Standalone scripts cannot create custom menus.

Usage
Quickli <> Batcave → LIR
Open a sheet containing a raw LIR export (with headers like first_name, last_name, emails, phones, public_url, job_1_job_company_name, etc.).

Click Quickli <> Batcave → LIR.

A new tab <sheet name> SORTED is created with the cleaned, reordered data.

Quickli <> Batcave → URL
Open a sheet containing a URL-scrape export (headers like input_data, job_1_company_name, city_state, edu_1_end_year).

Click Quickli <> Batcave → URL.

Output appears in a new <sheet name> SORTED tab.

Dedupe → Dedupe W
Sorts and deduplicates rows by column W on the active sheet.

Output Layout (LIR + URL)
Col	Field
A–D	(blank padding)
E	public_url / input_data
F	Full Name (first + last merged)
G	emails (cleaned)
H–J	(blank padding)
K	phones (cleaned)
L	job_1 company
M	job_1 title
N	job_1 years
O	job_1 end date (text-formatted)
P	job_2 company
Q	job_2 title
R	location / city_state
S	edu_1 school
T	edu_1 degree
U	edu_1 field of study
V	edu_1 end year (4-digit)
W	member_id
Header Matching
Header lookup is case-insensitive and trims whitespace, so source headers like Emails, EMAILS, or emails all resolve correctly via the internal headerMap.

Cleaning Rules
Phones: removes [ ] ( ) - and apostrophes.

Emails: removes [ ] and apostrophes.

Education end year: extracts first 4-digit year via regex \b(\d{4})\b.

Missing source columns: silently filled with empty strings (no errors).

Requirements
Google account with edit access to the target spreadsheet.

Script must be container-bound to the spreadsheet.

Authorization scope: SpreadsheetApp (read/write the active sheet).

Troubleshooting
Menu doesn't appear: run onOpen manually from the Apps Script editor once and reload the sheet.

Dedupe W errors: ensure the sortAndDedupeColumnW function is defined in another file in the same project — it's referenced but not included in the main ETL script.

Dates look wrong: the script forces @STRING@ format on the job-1 end-date column; if you re-format the column, raw values may be re-interpreted by Sheets.
