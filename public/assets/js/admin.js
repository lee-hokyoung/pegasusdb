// 사용자 등록하기
function fnRegisterUser() {
  let user_no = document.querySelector('input[name="user_no"]');
  let user_corp = document.querySelector('input[name="user_corp"]');
  let manager_name = document.querySelector('input[name="manager_name"]');
  let manager_tel = document.querySelector('input[name="manager_tel"]');
  let email = document.querySelector('input[name="email"]');
  let user_id = document.querySelector('input[name="user_id"]');
  let user_pw = document.querySelector('input[name="user_pw"]');
  if (user_no.value === '') {
    alert('고객번호를 입력해주세요');
    user_no.focus();
    return false;
  }
  if (user_corp.value === '') {
    alert('기업명을 입력해주세요.');
    user_corp.focus();
    return false;
  }
  if (manager_name.value === '') {
    alert('담당자를 입력해주세요.');
    manager_name.focus();
    return false;
  }
  if (manager_tel.value === '') {
    alert('연락처를 입력해주세요');
    manager_tel.focus();
    return false;
  }
  if (email.value === '') {
    alert('이메일을 입력해주세요');
    email.focus();
    return false;
  }
  if (user_id.value === '') {
    alert('아이디를 입력해주세요');
    user_id.focus();
    return false;
  }
  if (user_pw.value === '') {
    alert('비밀번호를 입력해주세요');
    user_pw.focus();
    return false;
  }
  let data = {}, category = [];
  document.querySelectorAll('input[type="text"]').forEach((v) => {
    data[v.name] = v.value;
  });
  document.querySelectorAll('input[type="checkbox"]:checked').forEach((v) => {
    category.push(v.name);
  });
  data['category'] = category;
  // let data = $('form[name="formDataRegister"]').serialize();
  // let category = $('form[name="formCategory"]').serialize();
  let xhr = new XMLHttpRequest();
  xhr.open('POST', '/admin/user/register', true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.onreadystatechange = function () {
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
  let user_id = document.querySelector('input[name="user_id"]');
  // if(!manager_name.value){
  //   alert('담당자명을 입력해주세요.');
  //   manager_name.focus();
  //   return false;
  // }
  let xhr = new XMLHttpRequest();
  xhr.open('POST', '/admin/user/search', true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.onreadystatechange = function () {
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
      let res = JSON.parse(this.response);
      fnGenerateUserList(res);
    }
  };
  xhr.send(JSON.stringify({manager_name:user_id.value}));
}
function fnGenerateUserList(res) {
  console.log('res : ', res);
  let list_wrap = document.querySelector('.user-list-wrap');
  list_wrap.innerHTML = '';
  res.forEach(function(v, idx){
    // li Element
    let li = document.createElement('li');
    li.classList.add('list-group-item');
    if(idx%2===1) li.classList.add('list-group-item-secondary');
    // 로우
    let row = document.createElement('div');
    row.classList.add('row');
    row.classList.add('small');
    // 첫번째 컬럼(고객번호)
    let col1 = document.createElement('div');
    col1.classList.add('col-1');
    col1.innerText = v.user_no;
    // 두번째 컬럼(기업명)
    let col2 = document.createElement('div');
    col2.classList.add('col-1');
    col2.innerText = v.user_corp;
    // 세번째 컬럼(담당자)
    let col3 = document.createElement('div');
    col3.classList.add('col-1');
    col3.innerText = v.manager_name;
    // 네번째 컬럼(연락처)
    let col4 = document.createElement('div');
    col4.classList.add('col-1');
    col4.innerText = v.manager_tel;
    // 다섯번째 컬럼(이메일)
    let col5 = document.createElement('div');
    col5.classList.add('col-1');
    col5.innerText = v.email;
    // 여섯번째 컬럼(아이디)
    let col6 = document.createElement('div');
    col6.classList.add('col', 'text-nowrap');
    col6.innerText = v.user_id;
    // 일곱번째 컬럼(비밀번호)
    let col7 = document.createElement('div');
    col7.classList.add('col', 'text-nowrap');
    col7.innerText = v.user_pw;
    // 여덟번째 컬럼(데이터 구매목록)
    let col8 = document.createElement('div');
    col8.classList.add('col-1');
    console.log(v.cate_info.length);
    for(let i = 0; i < (v.cate_info.length < 4 ? v.cate_info.length : 4); i++){
      col8.append(v.cate_info[i].cate_name);
      col8.appendChild(document.createElement('br'));
    }
    if(v.cate_info.length > 4){
      let collapse = document.createElement('div');
      collapse.classList.add('overflow-hidden', 'collapse');
      collapse.setAttribute('style', 'line-height:1.3em;');
      collapse.id = 'cate_' + v._id;
      for(let i = 3; i < v.cate_info.length; i++){
        collapse.append(v.cate_info[i].cate_name);
        collapse.appendChild(document.createElement('br'));
      }
      col8.appendChild(collapse);
      let readMore = document.createElement('a');
      readMore.href = '#';
      readMore.setAttribute('data-toggle', 'collapse');
      readMore.setAttribute('data-target', '#cate_' + v._id);
      col8.appendChild(readMore);
    }

    // 아홉번째 컬럼(중지/삭제 버튼)
    let col9 = document.createElement('div');
    col9.classList.add('col-1');
    let btn1 = document.createElement('button');
    btn1.classList.add('btn', 'btn-primary', 'btn-sm', 'p-1', 'mb-1');
    btn1.innerText = '제공';
    let btn2 = document.createElement('button');
    btn2.classList.add('btn', 'btn-warning', 'btn-sm', 'p-1', 'mb-1');
    btn2.innerText = '중지';
    let btn3 = document.createElement('button');
    btn3.classList.add('btn', 'btn-danger', 'btn-sm', 'p-1', 'mb-1');
    btn3.innerText = '삭제';
    col9.appendChild(btn1);
    col9.appendChild(btn2);
    col9.appendChild(btn3);
    // 열번째 컬럼(상태)
    let col10 = document.createElement('div');
    col10.classList.add('col-1');
    col10.innerText = v.status === 1 ? '제공':v.status === 2 ? '중지':'삭제';
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
// 데이터 테이블 컬럼 추가
function fnAddCol() {
  document.querySelectorAll('tr').forEach(function (tr) {
    let data_type = tr.dataset.type;
    let current_idx = parseInt(tr.dataset.idx);
    let td = document.createElement('td');
    td.dataset.idx = (current_idx + 1);
    let input = document.createElement('input');
    input.type = 'text';
    input.name = data_type + '_data_' + (current_idx + 1);
    td.appendChild(input);
    tr.appendChild(td);
    tr.dataset.idx = current_idx + 1;
  });
}

// 데이터 테이블 컬럼 제거
function fnRemoveCol() {
  document.querySelectorAll('tr').forEach(function (tr) {
    let target_idx = tr.dataset.idx;
    if (target_idx) {
      tr.querySelector('td[data-idx="' + target_idx + '"]').remove();
      tr.dataset.idx = target_idx - 1;
    }
  });
}

// 데이터 테이블 로우 추가
function fnAddRow() {
  let tbody = document.querySelector('tbody');
  let row_idx = parseInt(tbody.dataset.row);
  tbody.dataset.row = row_idx + 1;

  let col_idx = parseInt(tbody.querySelector('tr').dataset.idx);
  let tr = document.createElement('tr');
  tr.dataset.type = 'y';
  tr.dataset.idx = col_idx;
  tr.dataset.row_idx = row_idx + 1;
  let th = document.createElement('th');
  let input = document.createElement('input');
  input.type = 'text';
  input.name = 'chart_y';
  input.dataset.title = 'true';
  th.appendChild(input);
  tr.appendChild(th);
  let td = document.createElement('td');
  td.classList.add('space_td');
  tr.appendChild(td);
  for (let i = 1; i < col_idx + 1; i++) {
    let td = document.createElement('td');
    td.dataset.idx = i;
    let input = document.createElement('input');
    input.type = 'text';
    input.name = 'y_data_' + i;
    td.appendChild(input);
    tr.appendChild(td);
  }
  tbody.appendChild(tr);
}

// 데이터 테이블 로우 제거
function fnRemoveRow() {
  let tbody = document.querySelector('tbody');
  let tr_idx = parseInt(tbody.dataset.row);
  if (tr_idx === 1) return false;
  let trs = document.querySelectorAll('tbody tr');
  trs[tr_idx - 1].remove();
  tbody.dataset.row = tr_idx - 1;
}

// 제출하기
function fnSubmit() {
  let post_data = fnGenerateFormData();
  // 데이터 등록
  let xhr = new XMLHttpRequest();
  xhr.open('POST', '/admin/data/register', true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.onreadystatechange = function () {
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
      let res = JSON.parse(this.response);
      alert('등록성공');
      location.href = '/admin/data/list';
    }
  };
  xhr.send(JSON.stringify(post_data));
}

// 폼 데이터 생성
function fnGenerateFormData() {
  let data_title = document.querySelector('input[name="data_title"]');
  if (data_title.value === '') fnAlertNFocus(data_title);

  let data_unit = document.querySelector('input[name="data_unit"]');
  if (data_unit.value === '') fnAlertNFocus(data_unit);

  let chart_type = document.querySelector('input[type="radio"]:checked');
  if (chart_type === null) {
    alert('차트타입을 선택해주세요.');
    document.querySelector('input[type="radio"]').focus();
  }

  // x축 데이터 생성
  let table_x = {title: '', content: []};
  document.querySelectorAll('table thead input').forEach(function (v) {
    if (v.dataset.title) table_x.title = v.value;
    else table_x.content.push(v.value);
  });
  // y축 데이터 생성 멀티 라인
  let table_y = [];
  document.querySelectorAll('tbody tr').forEach(function (tr) {
    let tr_obj = {title: '', content: []};
    tr.querySelectorAll('input').forEach(function (v) {
      if (v.dataset.title) tr_obj.title = v.value;
      else tr_obj.content.push(v.value);
    });
    table_y.push(tr_obj);
  });

  // let table_obj = {};
  // document.querySelectorAll('table tr').forEach(function(tr){
  //     let name = tr.querySelector('th input').value;
  //     table_obj[name] = [];
  //     tr.querySelectorAll('td input').forEach(function(input){
  //         if(input.value !== ''){
  //             let td_obj = {};
  //             td_obj[input.name] = input.value;
  //             table_obj[name].push(td_obj);
  //         }
  //     });
  // });
  let data_no = document.querySelector('input[name="data_no"]');
  if (data_no.value === '') fnAlertNFocus(data_no);

  let category_obj = {};
  document.querySelectorAll('div.col-4.mb-3').forEach(function (div) {
    let cate_header = div.querySelector('h5').id;
    console.log('h : ', cate_header);
    category_obj[cate_header] = [];
    div.querySelectorAll('input:checked').forEach(function (input) {
      let obj = {};
      obj[input.id] = input.value;
      category_obj[cate_header].push(obj);
    });
  });
  let region_array = [];
  document.querySelectorAll('#region input:checked').forEach(function (input) {
    // let obj = {};
    // obj[input.id] = input.value;
    // region_array.push(obj);
    region_array.push(input.value);
  });
  let city_array = [];
  document.querySelectorAll('#city input:checked').forEach(function (input) {
    // let obj = {};
    // obj[input.id] = input.value;
    // city_array.push(obj);
    city_array.push(input.value);
  });
  let object = [];
  document.querySelectorAll('input[name="obj"]:checked').forEach(function (input) {
    // object.push(input.value);
    object.push(input.value);
  });
  let description = document.querySelector('textarea[name="description"]');
  let source = document.querySelector('input[name="source"]');

  let post_data = {};
  post_data['data_title'] = data_title.value;
  post_data['data_unit'] = data_unit.value;
  post_data['chart_type'] = chart_type.value;
  post_data['table_x'] = table_x;
  post_data['table_y'] = table_y;
  post_data['data_no'] = data_no.value;
  post_data['category_obj'] = category_obj;
  post_data['region_array'] = region_array;
  post_data['city_array'] = city_array;
  post_data['object'] = object;
  post_data['description'] = description.value;
  post_data['source'] = source.value;
  return post_data;
}

// 알람 띄우기 & 포커싱
function fnAlertNFocus(obj) {
  // alert(obj.title + '값을 입력해주세요.');
  // obj.focus();
}

// 데이터 업데이트
function fnUpdateData(id) {
  console.log('id : ', id);
  let post_data = fnGenerateFormData();
  // 데이터 등록
  let xhr = new XMLHttpRequest();
  xhr.open('PUT', '/admin/data/update/' + id, true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.onreadystatechange = function () {
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
      let res = JSON.parse(this.response);
      if (res.ok === 1) {
        alert('정상적으로 수정되었습니다.');
        location.href = '/admin/data/list';
      }
    }
  };
  xhr.send(JSON.stringify(post_data));
}

// 데이터 삭제
function fnDeleteData(id) {
  if (confirm('정말 삭제시겠습니까?')) {
    let xhr = new XMLHttpRequest();
    xhr.open('DELETE', '/admin/data/' + id);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onreadystatechange = function () {
      if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
        let res = JSON.parse(this.response);
        if (res.ok === 1) {
          let tr = document.querySelector('li[about="' + id + '"]');
          tr.remove();
        }
      }
    };
    xhr.send();
  }
}