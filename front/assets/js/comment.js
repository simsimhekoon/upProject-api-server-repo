function changePage(postId, num) {
  let currentPage = parseInt(event.currentTarget.innerText);
  location.href = `/post/comment/view/${currentPage}?postId=${postId}&num=${num}`;
}

function firstPage(postId, num) {
  location.href = `/post/comment/view/1?postId=${postId}&num=${num}`;
}

function prevPage(postId, num) {
  let currentPage = parseInt(document.querySelector(".on").innerText);
  if (currentPage != 1) {
    location.href = `/post/comment/view/${currentPage - 1}?postId=${postId}&num=${num}`;
  }
}

function nextPage(endPage, postId, num) {
  let currentPage = parseInt(document.querySelector(".on").innerText);
  if (currentPage != Math.floor(endPage)) {
    location.href = `/post/comment/view/${currentPage + 1}?postId=${postId}&num=${num}`;
  }
}

function lastPage(endPage, postId, num) {
  location.href = `/post/comment/view/${Math.floor(endPage)}?postId=${postId}&num=${num}`;
}
