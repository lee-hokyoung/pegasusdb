// 사용자 등록하기
function fnRegisterUser() {
  let user_no = document.querySelector('input[name="user_no"]');
  let user_corp = document.querySelector('input[name="user_corp"]');
  let manager_name = document.querySelector('input[name="manager_name"]');
  let manager_tel = document.querySelector('input[name="manager_tel"]');
  let email = document.querySelector('input[name="email"]');
  let user_id = document.querySelector('input[name="user_id"]');
  let user_pw = document.querySelector('input[name="user_pw"]');
  if (user_no.value === "") {
    alert("고객번호를 입력해주세요");
    user_no.focus();
    return false;
  }
  if (user_corp.value === "") {
    alert("기업명을 입력해주세요.");
    user_corp.focus();
    return false;
  }
  if (manager_name.value === "") {
    alert("담당자를 입력해주세요.");
    manager_name.focus();
    return false;
  }
  if (manager_tel.value === "") {
    alert("연락처를 입력해주세요");
    manager_tel.focus();
    return false;
  }
  if (email.value === "") {
    alert("이메일을 입력해주세요");
    email.focus();
    return false;
  }
  if (user_id.value === "") {
    alert("아이디를 입력해주세요");
    user_id.focus();
    return false;
  }
  if (user_pw.value === "") {
    alert("비밀번호를 입력해주세요");
    user_pw.focus();
    return false;
  }
  let data = {},
    category = [];
  document.querySelectorAll('input[type="text"]').forEach(function(v) {
    data[v.name] = v.value;
  });
  document
    .querySelectorAll('input[type="checkbox"]:checked')
    .forEach(function(v) {
      category.push(v.name);
    });
  data["category"] = category;
  // let data = $('form[name="formDataRegister"]').serialize();
  // let category = $('form[name="formCategory"]').serialize();
  let xhr = new XMLHttpRequest();
  xhr.open("POST", "/admin/user/register", true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onreadystatechange = function() {
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
      let res = JSON.parse(this.response);
      if (res.result === 1) {
        alert(res.message);
        location.reload();
      } else {
        alert(res.message);
      }
    }
  };
  xhr.send(JSON.stringify(data));
}

//  사용자 검색
function fnSearch() {
  let searchText = document.querySelector('input[name="searchText"]');
  // if(!manager_name.value){
  //   alert('담당자명을 입력해주세요.');
  //   manager_name.focus();
  //   return false;
  // }
  let xhr = new XMLHttpRequest();
  xhr.open("POST", "/admin/user/search", true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onreadystatechange = function() {
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
      let res = JSON.parse(this.response);
      fnGenerateUserList(res);
    }
  };
  xhr.send(JSON.stringify({ searchText: searchText.value }));
}

