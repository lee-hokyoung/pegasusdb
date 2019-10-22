// 사용자 등록하기
function fnRegisterUser() {
    let user_no = document.querySelector('input[name="user_no"]');
    let user_corp = document.querySelector('input[name="user_corp"]');
    let manager_name = document.querySelector('input[name="manager_name"]');
    let manager_tel = document.querySelector('input[name="manager_tel"]');
    let email = document.querySelector('input[name="email"]');
    let user_id = document.querySelector('input[name="user_id"]');
    let user_pw = document.querySelector('input[name="user_pw"]');
    if(user_no.value === ''){
        alert('고객번호를 입력해주세요');
        user_no.focus();
        return false;
    }
    if(user_corp.value === ''){
        alert('기업명을 입력해주세요.');
        user_corp.focus();
        return false;
    }
    if(manager_name.value === ''){
        alert('담당자를 입력해주세요.');
        manager_name.focus();
        return false;
    }
    if(manager_tel.value === ''){
        alert('연락처를 입력해주세요');
        manager_tel.focus();
        return false;
    }
    if(email.value === ''){
        alert('이메일을 입력해주세요');
        email.focus();
        return false;
    }
    if(user_id.value === ''){
        alert('아이디를 입력해주세요');
        user_id.focus();
        return false;
    }
    if(user_pw.value === ''){
        alert('비밀번호를 입력해주세요');
        user_pw.focus();
        return false;
    }

    let data = $('form[name="formDataRegister"]').serialize();
    console.log('data : ', data);
    let xhr = new XMLHttpRequest();
    xhr.open('POST', '/admin/user/register', true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onreadystatechange = function () {
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
            let res = JSON.parse(this.response);
            console.log('res : ', res);
        }
    };
    xhr.send(data);
}