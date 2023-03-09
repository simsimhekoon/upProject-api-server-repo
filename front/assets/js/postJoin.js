function changePage() {
  let currentPage = parseInt(event.currentTarget.innerText);
  location.href = `/post/postJoin/getPostList/${currentPage}`;
}

function firstPage() {
  location.href = "/post/postJoin/getPostList/1";
}

function prevPage() {
  let currentPage = parseInt(document.querySelector(".on").innerText);
  if (currentPage != 1) {
    location.href = `/post/postJoin/getPostList/${currentPage - 1}`;
  }
}

function nextPage(endPage) {
  let currentPage = parseInt(document.querySelector(".on").innerText);
  if (currentPage != Math.floor(endPage)) {
    location.href = `/post/postJoin/getPostList/${currentPage + 1}`;
  }
}

function lastPage(endPage) {
  location.href = `/post/postJoin/getPostList/${Math.floor(endPage)}`;
}