function fnGenerateUserList(res) {
  let list_wrap = document.querySelector(".user-list-wrap");
  list_wrap.innerHTML = "";
  res.forEach(function(v, idx) {
    // li Element
    let li = document.createElement("li");
    li.className = "list-group-item";
    if (idx % 2 === 1) li.className += " list-group-item-secondary";
    // 로우
    let row = document.createElement("div");
    row.className = "row small";
    // 첫번째 컬럼(고객번호)
    let col1 = document.createElement("div");
    col1.className = "col-1";
    col1.innerText = v.user_no;
    // 두번째 컬럼(기업명)
    let col2 = document.createElement("div");
    col2.className = "col-1";
    col2.innerText = v.user_corp;
    // 세번째 컬럼(담당자)
    let col3 = document.createElement("div");
    col3.className = "col-1";
    col3.innerText = v.manager_name;
    // 네번째 컬럼(연락처)
    let col4 = document.createElement("div");
    col4.className = "col-1";
    col4.innerText = v.manager_tel;
    // 다섯번째 컬럼(이메일)
    let col5 = document.createElement("div");
    col5.className = "col-1";
    col5.innerText = v.email;
    // 여섯번째 컬럼(아이디)
    let col6 = document.createElement("div");
    col6.className = "col text-nowrap";
    col6.innerText = v.user_id;
    // 일곱번째 컬럼(비밀번호)
    let col7 = document.createElement("div");
    col7.className = "col text-nowrap";
    col7.innerText = v.user_pw;
    // 여덟번째 컬럼(데이터 구매목록)
    let col8 = document.createElement("div");
    col8.className = "col-1";
    for (
      let i = 0;
      i < (v.cate_info.length < 4 ? v.cate_info.length : 4);
      i++
    ) {
      let p = document.createElement("p");
      p.className = "m-0";
      p.innerHTML = v.cate_info[i].cate_name;
      col8.appendChild(p);
      // col8.innertText = v.cate_info[i].cate_name;
      // col8.appendChild(document.createElement('br'));
    }
    if (v.cate_info.length > 4) {
      let collapse = document.createElement("div");
      collapse.className = "overflow-hidden collapse";
      collapse.setAttribute("style", "line-height:1.3em;");
      collapse.id = "cate_" + v._id;
      for (let i = 4; i < v.cate_info.length; i++) {
        let p = document.createElement("p");
        p.className = "m-0";
        p.innerHTML = v.cate_info[i].cate_name;
        collapse.appendChild(p);
        // collapse.appendChild(v.cate_info[i].cate_name);
        // collapse.appendChild(document.createElement('br'));
      }
      col8.appendChild(collapse);
      let readMore = document.createElement("a");
      readMore.href = "#";
      readMore.setAttribute("data-toggle", "collapse");
      readMore.setAttribute("data-target", "#cate_" + v._id);
      col8.appendChild(readMore);
    }

    // 아홉번째 컬럼(중지/삭제 버튼)
    let col9 = document.createElement("div");
    col9.className = "col-1";
    let wrap = document.createElement("div");
    wrap.className = "status-btn-wrap";
    wrap.setAttribute("data-id", v._id);
    let btn1 = document.createElement("button");
    btn1.className = "btn btn-primary btn-sm p-1 mb-1";
    btn1.setAttribute("data-status", "1");
    btn1.innerText = "제공";
    let btn2 = document.createElement("button");
    btn2.className = "btn btn-warning btn-sm p-1 mb-1";
    btn2.setAttribute("data-status", "2");
    btn2.innerText = "중지";
    let btn3 = document.createElement("button");
    btn3.className = "btn btn-danger btn-sm p-1 mb-1";
    btn3.setAttribute("data-status", "3");
    btn3.innerText = "삭제";
    wrap.appendChild(btn1);
    wrap.appendChild(btn2);
    wrap.appendChild(btn3);
    col9.appendChild(wrap);
    // 열번째 컬럼(상태)
    let col10 = document.createElement("div");
    col10.className = "col-1 colorStatus";
    col10.setAttribute("data-id", v._id);
    col10.setAttribute("data-status", v.status);
    row.appendChild(col1);
    row.appendChild(col2);
    row.appendChild(col3);
    row.appendChild(col4);
    row.appendChild(col5);
    row.appendChild(col6);
    row.appendChild(col7);
    row.appendChild(col8);
    row.appendChild(col9);
    row.appendChild(col10);
    li.appendChild(row);
    list_wrap.appendChild(li);
  });
}

// 사용자 상태 변경 버튼 클릭 이벤트
$(document).on("click", ".status-btn-wrap button", function() {
  console.log($(this));
  let btn = $(this)[0];
  let id = btn.parentElement.dataset.id;
  let status = btn.dataset.status;
  let xhr = new XMLHttpRequest();
  let status_txt = document.querySelector('.colorStatus[data-id="' + id + '"]');
  xhr.open("POST", "/admin/user/status", true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onreadystatechange = function() {
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
      let res = JSON.parse(this.response);
      status_txt.dataset.status = status;
      alert("변경되었습니다.");
    }
  };
  xhr.send(JSON.stringify({ id: id, status: status }));
});

// 데이터 테이블 컬럼 추가
function fnAddCol() {
  document.querySelectorAll("tr").forEach(function(tr) {
    let data_type = tr.dataset.type;
    let current_idx = parseInt(tr.dataset.idx);
    let td = document.createElement("td");
    td.dataset.idx = current_idx + 1;
    let input = document.createElement("input");
    input.type = "text";
    input.name = data_type + "_data_" + (current_idx + 1);
    td.appendChild(input);
    tr.appendChild(td);
    tr.dataset.idx = current_idx + 1;
  });
}

