function changePage() {
  let currentPage = parseInt(event.currentTarget.innerText);
  location.href = `/post/post/getPostList/${currentPage}`;
}

function firstPage() {
  location.href = "/post/post/getPostList/1";
}

function prevPage() {
  let currentPage = parseInt(document.querySelector(".on").innerText);
  if (currentPage != 1) {
    location.href = `/post/post/getPostList/${currentPage - 1}`;
  }
}

function nextPage(endPage) {
  let currentPage = parseInt(document.querySelector(".on").innerText);
  if (currentPage != Math.floor(endPage)) {
    if (endPage == Math.floor(endPage)) {
      location.href = `/post/post/getPostList/${currentPage}`;
    } else {
      location.href = `/post/post/getPostList/${currentPage + 1}`;
    }
  }
}

function lastPage(endPage) {
  if (endPage == Math.floor(endPage)) {
    location.href = `/post/post/getPostList/${Math.floor(endPage) - 1}`;
  } else {
    location.href = `/post/post/getPostList/${Math.floor(endPage)}`;
  }
}
