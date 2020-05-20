const express = require("express");
const router = express.Router();
const dataModel = require("../model/dataModel");
const mongoose = require("mongoose");
const Excel = require("exceljs");
const workbook = new Excel.Workbook();
const ObjectId = mongoose.Types.ObjectId;

// main 화면
router.get("/download/:excel_id", async (req, res) => {
  let data = await dataModel.findOne({ _id: ObjectId(req.params.excel_id) });
  // let options = {
  //   filename = './excels/PEGASUS_STATISTICS.xlsx',
  //   useStyle:true,
  //   useSharedString:true
  // }
  let fileName = "./excels/PEGASUS_STATISTICS.xlsx";
  let excel = await workbook.xlsx.readFile(fileName);
  let ws = excel.worksheets[0];
  ws.getCell("B8").value = data.data_title;
  ws.getCell("B10").value = data.data_unit;
  ws.getCell("B12").value = data.data_no;
  ws.getCell("B14").value = data.description;
  ws.getCell("B16").value = data.source;
  let table_x = [""].concat(data.table_x.content);
  let table_y = data.table_y.map((v) => {
    return [v.title].concat(v.content);
  });
  //  table 데이터 입력하기
  //  x 축 데이터 입력
  table_x.forEach((v, x) => {
    ws.getCell(18, x + 2).value = v;
  });
  //  y 축 데이터 입력
  table_y.forEach((row, y) => {
    row.forEach((v, x) => {
      ws.getCell(19 + y, x + 2).value = v;
    });
  });

  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.setHeader(
    "Content-Disposition",
    "attachment; filename=PEGASUS_STATISTICS_" + data.data_no + ".xlsx"
  );
  await workbook.xlsx.write(res);
  res.end();
});
module.exports = router;
