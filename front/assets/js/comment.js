let commentPageLength = document.querySelectorAll(".num").length;
console.log(commentPageLength);
function changePage(postId, num) {
  if(commentPageLength>4){
    let currentPage = parseInt(event.currentTarget.innerText);
    location.href = `/post/comment/view/${currentPage}?postId=${postId}&num=${num}`;
  }
}

function firstPage(postId, num) {
  if(commentPageLength>4){
    location.href = `/post/comment/view/1?postId=${postId}&num=${num}`;
  }
}

function prevPage(postId, num) {
  if(commentPageLength>4){
    let currentPage = parseInt(document.querySelector(".on").innerText);
    if (currentPage != 1) {
      location.href = `/post/comment/view/${currentPage - 1}?postId=${postId}&num=${num}`;
    }
  }
}

function nextPage(endPage, postId, num) {
  if(commentPageLength>4){
    let currentPage = parseInt(document.querySelector(".on").innerText);
    if (currentPage != Math.floor(endPage)) {
      if (endPage == Math.floor(endPage)) {
        location.href = `/post/comment/view/${currentPage}?postId=${postId}&num=${num}`;
      } else {
        location.href = `/post/comment/view/${currentPage + 1}?postId=${postId}&num=${num}`;
      }
    }
  }
}

function lastPage(endPage, postId, num) {
  if(commentPageLength>4){
    if (endPage == Math.floor(endPage)) {
      location.href = `/post/comment/view/${Math.floor(endPage) - 1}?postId=${postId}&num=${num}`;
    } else {
      location.href = `/post/comment/view/${Math.floor(endPage)}?postId=${postId}&num=${num}`;
    }
  }
}
