$(document).ready(function () {
  //  loading 페이지 숨김 처리
  let page_out_time = 2500;
  let list_group = document.querySelector(".list-group");
  list_group.style.visibility = "collapse";
  setTimeout(function () {
    document.querySelector("#loading_page").style.display = "none";
    list_group.style.visibility = "visible";
  }, page_out_time);
  //  Category 선택시
  $('select[name="category"]').on("change", function (o) {
    let path_obj = location.pathname.split("/");
    let path_len = path_obj.length;
    path_obj[path_len - 1] = o.currentTarget.value;
    let target = $(this)[0];
    document.querySelector("#cate_info").innerText = target.options[target.selectedIndex].text;
    let pathname = path_obj.join("/");
    let strQuery = fnGetQuery();
    history.pushState(null, "", pathname + strQuery);
  });
});
const fnSearchDetail = function () {
  let strQuery = fnGetQuery();
  let new_url = "";
  if (strQuery.indexOf("page") > -1) {
    let str_arr = strQuery.split("&");
    if (str_arr.length > 1) {
      new_url = str_arr
        .map(function (v) {
          if (v.indexOf("page") > -1) {
            return "page=1";
          }
          return v;
        })
        .join("&");
    }
  }
  location.href = location.pathname + "?" + new_url.replace("?", "");
  // let xhr = new XMLHttpRequest();
  // let searchText = $("#searchText").val();
  // let uri = "/ajax" + location.pathname + strQuery;
  // if (searchText !== "")
  //   uri = "/ajax" + location.pathname + "/" + searchText + strQuery;
  // xhr.open("GET", uri, true);
  // xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  // xhr.onreadystatechange = function () {
  //   if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
  //     history.pushState(null, "", strQuery);
  //     fnGenerateHtmlResult(JSON.parse(this.response));
  //   }
  // };
  // xhr.send();
};
// list 결과 HTML 생성하는 함수
const fnGenerateHtmlResult = function (res) {
  let cate = res.cate,
    cate_item = res.cate_item;
  let list = document.querySelector(".list-group");
  list.innerHTML = "";
  res.list[0].data.forEach(function (v) {
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
    Object.keys(v.category_obj).forEach(function (m) {
      if (v.category_obj[m].length > 0) {
        v.category_obj[m].forEach(function (w) {
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
  let metadata = res.list[0].metadata[0];
  let total = parseInt(metadata.total);
  let page = parseInt(metadata.page);
  let limit = parseInt(metadata.limit);
  let max_page = Math.ceil(total / limit);
  let ul = document.querySelector("ul.pagination");
  ul.innerHTML = "";
  for (var i = 1; i <= max_page; i++) {
    let li = document.createElement("li");
    if (page === i) li.className = "page-item active";
    else li.className = "page-item";
    let button = document.createElement("button");
    button.className = "btn btn-link page-link";
    button.type = "button";
    button.dataset.page = i;
    button.innerHTML = i;
    li.appendChild(button);
    ul.appendChild(li);
  }
};
// 쿼리 스트링 파싱 함수
const fnGetQuery = function () {
  let query = [];
  document.querySelectorAll("select.add_query").forEach(function (s) {
    if (s.selectedIndex > 0) query.push(s.name + "=" + encodeURI(s.value));
  });
  let list_size = parseInt($("#list_size").val());
  query.push("list_size=" + list_size);
  let page_btn = document.querySelector(".page-item.active button");
  if (page_btn) page = page_btn.dataset.page;
  else page = 1;
  query.push("page=" + page);
  return "?" + query.join("&");
};
// 긴 문장 토글
$(document).on("click", 'a[data-toggle="showMore"]', function (e) {
  let target_id = e.currentTarget.dataset.target.toString();
  let target = document.querySelector(target_id);
  let toggle = e.currentTarget.dataset.expanded;
  e.currentTarget.dataset.expanded = toggle === "false";
  if (toggle === "false") target.classList.remove("showMore");
  else target.classList.add("showMore");
  return false;
});
// Search Words
function searchList() {
  let searchText = "searchText=" + document.querySelector("#searchText").value,
    url = "";
  if (location.search.indexOf("?") > -1) {
    url =
      location.pathname +
      "?" +
      location.search
        .split("&")
        .map(function (v) {
          if (v.indexOf("searchText") > -1) {
            return searchText;
          } else if (v.indexOf("page") > -1) {
            return "page=1";
          } else {
            return v;
          }
        })
        .join("&")
        .replace("?", "");
    if (url.indexOf("searchText") === -1) {
      url = url + "&" + searchText;
    }
    console.log("url 1: ", url);
  } else {
    url = location.pathname + "?" + searchText.replace("?", "");
    console.log("url 2: ", url);
  }
  location.href = url;

  // let xhr = new XMLHttpRequest();
  // xhr.open(
  //   "GET",
  //   "/ajax" + location.pathname + "/" + searchText + location.search,
  //   true
  // );
  // xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  // xhr.onreadystatechange = function () {
  //   if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
  //     fnGenerateHtmlResult(JSON.parse(this.response));
  //   }
  // };
  // xhr.send();
}
//  리스트의 수량이 변동될 때
document.querySelector("#list_size").addEventListener("change", function () {
  let strQuery = fnGetQuery();
  // let uri = "/ajax" + location.pathname + strQuery;

  if (strQuery.indexOf("page") > -1) {
    let str_arr = strQuery.split("&");
    if (str_arr.length > 1) {
      new_url = str_arr
        .map(function (v) {
          if (v.indexOf("page") > -1) {
            return "page=1";
          }
          return v;
        })
        .join("&");
    }
  }
  location.href = location.pathname + new_url;

  // console.log("uri : , ", uri);
  // history.pushState(null, "", strQuery);
  // let xhr = new XMLHttpRequest();
  // xhr.open("GET", uri, true);
  // xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  // xhr.onreadystatechange = function () {
  //   if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
  //     fnGenerateHtmlResult(JSON.parse(this.response));
  //   }
  // };
  // xhr.send();
});
//  페이징
$(document).on("click", "button.page-link", function () {
  let search = location.search,
    new_search = "";
  let page_num = this.dataset.page;
  //  기존에 search 가 없을 경우...
  if (search === "") {
    new_search = "?page=" + page_num;
  } else {
    new_search = search
      .split("&")
      .map(function (v) {
        return v.indexOf("page") > -1 ? "page=" + page_num : v;
      })
      .join("&");
    console.log("url : ", new_search);
    if (new_search.indexOf("page") === -1) new_search = new_search + "&page=" + page_num;
    if (
      (new_search.indexOf("page") > -1 && new_search.split("&").length === 1) ||
      new_search.indexOf("?") === -1
    )
      new_search = "?" + new_search;
  }
  location.href = location.pathname + new_search;

  // document.querySelectorAll("li.page-item").forEach(function (v) {
  //   v.className = "page-item";
  // });
  // $(this)[0].parentElement.className = "page-item active";

  // let arr_search = search.split("&");
  // let new_arr = [];
  // let page_num = $(this).data("page");
  // arr_search.forEach(function (v) {
  //   if (v.indexOf("page") > -1) {
  //     new_arr.push("page=" + page_num);
  //   } else {
  //     new_arr.push(v);
  //   }
  // });
  // let new_search = new_arr.join("&");
  // // if (new_search === "" || arr_search.length === 1) new_search = "page=" + page_num;
  // console.log("new search : ", new_search);
  // // console.log("new search : ", location.pathname + new_search);
  // location.href = location.pathname + "?" + new_search.replace("?", "");

  //  ajax
  // let strQuery = fnGetQuery();
  // let uri = "/ajax" + location.pathname + strQuery;
  // history.pushState(null, "", strQuery);
  // let xhr = new XMLHttpRequest();
  // xhr.open("GET", uri, true);
  // xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  // xhr.onreadystatechange = function () {
  //   if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
  //     fnGenerateHtmlResult(JSON.parse(this.response));
  //   }
  // };
  // xhr.send();
});