// 데이터 테이블 컬럼 제거
function fnRemoveCol() {
  document.querySelectorAll("tr").forEach(function(tr) {
    let target_idx = tr.dataset.idx;
    if (target_idx) {
      tr.querySelector('td[data-idx="' + target_idx + '"]').remove();
      tr.dataset.idx = target_idx - 1;
    }
  });
}

// 데이터 테이블 로우 추가
function fnAddRow() {
  let tbody = document.querySelector("tbody");
  let row_idx = parseInt(tbody.dataset.row);
  tbody.dataset.row = row_idx + 1;

  let col_idx = parseInt(tbody.querySelector("tr").dataset.idx);
  let tr = document.createElement("tr");
  tr.dataset.type = "y";
  tr.dataset.idx = col_idx;
  tr.dataset.row_idx = row_idx + 1;
  let th = document.createElement("th");
  let input = document.createElement("input");
  input.type = "text";
  input.name = "chart_y";
  input.dataset.title = "true";
  th.appendChild(input);
  tr.appendChild(th);
  let td = document.createElement("td");
  td.classList.add("space_td");
  tr.appendChild(td);
  for (let i = 1; i < col_idx + 1; i++) {
    let td = document.createElement("td");
    td.dataset.idx = i;
    let input = document.createElement("input");
    input.type = "text";
    input.name = "y_data_" + i;
    td.appendChild(input);
    tr.appendChild(td);
  }
  tbody.appendChild(tr);
}

// 데이터 테이블 로우 제거
function fnRemoveRow() {
  let tbody = document.querySelector("tbody");
  let tr_idx = parseInt(tbody.dataset.row);
  if (tr_idx === 1) return false;
  let trs = document.querySelectorAll("tbody tr");
  trs[tr_idx - 1].remove();
  tbody.dataset.row = tr_idx - 1;
}

// 데이터 제출하기
function fnSubmit() {
  let post_data = fnGenerateFormData();
  if (!post_data) return false;
  // 데이터 등록
  let xhr = new XMLHttpRequest();
  xhr.open("POST", "/admin/data/register", true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onreadystatechange = function() {
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
      let res = JSON.parse(this.response);
      if (res.code !== 0) {
        alert(res.message);
      } else {
        alert("등록성공");
        location.href = "/admin/data/list";
      }
    }
  };
  xhr.send(JSON.stringify(post_data));
}

