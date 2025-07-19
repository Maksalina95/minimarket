// scripts/config.js

const SHEET_ID = "1gBcuPzWv_nH2i7sWyCaERVCjO-hLg8EcndPkEMlNqgw";
const SHEET_NAME = "Sheet1";
const URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?sheet=${SHEET_NAME}&tqx=out:json`;

async function fetchSheetData() {
  const res = await fetch(URL);
  const text = await res.text();
  const json = JSON.parse(text.substr(47).slice(0, -2));

  const cols = json.table.cols.map(col => col.label.toLowerCase());
  return json.table.rows.map(row => {
    const obj = {};
    cols.forEach((key, i) => {
      obj[key] = row.c[i]?.v || "";
    });
    return obj;
  });
}

export { fetchSheetData };
