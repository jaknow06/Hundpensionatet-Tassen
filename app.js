let prevScrollpos = window.pageYOffset;
const navbar = document.querySelector("nav");

window.onscroll = function () {
    let currentScrollPos = window.pageYOffset;

    if (prevScrollpos > currentScrollPos) {
        navbar.style.top = "0";
    } else {
        navbar.style.top = "-6rem";
    }

    prevScrollpos = currentScrollPos;
};