// 폼 데이터 생성
function fnGenerateFormData() {
  let add_img_graph = document.querySelector('input[name="add_img_graph"]');
  let isAddImage = add_img_graph.value !== "";
  let data_title = document.querySelector('input[name="data_title"]');
  if (data_title.value === "") {
    alert("제목을 입력해 주세요");
    data_title.focus();
    return false;
  }

  let data_unit = document.querySelector('input[name="data_unit"]');
  if (
    data_unit.value === "" &&
    !isAddImage &&
    add_img_graph.dataset.file === ""
  ) {
    alert("단위를 입력해 주세요");
    data_unit.focus();
    return false;
  }

  let chart_type = document.querySelector('input[type="radio"]:checked');
  if (chart_type === null && !isAddImage && add_img_graph.dataset.file === "") {
    alert("차트타입을 선택해주세요.");
    document.querySelector('input[type="radio"]').focus();
    return false;
  }

  // x축 데이터 생성
  let table_x = { title: "", content: [] };
  document.querySelectorAll("table thead input").forEach(function(v) {
    if (v.dataset.title) table_x.title = v.value;
    else table_x.content.push(v.value);
  });
  // y축 데이터 생성 멀티 라인
  let table_y = [];
  document.querySelectorAll("tbody tr").forEach(function(tr) {
    let tr_obj = { title: "", content: [] };
    tr.querySelectorAll("input").forEach(function(v) {
      if (v.dataset.title) tr_obj.title = v.value;
      else tr_obj.content.push(v.value);
    });
    table_y.push(tr_obj);
  });
  let data_no = document.querySelector('input[name="data_no"]');
  if (data_no.value === "") {
    alert("자료번호를 입력해 주세요");
    data_no.focus();
    return false;
  }

  let category_obj = {};
  document.querySelectorAll("div.col-4.mb-3").forEach(function(div) {
    let cate_header = div.querySelector("h5").id;
    category_obj[cate_header] = [];
    div.querySelectorAll("input:checked").forEach(function(input) {
      let obj = {};
      obj[input.id] = input.value;
      category_obj[cate_header].push(obj);
    });
  });
  let region_array = [];
  document.querySelectorAll("#region input:checked").forEach(function(input) {
    region_array.push(input.value);
  });
  let city_array = [];
  document.querySelectorAll("#city input:checked").forEach(function(input) {
    city_array.push(input.value);
  });
  let object = [];
  document
    .querySelectorAll('input[name="obj"]:checked')
    .forEach(function(input) {
      object.push(input.value);
    });
  let description = document.querySelector('textarea[name="description"]');
  let source = document.querySelector('input[name="source"]');

  let post_data = {};
  post_data["data_title"] = data_title.value;
  if (!isAddImage && add_img_graph.dataset.file === "")
    post_data["data_unit"] = data_unit.value;
  if (!isAddImage && add_img_graph.dataset.file === "")
    post_data["chart_type"] = chart_type.value;
  if (!isAddImage && add_img_graph.dataset.file === "")
    post_data["table_x"] = table_x;
  if (!isAddImage && add_img_graph.dataset.file === "")
    post_data["table_y"] = table_y;
  post_data["data_no"] = data_no.value;
  post_data["category_obj"] = category_obj;
  post_data["region_array"] = region_array;
  post_data["city_array"] = city_array;
  post_data["object"] = object;
  post_data["description"] = description.value;
  post_data["source"] = source.value;

  // file upload. path, original name 이 있는지 확인 후 post_data 에 등록
  let path_arr = [],
    originalname_arr = [];
  document.querySelectorAll('input[type="file"]').forEach(function(file) {
    if (file.value) {
      // path_arr.push(file.dataset.path);
      // originalname_arr.push(file.dataset.originalname);
      // post_data[file.name] = file.dataset.path.replace('temps\/', '');
      post_data[file.name] = {
        original: file.dataset.originalname,
        path: file.dataset.path
      };
    }
  });
  // post_data['files'] = {'path':path_arr, 'originalname':originalname_arr};
  // console.log('post data : ', post_data);
  // return false;
  return post_data;
}

// 데이터 업데이트
function fnUpdateData(id) {
  let post_data = fnGenerateFormData();
  if (!post_data) return false;
  // 데이터 등록
  let xhr = new XMLHttpRequest();
  xhr.open("PUT", "/admin/data/update/" + id, true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onreadystatechange = function() {
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
      let res = JSON.parse(this.response);
      if (res.ok === 1) {
        alert("정상적으로 수정되었습니다.");
        location.href = "/admin/data/list";
      }
    }
  };
  xhr.send(JSON.stringify(post_data));
}

// 데이터 삭제
function fnDeleteData(id) {
  if (confirm("정말 삭제시겠습니까?")) {
    let xhr = new XMLHttpRequest();
    xhr.open("DELETE", "/admin/data/" + id);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = function() {
      if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
        let res = JSON.parse(this.response);
        if (res.ok === 1) {
          let li = document.querySelector('li[about="' + id + '"]');
          li.remove();
          alert("삭제되었습니다.");
        }
      }
    };
    xhr.send();
  }
}

// 데이터 검색
function fnSearchData() {
  let searchText = document.querySelector("#searchText").value;
  let xhr = new XMLHttpRequest();
  xhr.open("POST", "/admin/data/search");
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onreadystatechange = function() {
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
      let res = JSON.parse(this.response);
      console.log("res : ", res);
      fnGenerateDataList(res);
    }
  };
  xhr.send(JSON.stringify({ searchText: searchText }));
}

