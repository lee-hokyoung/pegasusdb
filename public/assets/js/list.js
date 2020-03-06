$(document).ready(function() {
  // Category 선택시
  $('select[name="category"]').on("change", function(o) {
    console.log("option : ", o.currentTarget);
    let path_obj = location.pathname.split("/");
    let path_len = path_obj.length;
    path_obj[path_len - 1] = o.currentTarget.value;
    let pathname = path_obj.join("/");
    let strQuery = fnGetQuery();
    history.pushState(null, "", pathname + strQuery);
  });
});
const fnSearchDetail = function() {
  let strQuery = fnGetQuery();
  let xhr = new XMLHttpRequest();
  let searchText = $("#searchText").val();
  let uri = "/ajax" + location.pathname + strQuery;
  if (searchText !== "")
    uri = "/ajax" + location.pathname + "/" + searchText + strQuery;
  xhr.open("GET", uri, true);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xhr.onreadystatechange = function() {
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
      history.pushState(null, "", strQuery);
      fnGenerateHtmlResult(JSON.parse(this.response));
    }
  };
  xhr.send();
};
// list 결과 HTML 생성하는 함수
const fnGenerateHtmlResult = function(res) {
  let cate = res.cate,
    cate_item = res.cate_item;
  let list = document.querySelector(".list-group");
  list.innerHTML = "";
  res.list.forEach(function(v) {
    let a = document.createElement("a");
    a.className = "list-group list-group-item-action flex-row my-1 py-2";
    a.href = "/detail/" + cate + "/" + cate_item + "/" + v._id;
    a.setAttribute("style", "min-height:1px;");
    let div = document.createElement("div");
    div.className = "col-2 text-center";
    let img = document.createElement("img");
    img.classList.add("p-1");
    if (v.chart_type) img.src = "/assets/images/" + v.chart_type + "_user.JPG";
    else img.src = "/assets/images/image_data.JPG";
    img.alt = "";
    img.setAttribute("style", "width:70%;");
    div.appendChild(img);
    a.appendChild(div);
    div = document.createElement("div");
    div.className = "col-10 d-flex flex-column justify-content-around";
    let h5 = document.createElement("h5");
    h5.innerText = v.data_title;
    div.appendChild(h5);
    let div_1 = document.createElement("div");
    div_1.className = "py-2 overflow-hidden";
    div_1.id = "info_" + v._id;
    // category array
    let category_arr = [];
    Object.keys(v.category_obj).forEach(function(m) {
      if (v.category_obj[m].length > 0) {
        v.category_obj[m].forEach(function(w) {
          category_arr.push(w[Object.keys(w)]);
        });
      } else {
        if (Object.keys(v.category_obj[m]).length === 1) {
          category_arr.push(v.category_obj[m][Object.keys(v.category_obj[m])]);
        }
      }
    });
    let span = document.createElement("span");
    span.className = "font-weight-bold text-secondary";
    span.innerText = category_arr.join(",");
    div_1.appendChild(span);
    // bar add
    let span_bar = document.createElement("span");
    span_bar.className = "text-secondary";
    span_bar.innerHTML = "&nbsp;&nbsp;|&nbsp;&nbsp;";
    div_1.appendChild(span_bar);
    // region add
    let region = v.region_array.concat(v.city_array);
    span = document.createElement("span");
    span.className = "font-weight-bold text-secondary";
    span.innerText = region.join(",");
    div_1.appendChild(span);
    // bar add
    let span_bar_1 = document.createElement("span");
    span_bar_1.className = "text-secondary";
    span_bar_1.innerHTML = "&nbsp;&nbsp;|&nbsp;&nbsp;";
    div_1.appendChild(span_bar_1);
    // object add
    span = document.createElement("span");
    span.className = "font-weight-bold text-secondary";
    span.innerText = v.object;
    div_1.appendChild(span);
    div.appendChild(div_1);
    a.appendChild(div);
    list.appendChild(a);
    // 길어질 경우, 더보기/접기 버튼 추가
    if (category_arr.length + region.length > 10) {
      div_1.className += " showMore";
      let showMore = document.createElement("a");
      showMore.className = "hidden-wrap text-right";
      showMore.href = "#";
      showMore.setAttribute("data-toggle", "showMore");
      showMore.setAttribute("data-target", "#info_" + v._id);
      showMore.setAttribute("data-expanded", "false");
      list.appendChild(showMore);
    }
  });
};
// 쿼리 스트링 파싱 함수
const fnGetQuery = function() {
  let query = [];
  document.querySelectorAll("select.add_query").forEach(function(s) {
    if (s.selectedIndex > 0) query.push(s.name + "=" + encodeURI(s.value));
  });
  // if (location.search.indexOf("list_size") > -1) {
  // let start = location.search.indexOf("list_size");
  let list_size = parseInt($("#list_size").val());
  query.push("list_size=" + list_size);
  // }
  return "?" + query.join("&");
};
// 긴 문장 토글
$(document).on("click", 'a[data-toggle="showMore"]', function(e) {
  let target_id = e.currentTarget.dataset.target.toString();
  let target = document.querySelector(target_id);
  let toggle = e.currentTarget.dataset.expanded;
  e.currentTarget.dataset.expanded = toggle === "false";
  if (toggle === "false") target.classList.remove("showMore");
  else target.classList.add("showMore");
});
// Search Words
function searchList() {
  let searchText = document.querySelector("#searchText").value;
  let xhr = new XMLHttpRequest();
  xhr.open(
    "GET",
    "/ajax" + location.pathname + "/" + searchText + location.search,
    true
  );
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xhr.onreadystatechange = function() {
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
      fnGenerateHtmlResult(JSON.parse(this.response));
    }
  };
  xhr.send();
}
//  리스트의 수량이 변동될 때
document.querySelector("#list_size").addEventListener("change", function() {
  let strQuery = fnGetQuery();
  let uri = "/ajax" + location.pathname + strQuery;
  console.log("uri : ", uri);
  let xhr = new XMLHttpRequest();
  xhr.open("GET", uri, true);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xhr.onreadystatechange = function() {
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
      history.pushState(null, "", strQuery);
      fnGenerateHtmlResult(JSON.parse(this.response));
    }
  };
  xhr.send();
});
