$(document).ready(function () {
  // Category 선택시
  $('select[name="category"]').on('change', function (o) {
    console.log('option : ', o.currentTarget);
    let path_obj = location.pathname.split('/');
    let path_len = path_obj.length;
    path_obj[path_len - 1] = o.currentTarget.value;
    let pathname = path_obj.join('/');
    let strQuery = fnGetQuery();
    history.pushState(null, '', pathname + strQuery);

    // let xhr = new XMLHttpRequest();
    // xhr.open('GET', '/ajax' + pathname + strQuery, true);
    // xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    // xhr.onreadystatechange = function () {
    //   if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
    //     console.log('query : ', strQuery);
    //     history.pushState(null, '', pathname + strQuery);
    //     fnGenerateHtmlResult(JSON.parse(this.response));
    //   }
    // };
    // xhr.send();
  });
  // Region, Object 선택시
  // $('select.add_query').on('change', function () {
  //   let path_obj = location.pathname.split('/');
  //   let path_len = path_obj.length;
  //   path_obj[path_len - 1] = o.currentTarget.value;
  //   let pathname = path_obj.join('/');
  //   let strQuery = fnGetQuery();
  //   let xhr = new XMLHttpRequest();
  //   xhr.open('GET', '/ajax' + location.pathname + strQuery, true);
  //   xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  //   xhr.onreadystatechange = function () {
  //     if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
  //       history.pushState(null, '', pathname + strQuery);
  //       fnGenerateHtmlResult(JSON.parse(this.response));
  //     }
  //   };
  //   xhr.send();
  // });
});
const fnSearchDetail = function () {
  let strQuery = fnGetQuery();
  let xhr = new XMLHttpRequest();
  xhr.open('GET', '/ajax' + location.pathname + strQuery, true);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.onreadystatechange = function () {
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
      history.pushState(null, '', strQuery);
      fnGenerateHtmlResult(JSON.parse(this.response));
    }
  };
  xhr.send();
};
// list 결과 HTML 생성하는 함수
const fnGenerateHtmlResult = function (res) {
  console.log(res);
  let cate = res.cate;
  let list = document.querySelector('.list-group');
  list.innerHTML = '';
  res.list.forEach(function (v) {
    let a = document.createElement('a');
    a.classList.add('list-group', 'list-group-item-action', 'flex-row', 'my-1', 'py-2');
    a.href = '/detail/' + cate + '/' + v._id;
    a.style = 'min-height:1px;';
    let div = document.createElement('div');
    div.classList.add('col-2');
    div.classList.add('text-center');
    let img = document.createElement('img');
    img.classList.add('p-1');
    img.src = '/assets/images/' + v.chart_type + '_user.JPG';
    img.alt = '';
    img.setAttribute('style', 'width:70%;');
    div.appendChild(img);
    a.appendChild(div);
    div = document.createElement('div');
    div.classList.add('col-10', 'd-flex', 'flex-column', 'justify-content-around');
    let h5 = document.createElement('h5');
    h5.innerText = v.data_title;
    div.appendChild(h5);
    let div_1 = document.createElement('div');
    div_1.classList.add('py-2', 'overflow-hidden');
    div_1.id = 'info_' + v._id;
    // category array
    let category_arr = [];
    Object.keys(v.category_obj).forEach(function (m) {
      if (v.category_obj[m].length > 0) {
        v.category_obj[m].forEach(function (w) {
          if (w[Object.keys(w)]) category_arr.push(w[Object.keys(w)]);
        });
      }
    });
    let span = document.createElement('span');
    span.classList.add('font-weight-bold', 'text-secondary');
    span.innerText = category_arr.join(',');
    div_1.appendChild(span);
    // bar add
    let span_bar = document.createElement('span');
    span_bar.classList.add('text-secondary');
    span_bar.innerHTML = '&nbsp;&nbsp;|&nbsp;&nbsp;';
    div_1.appendChild(span_bar);
    // region add
    let region = v.region_array.concat(v.city_array);
    span = document.createElement('span');
    span.classList.add('font-weight-bold', 'text-secondary');
    span.innerText = region.join(',');
    div_1.appendChild(span);
    // bar add
    let span_bar_1 = document.createElement('span');
    span_bar_1.classList.add('text-secondary');
    span_bar_1.innerHTML = '&nbsp;&nbsp;|&nbsp;&nbsp;';
    div_1.appendChild(span_bar_1);
    // object add
    span = document.createElement('span');
    span.classList.add('font-weight-bold', 'text-secondary');
    span.innerText = v.object;
    div_1.appendChild(span);
    div.appendChild(div_1);
    a.appendChild(div);
    list.appendChild(a);
// 길어질 경우, 더보기/접기 버튼 추가
    if (category_arr.length + region.length > 10) {
      div_1.classList.add('showMore');
      let showMore = document.createElement('a');
      showMore.classList.add('hidden-wrap', 'text-right');
      showMore.href = '#';
      showMore.dataset.toggle = 'showMore';
      showMore.dataset.target = '#info_' + v._id;
      showMore.dataset.expanded = 'false';
      list.appendChild(showMore);
    }
  });
};
// 쿼리 스트링 파싱 함수
const fnGetQuery = function () {
  let query = [];
  document.querySelectorAll('select.add_query').forEach(function (s) {
    if (s.selectedIndex > 0) query.push(s.name + '=' + s.value);
  });
  return '?' + query.join('&');
};
// 긴 문장 토글
$(document).on('click', 'a[data-toggle="showMore"]', function (e) {
  let target_id = e.currentTarget.dataset.target.toString();
  let target = document.querySelector(target_id);
  let toggle = e.currentTarget.dataset.expanded;
  e.currentTarget.dataset.expanded = (toggle === 'false');
  console.log('e : ', e.currentTarget);
  console.log('target : ', e.currentTarget.dataset.target.toString());
  if (toggle === 'false') target.classList.remove('showMore');
  else target.classList.add('showMore');
});