// 검색된 데이터 html 생성
function fnGenerateDataList(list) {
  let dataList = document.getElementById("data_item_list");
  dataList.innerHTML = "";
  list.forEach(function(v) {
    let date = new Date(v.updated);
    let li = document.createElement("li");
    li.className = "list-group-item";
    li.setAttribute("about", v._id);
    let row = document.createElement("div");
    row.className = "row small text-nowrap";
    let col_1 = document.createElement("div");
    col_1.className = "col-1";
    col_1.innerText = v.data_no;
    let col_2 = document.createElement("div");
    col_2.className = "col-2 text-normal";
    col_2.innerText = v.data_title;
    let col_3 = document.createElement("div");
    col_3.className = "col-1";
    col_3.innerText = v.data_unit;

    // 카테고리 컬럼
    let col_4 = document.createElement("div");
    col_4.className = "col-1 text-normal";
    let cate_arr = [];
    for (let category in v.category_obj) {
      v.category_obj[category].forEach(function(cate) {
        cate_arr.push(cate[Object.keys(cate)]);
      });
    }
    for (let n = 0; n < (cate_arr.length < 4 ? cate_arr.length : 4); n++) {
      let p = document.createElement("p");
      p.className = "m-0";
      p.innerText = cate_arr[n];
      col_4.appendChild(p);
    }
    if (cate_arr.length > 4) {
      let collapse = document.createElement("div");
      collapse.className = "collapse overflow-hidden";
      collapse.setAttribute("style", "line-height:1.3em;");
      collapse.setAttribute("id", "cate_" + v._id);
      for (let n = 4; n < cate_arr.length; n++) {
        let p = document.createElement("p");
        p.className = "m-0";
        p.innerText = cate_arr[n];
        collapse.appendChild(p);
      }
      col_4.appendChild(collapse);
      let a = document.createElement("a");
      a.className = "hidden-wrap";
      a.href = "#";
      a.setAttribute("data-toggle", "collapse");
      a.setAttribute("data-target", "#cate_" + v._id);
      col_4.appendChild(a);
    }
    // Region
    let region_items = v.region_array.concat(v.city_array);
    let col_5 = document.createElement("div");
    col_5.className = "col-1";
    for (
      let n = 0;
      n < (region_items.length < 4 ? region_items.length : 4);
      n++
    ) {
      let p = document.createElement("p");
      p.className = "m-0";
      p.innerText = region_items[n];
      col_5.appendChild(p);
    }
    if (region_items.length > 4) {
      let collapse = document.createElement("div");
      collapse.className = "overflow-hidden collapse";
      collapse.setAttribute("style", "line-height:1.3rem;");
      collapse.setAttribute("id", "region_" + v._id);
      for (let n = 4; n < region_items.length; n++) {
        let p = document.createElement("p");
        p.className = "m-0";
        p.innerText = region_items[n];
        collapse.appendChild(p);
      }
      let a = document.createElement("a");
      a.className = "hidden-wrap";
      a.href = "#";
      a.setAttribute("data-toggle", "collapse");
      a.setAttribute("data-target", "#region_" + v._id);
      col_5.appendChild(collapse);
      col_5.appendChild(a);
    }
    let col_6 = document.createElement("div");
    col_6.className = "col-1";
    v.object.forEach(function(obj) {
      let p = document.createElement("p");
      p.className = "m-0";
      p.innerText = obj;
      col_6.appendChild(p);
    });
    let col_7 = document.createElement("div");
    col_7.className = "col-2 text-center";
    let a = document.createElement("a");
    a.className = "btn btn-primary btn-sm my-1 mx-auto";
    a.href = "/admin/data/read/" + v._id;
    a.innerText = "업데이트";
    let button = document.createElement("button");
    button.className = "btn btn-danger d-block my-1 mx-auto btn-sm";
    button.addEventListener("click", function() {
      fnDeleteData(v._id);
    });
    button.innerText = "삭제";
    col_7.appendChild(a);
    col_7.appendChild(button);
    let col_8 = document.createElement("div");
    col_8.classList.add("col-1");
    col_8.innerText =
      v.status === 1 ? "제공" : v.status === 2 ? "중지" : "삭제";
    let col_9 = document.createElement("div");
    col_9.classList.add("col-2");
    col_9.innerText = date.toLocaleDateString("ko");
    row.appendChild(col_1);
    row.appendChild(col_2);
    row.appendChild(col_3);
    row.appendChild(col_4);
    row.appendChild(col_5);
    row.appendChild(col_6);
    row.appendChild(col_7);
    row.appendChild(col_8);
    row.appendChild(col_9);
    li.appendChild(row);
    dataList.appendChild(li);
  });
}

