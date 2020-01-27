function excelExport() {
  let input = document.querySelector('input[name="excelFile"]');
  if (input.value === "") {
    alert("대량업로드에 사용할 엑셀파일을 먼저 선택해주세요.");
    return false;
  }
  let reader = new FileReader();
  reader.onload = function() {
    let fileData = reader.result;
    let wb = XLSX.read(fileData, { type: "binary" });
    let list = [];
    let graph_list = [
      "bar_chart_vertical",
      "bar_chart_horizontal",
      "pie_chart",
      "line_chart",
      "radar_chart",
      "multiline_chart",
      "diffPoint_chart",
      "stackedArea_chart",
      "comboBarLine_chart",
      "stepLine_chart",
      "polarArea_chart"
    ];
    wb.SheetNames.forEach(function(sheetName) {
      /*
        TODO 유효성 검증 및 상태확인 창 띄우기
        1. 각 엑셀 항목별로 중복되는 자료번호가 있는지 확인
        2. 현재 프로세스별 상태확인 창을 띄워서 정상적으로 구동되는지 확인
        3. 굳이.. 
      */
      let rowObj = XLSX.utils.sheet_to_json(wb.Sheets[sheetName]);
      let idx = 0;
      for (var row in rowObj) {
        let resultObj = {};
        let obj = rowObj[row];
        if (obj["제목"]) {
          resultObj["data_title"] = obj["제목"];
          resultObj["data_unit"] = obj["단위"];
          resultObj["chart_type"] = graph_list[obj["그래프유형"] - 1];
          resultObj["data_no"] = obj["자료번호"];
          // category object 만들기
          let cateList = [];
          __category.forEach(function(item) {
            _cateObj = { cate: item.cate, sub_cate: [] };
            obj["category"].split(",").forEach(function(v) {
              if (item.sub_cate.indexOf(v.trim()) > -1) {
                _cateObj.sub_cate.push(v.trim());
              }
            });
            cateList.push(_cateObj);
          });
          resultObj["category_obj"] = cateList;
          // region, city
          obj["region"].split(",").forEach(function(_r) {
            let r = _r.trim();
            if (__region.indexOf(r) > -1) {
              if (resultObj["region_array"]) {
                resultObj["region_array"].push(r);
              } else {
                resultObj["region_array"] = [r];
              }
            }
            if (__cities.indexOf(r) > -1) {
              if (resultObj["city_array"]) {
                resultObj["city_array"].push(r);
              } else {
                resultObj["city_array"] = [r];
              }
            }
          });
          resultObj["object"] = obj["object"].split(",");
          resultObj["description"] = obj["description"];
          resultObj["source"] = obj["source"];

          // table 만들기
          let table_x = obj["가로(X)축"];
          let table_y = obj["세로(Y)축"];
          let table_x_obj = { title: "", content: [] };
          let table_y_obj = [];
          for (var i = idx; i < table_y + idx; i++) {
            if (i === idx) {
              table_x_obj.title = rowObj[i]["내용(데이터)"];
              for (var x = 1; x < table_x; x++) {
                if (x === 1) {
                  table_x_obj.content = [obj["__EMPTY"]];
                } else {
                  table_x_obj.content.push(obj["__EMPTY_" + (x - 1)]);
                }
              }
            } else {
              let y_list = [];
              for (var y = 1; y < table_x; y++) {
                if (y === 1) {
                  y_list = [rowObj[i]["__EMPTY"]];
                } else {
                  y_list.push(rowObj[i]["__EMPTY_" + (y - 1)]);
                }
              }
              table_y_obj.push({
                title: rowObj[i]["내용(데이터)"],
                content: y_list
              });
            }
          }
          resultObj["table_x"] = table_x_obj;
          resultObj["table_y"] = table_y_obj;
          list.push(resultObj);
        }
        idx++;
      }
    });
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "/admin/data/excelUpload", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function() {
      if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
        let res = JSON.parse(this.response);
        if (res.result === 1) {
          console.log("res : ", res);
        }
      }
    };
    xhr.send(JSON.stringify(list));
  };
  reader.readAsBinaryString(input.files[0]);
}
