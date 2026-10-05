// Hide navbar on scroll down and show on scroll up

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

// Display services and prices on the page

const tjanster = [
  {
    namn: "Hunddagis - heldag",
    beskrivning: "En hel dag med lek, motion, vila och omsorg tillsammans med våra andra hundgäster.",
    pris: 320,
    enhet: "kr",
    bild: "images/hunddagis1.jpeg",
    alt: "Hundar som leker på hunddagis"
  },
  {
    namn: "Hunddagis - halvdag",
    beskrivning: "Ett bra alternativ för hundar som behöver tillsyn och aktivering under en del av dagen.",
    pris: 190,
    enhet: "kr",
    bild: "images/hunddagis2.jpeg",
    alt: "Hundar som leker på hunddagis"
  },
  {
    namn: "Hundpensionat",
    beskrivning: "Trygg övernattning med omsorg, rastning och sällskap när du behöver vara bortrest.",
    pris: 450,
    enhet: "kr/natt",
    bild: "images/hundpensionat.jpeg",
    alt: "Hundar som sitter i hunddagis"
  },
  {
    namn: "Hämtning och lämning",
    beskrivning: "Har du en hektisk morgon eller ligger vi inte på din väg? Vi hämtar och lämnar din hund åt dig.",
    pris: 150,
    enhet: "kr",
    bild: "images/hol.jpeg",
    alt: "Hundar som blir avlämnade på hunddagis"
  }
];

const container = document.querySelector(".tjanster .container");

container.innerHTML = tjanster.map(t => `
  <article class="tjanst">
    <img src="${t.bild}" alt="${t.alt}">
    <h3>${t.namn}</h3>
    <p>${t.beskrivning}</p>
    <p>Pris: ${t.pris} ${t.enhet}</p>
  </article>
`).join("");


// Live timer, date and open/closed status

function startTime() {
  const today = new Date();
  let h = today.getHours();
  let m = today.getMinutes();
  let s = today.getSeconds();
  m = checkTime(m);
  s = checkTime(s);
  document.getElementById('liveTime').innerHTML =  h + ":" + m + ":" + s;
  setTimeout(startTime, 1000);

}

function checkTime(i) {
  if (i < 10) {i = "0" + i};
  return i;
}

const hours = {
  0: null,
  1: [7, 18],
  2: [7, 18],
  3: [7, 18],
  4: [7, 18],
  5: [7, 18],
  6: [9, 14]
};

function update() {
  const d = new Date();

  document.getElementById('liveDate').textContent =
    d.toLocaleDateString('sv-SE', { weekday: 'long', day: 'numeric', month: 'long' });

  const today = hours[d.getDay()];
  const hour = d.getHours();
  const open = today !== null && hour >= today[0] && hour < today[1];

  const status = document.getElementById('openStatus');
  status.textContent = open ? 'Öppet just nu' : 'Stängt just nu';
  status.className = open ? 'open' : 'closed';
}

update();         
setInterval(update, 1000);