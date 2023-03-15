// 비밀번호 확인 체크
const password = document.querySelector('#password');
const passwordRepeat = document.querySelector('#password-repeat');
const textError = document.querySelector('#errorText')
const textTrue = document.querySelector('#trueText')


const test = () => {
  if (password.value !== passwordRepeat.value) {
    textError.style.display = 'block';
    textTrue.style.display = 'none';
  } else {
    textTrue.style.display = 'block';
    textError.style.display = 'none';
  } if (password.value == "") {
    textTrue.style.display = 'none';
    textError.style.display = 'none';
  }
};

passwordRepeat.addEventListener('change', test);
password.addEventListener('change', test);

// 이메일 형식 체크
const email = document.querySelector('#email');

const testEmail = () => {
  let emailtest = /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-Za-z0-9\-]+/;
  if (emailtest.test(email.value) || email.value == "") {
    errorEmail.style.display = 'none';
  } else {
    errorEmail.style.display = 'block';
  }
};

email.addEventListener('change', testEmail);
// 빈칸 유효성 검사

const joinCheck = () => {
  let id = document.querySelector('#username');
  let nickname = document.querySelector('#nickname');

  if (id.value == "") {
    alert("아이디를 입력하세요.");
    id.focus();
    return false;
  } else if (password.value == "") {
    alert("비밀번호를 입력하세요.");
    password.focus();
    return false;
  } else if (passwordRepeat.value == "") {
    alert("비밀번호 확인을 입력하세요.");
    passwordRepeat.focus();
    return false;
  } else if (textError.style.display == 'block') {
    alert("비밀번호 확인이 일치하지 않습니다.");
    passwordRepeat.focus();
    return false;
  } else if (nickname.value == "") {
    alert("닉네임을 입력하세요.");
    nickname.focus();
    return false;
  } else if(email.value == "") {
    alert("이메일를 입력하세요.");
    email.focus();
    return false;
  } else if (errorEmail.style.display == 'block') {
    alert("이메일 형식이 잘못되었습니다.")
    email.focus();
    return false;
  } else {
    document.join.submit();
  }
  

};
// 버튼 전송
const btn = document.querySelector('.btn')
btn.addEventListener('click', joinCheck);
