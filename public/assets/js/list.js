// $(document).ready(function () {
//   // Category 선택시
//   $('select[name="category"]').on('change', function(o){
//     console.log('option : ', o.currentTarget);
//     let path_obj = location.pathname.split('/');
//     let path_len = path_obj.length;
//     path_obj[path_len - 1] = o.currentTarget.value;
//     let pathname = path_obj.join('/');
//     let strQuery = fnGetQuery();
//
//     let xhr = new XMLHttpRequest();
//     xhr.open('GET', '/ajax' + pathname + strQuery, true);
//     xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
//     xhr.onreadystatechange = function () {
//       if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
//         console.log('query : ', strQuery);
//         history.pushState(null, '', pathname + strQuery);
//         fnGenerateHtmlResult(JSON.parse(this.response));
//       }
//     };
//     xhr.send();
//   });
//   // Region, Object 선택시
//   $('select.add_query').on('change', function () {
//     let path_obj = location.pathname.split('/');
//     let path_len = path_obj.length;
//     path_obj[path_len - 1] = o.currentTarget.value;
//     let pathname = path_obj.join('/');
//     let strQuery = fnGetQuery();
//     let xhr = new XMLHttpRequest();
//     xhr.open('GET', '/ajax' + location.pathname + strQuery, true);
//     xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
//     xhr.onreadystatechange = function () {
//       if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
//         history.pushState(null, '', pathname + strQuery);
//         fnGenerateHtmlResult(JSON.parse(this.response));
//       }
//     };
//     xhr.send();
//   });
// });
const fnSearchDetail = function (){
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
  res.list.forEach(function(v){
    let a = document.createElement('a');
    a.classList.add('list-group');
    a.classList.add('list-group-item-action');
    a.classList.add('flex-row');
    a.classList.add('my-1');
    a.classList.add('py-2');
    a.href = '/detail/' + cate + '/' + v._id;
    a.style = 'min-height:1px;';
    let div = document.createElement('div');
    div.classList.add('col-2');
    div.classList.add('text-center');
    let img = document.createElement('img');
    img.classList.add('p-1');
    img.src = '/assets/images/' + v.chart_type + '_user.JPG';
    img.alt = '';
    img.style = 'width:70px;';
    div.appendChild(img);
    a.appendChild(div);
    div = document.createElement('div');
    div.classList.add('col-10');
    div.classList.add('d-flex');
    div.classList.add('flex-column');
    div.classList.add('justify-content-around');
    let h5 = document.createElement('h5');
    h5.innerText = v.data_title;
    div.appendChild(h5);
    let div_1 = document.createElement('div');
    div_1.classList.add('py-2');
    // category array
    let category_arr = [];
    Object.keys(v.category_obj).forEach(function(m){
      if(v.category_obj[m].length > 0){
        v.category_obj[m].forEach(function(w){
          if(w[Object.keys(w)]) category_arr.push(w[Object.keys(w)]);
        });
      }
    });
    let span = document.createElement('span');
    span.classList.add('font-weight-bold');
    span.classList.add('text-secondary');
    span.innerText = category_arr.join(',');
    div_1.appendChild(span);
    // bar add
    let span_bar = document.createElement('span');
    span_bar.classList.add('text-secondary');
    span_bar.innerHTML = '&nbsp;&nbsp;|&nbsp;&nbsp;';
    div_1.appendChild(span_bar);
    // region add
    span = document.createElement('span');
    span.classList.add('font-weight-bold');
    span.classList.add('text-secondary');
    span.innerText = v.region_array.concat(v.city_array).join(',');
    div_1.appendChild(span);
    // bar add
    let span_bar_1 = document.createElement('span');
    span_bar_1.classList.add('text-secondary');
    span_bar_1.innerHTML = '&nbsp;&nbsp;|&nbsp;&nbsp;';
    div_1.appendChild(span_bar_1);
    // object add
    span = document.createElement('span');
    span.classList.add('font-weight-bold');
    span.classList.add('text-secondary');
    span.innerText = v.object;
    div_1.appendChild(span);
    div.appendChild(div_1);
    a.appendChild(div);
    list.appendChild(a);
  });
};
// 쿼리 스트링 파싱 함수
const fnGetQuery = function(){
  let query = [];
  document.querySelectorAll('select.add_query').forEach(function (s) {
    if (s.selectedIndex > 0) query.push(s.name + '=' + s.value);
  });
  return '?' + query.join('&');
};