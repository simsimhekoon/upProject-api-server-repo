const menubars = document.querySelector('.menubars');
const menuicon = document.querySelector('.menuicon');

function toggleMenu() {
  menubars.classList.toggle('active');
  menuicon.classList.toggle('active');
}

menuicon.addEventListener('click', toggleMenu)