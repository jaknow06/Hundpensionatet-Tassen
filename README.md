# Hundpensionatet Tassen

En enkel kundsida för Tassen, ett litet hunddagis och pensionat. Sidan visar om det är öppet just nu, vad tjänsterna kostar och låter besökaren skicka en bokningsförfrågan. Sidan har ingen server, så allt sparas i besökarens egen webbläsare.

## Hur man kör projektet

1. Ladda ner eller klona repot från github
2. Öppna "index.html" direkt i webbläsaren, eller starta med Live Server i VS Code (högerklicka på "index.html" Open with Live Server).

## Filstruktur

```
hundpensionatet-tassen/
├── index.html
├── style.css
├── app.js
├── images/
└── README.md
```

## Vad sidan innehåller

- **Öppet just nu (del 1):** en klocka som uppdateras varje sekund med "setInterval", ett läsbart datum och en status (Öppet/Stängt) som räknas ut från veckodag och timme.
- **Bokningsförfrågan (del 2):** ett formulär med validering. Förfrågningarna sparas i "localStorage" och ritas upp som en lista där man kan avboka.
- **Kundomdömen (del 3, spår A):** fem omdömen som objekt och en knapp som visar ett slumpat omdöme, aldrig samma två gånger i rad.
- **Tjänsterna** ligger som en array av objekt i "app.js" och renderas i DOM, så ett pris kan ändras på ett ställe.

## Reflektion

Svåraste med uppgiften var att skapa bokningssystemet, speciellt att rita nya bokningar var lite klurigt och att få listan att ritas om och ändras när man la till eller tog bort en bokning. När jag var på den delen tittade jag på tidigare kod i genomgångarna och uppgifterna samt MDN för att få till bokningssystemet. Det jag också lärde mig var hur man skapar och hanterar klasser då jag använde mig av en klass för att skapa bokningslistan som sköter lagringen av hur bokningarna sparas i webbläsaren via localStorage

## En bugg jag fastnade på

När jag byggde klockan visade tiden utan nolla framför ensiffriga värden, så klockan 09:30 stod det 9:30 istället för 09:30. Jag hade förväntat mig att getHours(), getMinutes() och getSeconds() skulle ge tvåsiffriga värden, men de returnerar tal, och ett tal har ingen inledande nolla. Jag hittade felet genom att testa i webbläsarens konsol och se vad värdena faktiskt innehöll. Jag löste det genom att göra om talet till en sträng och lägga till en nolla med padStart(2, "0"). Det ligger i funktionen tvaSiffror(), som jag använder för timmar, minuter och sekunder.

## Scope och "this"

I klassen Bokningslista pekar `this` på objektet som skapades med `new Bokningslista(...)`, så alla metoder delar samma `this.bokningar` och `this.nyckel`. I `taBort(id)` använder jag `filter` med arrow-funktionen `b => b.id !== id`, som når parametern `id` från metoden runt omkring. I `ritaBokningar()` skapar jag en avboka-knapp i varje varv av `forEach` med `() => taBortBokning(b.id)`. Varje varv har sin egen `b`, och arrow-funktionen kommer ihåg just den bokningens `b` även efter att loopen är klar. Därför tar knappen bort rätt rad.

## Varför Grid och Flexbox

Jag använder Grid där innehållet ska ligga i ett rutnät. Tjänstekorten ligger i .container med repeat(auto-fill, minmax(300px, 1fr)), och personalkorten i .personal med auto-fit. Då flyttar korten ner på nya rader när skärmen blir smalare, utan särskilda regler för varje bredd. Jag använder Flexbox där innehållet ligger på en rad i en riktning: menyn, varje bokningsrad (text och Avboka-knapp) och footerns kolumner, som med flex-wrap bryter till en kolumn på mobil. På mobil staplas allt i en kolumn.

## Varför forEach och map

Bokningslistan ritas med forEach. För varje bokning skapar jag ett li-element, lägger till en knapp med en händelselyssnare och sätter in det i listan. Det är sidoeffekter, och jag behöver inget nytt värde tillbaka, så forEach passar. Jag skapar elementen med createElement och textContent så att det besökaren skriver in aldrig tolkas som HTML. Tjänsterna renderas med map följt av join(""). Där vill jag omvandla varje objekt till en textsträng med HTML och sätta ihop dem till en enda sträng för innerHTML, och då är map rätt verktyg eftersom den returnerar en ny array. Tjänstetexterna skrivs av mig själv och inte av besökaren, så innerHTML är säkert där.

## State-hantering

Bokningarna ändras bara via lista.laggTill() och lista.taBort(). Båda uppdaterar arrayen och sparar i localStorage. Efter det anropas ritaBokningar(), som ritar om listan från arrayen. DOM:en är alltså aldrig sanningen, utan arrayen är det.

## AI

Jag använde mig främst av ai för att skapa paragraferna och loggan till sidan men även små kodstycken där jag tyckte ai gjorde det mer kompakt än mig. Jag har gått igenom koden och förstår samt kan förklara hur den fungerar.