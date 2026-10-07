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


// Booking requests (saved in the visitor's own browser)

const STORAGE_KEY = "tassen-bokningar";

const bokningsform = document.getElementById("bokningsform");
const hundnamnInput = document.getElementById("hundnamn");
const datumInput = document.getElementById("datum");
const formfel = document.getElementById("formfel");
const bokningslista = document.getElementById("bokningar");

// The array is the source of truth. The DOM is only drawn from it.
let bokningar = laddaBokningar();

function laddaBokningar() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  } catch (e) {
    // Blocked storage or broken data: start with an empty list
    return [];
  }
}

function sparaBokningar() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bokningar));
  } catch (e) {
    visaFel("Din webbläsare tillät inte att förfrågan sparas, så den försvinner när du lämnar sidan.");
  }
}

function visaFel(text, falt) {
  formfel.textContent = text;
  hundnamnInput.removeAttribute("aria-invalid");
  datumInput.removeAttribute("aria-invalid");
  if (falt) {
    falt.setAttribute("aria-invalid", "true");
    falt.focus();
  }
}

function rensaFel() {
  visaFel("");
}

function idagSomText() {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return d.getFullYear() + "-" + mm + "-" + dd;
}

function formateraDatum(datum) {
  const d = new Date(datum + "T00:00:00");
  return d.toLocaleDateString("sv-SE", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
}

function ritaBokningar() {
  bokningslista.innerHTML = "";

  if (bokningar.length === 0) {
    const tom = document.createElement("li");
    tom.className = "tom";
    tom.textContent = "Du har inga bokningsförfrågningar än.";
    bokningslista.appendChild(tom);
    return;
  }

  bokningar.forEach(b => {
    const li = document.createElement("li");
    li.className = "bokning";

    const text = document.createElement("span");
    // textContent, so what the visitor types is never treated as HTML
    text.textContent = b.hundnamn + " – " + formateraDatum(b.datum);

    const knapp = document.createElement("button");
    knapp.type = "button";
    knapp.textContent = "Avboka";
    knapp.setAttribute("aria-label", "Avboka " + b.hundnamn + " " + b.datum);
    knapp.addEventListener("click", () => taBortBokning(b.id));

    li.append(text, knapp);
    bokningslista.appendChild(li);
  });
}

function laggTillBokning(hundnamn, datum) {
  bokningar.push({ id: Date.now(), hundnamn: hundnamn, datum: datum });
  sparaBokningar();
  ritaBokningar();
}

function taBortBokning(id) {
  bokningar = bokningar.filter(b => b.id !== id);
  sparaBokningar();
  ritaBokningar();
}

datumInput.min = idagSomText();

bokningsform.addEventListener("submit", event => {
  event.preventDefault();

  const hundnamn = hundnamnInput.value.trim();
  const datum = datumInput.value;

  if (hundnamn === "") {
    visaFel("Fyll i hundens namn.", hundnamnInput);
    return;
  }
  if (datum === "") {
    visaFel("Välj önskat datum.", datumInput);
    return;
  }
  if (datum < idagSomText()) {
    visaFel("Datumet har redan passerat. Välj ett datum från och med idag.", datumInput);
    return;
  }

  rensaFel();
  laggTillBokning(hundnamn, datum);
  bokningsform.reset();
  hundnamnInput.focus();
});

hundnamnInput.addEventListener("input", rensaFel);
datumInput.addEventListener("input", rensaFel);

ritaBokningar();
const omdomen = [
  { text: "Jättemysigt hunddagis med supertrevlig och omtänksam personal! Vår hund trivs så bra och vi känner oss alltid trygga med att lämna henne här 🐶❤️", namn: "Rebecka", betyg: 5 },
  { text: "Trevligt dagis! Min hund viftar alltid på svansen när vi går in varje morgon!😊", namn: "Lisa", betyg: 5 },
  { text: "Vi har lämnat vår hund Loke vid ett flertal tillfällen. Personalen är alltid serviceminded, glada och engagerade. Loke är alltid ivrig när han kommer dit och stortrivs på plats. Vi kan ge de varmaste rekommendationerna.", namn: "Emma", betyg: 5 },
  { text: "This place is excellent. Every time we travel, we leave our dog here and he is thrilled to come. Great staff, great surroundings.", namn: "Anders", betyg: 5 },
  { text: "Finns inget bättre ställe om man behöver pensionat för sin hund!! Enastående!", namn: "Tomas", betyg: 5 }
];

const omdomeRuta = document.getElementById("omdome");
const omdomeKnapp = document.getElementById("nyttOmdome");

let senasteOmdome = -1;

function slumpaOmdome() {
  let index;
  do {
    index = Math.floor(Math.random() * omdomen.length);
  } while (index === senasteOmdome && omdomen.length > 1);
  return index;
}

function visaOmdome() {
  senasteOmdome = slumpaOmdome();
  const o = omdomen[senasteOmdome];

  const stjarnor = document.createElement("div");
  stjarnor.className = "stjarnor";
  stjarnor.setAttribute("role", "img");
  stjarnor.setAttribute("aria-label", "Betyg: " + o.betyg + " av 5");
  stjarnor.textContent = "★".repeat(o.betyg) + "☆".repeat(5 - o.betyg);

  const text = document.createElement("p");
  text.textContent = "”" + o.text + "”";

  const namn = document.createElement("footer");
  namn.textContent = "– " + o.namn;

  omdomeRuta.replaceChildren(stjarnor, text, namn);
}

omdomeKnapp.addEventListener("click", visaOmdome);

visaOmdome();