//  데이터 이미지 등록시 단위, 그래프 유형, 내용(데이터) 입력 차단 및 필수 항목 해제
const fnInputImage = function() {
  let input = document.querySelector('input[name="add_img_graph"]');
  let data_unit = document.querySelector('input[name="data_unit"]');
  let table_inputs = document.querySelectorAll("#table_content input");
  let table_radio = document.querySelectorAll('input[type="radio"]');
  let table_buttons = document.querySelectorAll("button.btn-sm");
  if (input.value !== "") {
    data_unit.disabled = true;
    table_inputs.forEach(function(inp) {
      inp.disabled = true;
    });
    table_radio.forEach(function(radio) {
      radio.disabled = true;
    });
    table_buttons.forEach(function(btn) {
      btn.disabled = true;
    });
  } else {
    data_unit.disabled = false;
    table_inputs.forEach(function(inp) {
      inp.disabled = false;
    });
    table_radio.forEach(function(radio) {
      radio.disabled = false;
    });
    table_buttons.forEach(function(btn) {
      btn.disabled = false;
    });
  }
};
/*
 *   파일 업로드
 *   1. 각각의 파일 입력 폼에 파일이 등록되면 change 이벤트 발생
 *   2. 파일이 있을 경우, 서버(temp 폴더)에 파일을 업로드
 *   3. 업로드 된 파일의 경로명(path), 파일명(originalname) 을 해당 input Element 의 dataset 에 기록한다.
 *   3. 파일이 없을 경우, 변화가 없으나 최종적으로 submit 을 할 때, value 유무 확인한 후 dataset 내용 업로드
 */
document.querySelectorAll('input[type="file"]').forEach(function(file) {
  file.addEventListener("change", function(e) {
    const formData = new FormData();
    Object.keys(e.target.files).forEach(function(key) {
      formData.append("file", e.target.files[key], e.target.files[key].name);
    });
    if (e.target.files.length > 0) {
      let xhr = new XMLHttpRequest();
      xhr.open("POST", "/admin/data/file_upload");
      xhr.onreadystatechange = function() {
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
          let res = JSON.parse(this.response);
          res.forEach(function(v) {
            file.dataset.path = v.path;
            file.dataset.originalname = v.originalname;
          });
        }
      };
      xhr.send(formData);
    }
  });
});

// 업로드 된 파일 삭제
function fnDeleteFile(id, file_name, input_name, opt) {
  if (!confirm("파일을 삭제하시겠습니까?")) return false;
  let xhr = new XMLHttpRequest();
  xhr.open(
    "DELETE",
    "/admin/data/file/" + id + "/" + file_name + "?input_name=" + input_name
  );
  xhr.onreadystatechange = function() {
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
      let res = JSON.parse(this.response);
      console.log("res : ", res);
      if (res.code !== 0) {
        alert(res.message);
      } else {
        let file_wrap = document.querySelector(
          'div[about="' + file_name + '"]'
        );
        file_wrap.remove();
        if (opt) fnChangeAbleInput();
        document.querySelector(
          'input[name="' + input_name + '"]'
        ).disabled = false;
      }
    }
  };
  xhr.send();
}

// disabled 해제
function fnChangeAbleInput() {
  document
    .querySelectorAll("input[disabled]:not(.form-control-file)")
    .forEach(function(inp) {
      inp.disabled = false;
    });
}

// config update
function fnUpdateConfig() {
  console.log("1");
  let forgot_password = document.querySelector('input[name="forgot_password"]')
    .value;
  let request_report = document.querySelector('input[name="request_report"]')
    .value;
  let request_data = document.querySelector('input[name="request_data"]').value;

  let xhr = new XMLHttpRequest();
  xhr.open("POST", "/admin/config", true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onreadystatechange = function() {
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
      let res = JSON.parse(this.response);
      console.log("res : ", res);
      if (res.code === 1) {
        alert("정상적으로 수정되었습니다.");
      }
    }
  };
  xhr.send(
    JSON.stringify({
      forgot_password: forgot_password,
      request_report: request_report,
      request_data: request_data
    })
  );
}
