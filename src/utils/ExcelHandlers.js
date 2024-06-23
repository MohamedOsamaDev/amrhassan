// @ts-nocheck
const ExcelJS = require("exceljs");
const convertExcelToJson = async (file) => {
  try {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(file);
    const jsonData = [];
    let headers = [];
    // Check if there are worksheets
    if (workbook.worksheets.length === 0) {
      new Error("The uploaded Excel file contains no worksheets.");
    }
    const worksheet = workbook.worksheets[0];
    // Check if the worksheet is empty
    if (!worksheet) {
      new Error("The uploaded Excel file is empty or invalid.");
    }
    worksheet.eachRow({ includeEmpty: true }, function (row, rowNumber) {
      if (rowNumber === 1) {
        // Assuming the first row is the header row
        headers = row.values.slice(1); // Remove the first undefined element
      } else {
        const rowData = {};
        // Map headers to their respective cell values
        for (let i = 1; i < row.values.length; i++) {
          const header = headers[i - 1];
          const cellValue = row.values[i];
          rowData[header] = cellValue;
        }

        if (Object.keys(rowData).length > 0) {
          // Ensure not empty
          jsonData.push(rowData);
        }
      }
    });
    return { data: jsonData, errors: null };
  } catch (error) {
    console.log("🚀 ~ convertExcelToJson ~ error:", error)
    return { error, data: null };
  }
};

module.exports = { convertExcelToJson };
