//Widget Regen Vaihingen
//Jens Hamann (j_hamann@gmx.net)
// Optimierungen durch ChatGPT

//Version
const version = "2.00𝛆";
// 09.05.2026

// ToDo / Bugs / Ideen: 
// - Idee: Evtl. Wettertext nicht abschneiden
// - Funktion Sonnenstunden mit Regex vereinfachen


const wetterdaten = [];

const debugLevel = 1;
// 0 - Kein Debuggin
// 1 - Werte loggen
// 2 - Zusätzlich Stacks einfärben

// Definition Grenzwert für Regenwahrscheinlichkeit
const grenzwertRegenwahrscheinlichkeit = 50;

// Definition Farbschema für Symbole und Text
const lightColor = Color.black();
const darkColor = Color.white();
const dynColor = Color.dynamic(lightColor, darkColor);

// Färbung Hintergrund
const hghelloben = new Color('#D8F6CE');
const hghellunten = new Color('#CEECF5');
const hgdunkel = Color.black();
const hgfarbeoben = Color.dynamic(hghelloben, hgdunkel);
const hgfarbeunten = Color.dynamic(hghellunten, hgdunkel);
const g = new LinearGradient();
g.locations = [0,1];
g.colors = [hgfarbeoben, hgfarbeunten];

// HTML-Quelltext der Anzeigenseite abrufen
const url = 'https://www.wetter.com/deutschland/stuttgart/vaihingen/DE0010287103.html';
const req = new Request(url);
const html = await req.loadString();

// Widget initialisieren
const widget = new ListWidget();
widget.setPadding(5, 5, 5, 5);
widget.url = 'https://www.wetter.com/deutschland/stuttgart/vaihingen/DE0010287103.html';
widget.backgroundGradient = g;

// Wetterdaten auswerten
extrahierewetterdaten(html,wetterdaten);
const sonnenstunden = extrahieresonnenstunden(html);
const ergebnis = auswertungDaten(wetterdaten);

logDivider(1);
for (const eintrag of wetterdaten) {
  console.log(
    `${eintrag.tageszeit} | ${eintrag.regenwahrscheinlichkeit}% | ${eintrag.wetterbeschreibung}`
  );
}

// hauptStack für Trennung linke und rechte Spalte
const hauptStack = widget.addStack();
hauptStack.layoutHorizontally();

// linksStack für Inhalt auf der linken Seite (Antwort und Antwortsymbol)
const linksStack = hauptStack.addStack();
linksStack.layoutVertically();
linksStack.size = new Size(85,0);
colorStack(linksStack, '#8639FF');

linksStack.addSpacer();

// Ausgabe der Antwort auf der linken Seite
if (ergebnis === "trocken") {
  antworttextausgeben(linksStack, "Es bleibt",Color.green());
  antworttextausgeben(linksStack, "trocken.",Color.green());
} else {
  antworttextausgeben(linksStack, "Es wird",Color.red());
  antworttextausgeben(linksStack, "regnen.",Color.red());
} 
  
// Ausgabe Antwortsymbol unter der Antwort auf der linken Seite
const antwortsymbolStack = linksStack.addStack();
antwortsymbolStack.layoutHorizontally();
colorStack(antwortsymbolStack, '#FF0054');

const antwortSymbol =
  ergebnis === "trocken"
    ? SFSymbol.named('hand.thumbsup')
    : SFSymbol.named('umbrella.fill');

antwortsymbolStack.addSpacer();

const antwortSymbolBild = antwortsymbolStack.addImage(antwortSymbol.image);
antwortSymbolBild.imageSize = new Size(70, 70);

if (ergebnis === "trocken") {
  antwortSymbolBild.tintColor = Color.green()
} else {
  antwortSymbolBild.tintColor = Color.red()
} 

antwortsymbolStack.addSpacer();
linksStack.addSpacer();

// Sonne und Sonnenstunden ausgeben
const sonnenStack = linksStack.addStack();
sonnenStack.layoutHorizontally();
sonnenStack.centerAlignContent();
colorStack(sonnenStack, '#841930');

sonnenStack.addSpacer();

const sonneSymbol = SFSymbol.named('sun.max');
const sonneSymbolBild = sonnenStack.addImage(sonneSymbol.image);
sonneSymbolBild.imageSize = new Size(22, 22);
sonneSymbolBild.tintColor = Color.yellow();

if (sonnenstunden > 9) {
  sonnenStack.addSpacer(2);
} else {
  sonnenStack.addSpacer(5);
}

const sonnenstundentext = sonnenStack.addText(sonnenstunden + " Std.");
sonnenstundentext.font=Font.boldSystemFont(12);

sonnenStack.addSpacer();

// rechtsStack für Inhalte auf der rechten Seite
const rechtsStack = hauptStack.addStack();
rechtsStack.layoutVertically();
rechtsStack.size = new Size(250,0);
colorStack(rechtsStack, '#129951');

// Ort und Stand einfügen
const ortText = rechtsStack.addText('Stuttgart-Vaihingen');
ortText.font=Font.semiboldSystemFont(12);

const jetzt = new Date()
  .toLocaleString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  })
  .replace(",","");
const standtext = rechtsStack.addText("Stand: " + jetzt + ' Uhr');
standtext.font = Font.regularSystemFont(12);

const textzeile1 = rechtsStack.addText('Regenwahrscheinlichkeiten');
textzeile1.font= Font.italicSystemFont(8);

rechtsStack.addSpacer();

const tabelleStack = rechtsStack.addStack();
tabelleStack.layoutHorizontally();

const spalte1Stack = tabelleStack.addStack();
spalte1Stack.layoutVertically();

for (const eintrag of wetterdaten) {
  spalte1ausgeben(spalte1Stack, eintrag.tageszeit);
}

const spalte2Stack = tabelleStack.addStack();
spalte2Stack.layoutVertically();
spalte2Stack.size = new Size(45,0);

for (const eintrag of wetterdaten) {
  spalte2ausgeben(spalte2Stack, eintrag.regenwahrscheinlichkeit);
}

tabelleStack.addSpacer(4);

const spalte3Stack = tabelleStack.addStack();
spalte3Stack.layoutVertically();

for (const eintrag of wetterdaten) {
  spalte3ausgeben(spalte3Stack, eintrag.wetterbeschreibung);
}

rechtsStack.addSpacer();

//Version ausgeben
const versionsStack = rechtsStack.addStack();
versionsStack.layoutHorizontally();
versionsStack.addSpacer();
colorStack(versionsStack, '#636363');
const versiontext = versionsStack.addText('[V' + version + "]");
versiontext.font = Font.regularSystemFont(7);
versiontext.textColor = Color.darkGray();
versionsStack.addSpacer(10);



// Widget starten
if (!config.runsInWidget) {
  widget.presentMedium();
}

Script.setWidget(widget);
Script.complete();

// Funktion Wetterdaten aus Webseiten-Quelltext holen
function extrahierewetterdaten(html,array) {
    const w2Start = html.indexOf('Niederschlagswahrscheinlichkeit und Niederschlagsmenge');
    const w2aStart = html.indexOf('<span class="">', w2Start);
    const w2Ende = html.indexOf('&#8239;', w2aStart);
    
    const w5Start = html.indexOf('Niederschlagswahrscheinlichkeit und Niederschlagsmenge',w2Start+1);
    const w5aStart = html.indexOf('<span class="">', w5Start);
    const w5Ende = html.indexOf('&#8239;', w5aStart);
    
    const w8Start = html.indexOf('Niederschlagswahrscheinlichkeit und Niederschlagsmenge',w5Start+1);
    const w8aStart = html.indexOf('<span class="">', w8Start);
    const w8Ende = html.indexOf('&#8239;', w8aStart);
    
    const w11Start = html.indexOf('Niederschlagswahrscheinlichkeit und Niederschlagsmenge',w8Start+1);
    const w11aStart = html.indexOf('<span class="">', w11Start);
    const w11Ende = html.indexOf('&#8239;', w11aStart);
    
    const w1Start = html.indexOf('elta text--center');
    const w1aStart = html.indexOf('text--bold">', w1Start);
    const w1Ende = html.indexOf('</div>', w1aStart);
    
    const w4Start = html.indexOf('elta text--center',w1Start+1);
    const w4aStart = html.indexOf('text--bold">', w4Start);
    const w4Ende = html.indexOf('</div>', w4aStart);

    const w7Start = html.indexOf('elta text--center',w4Start+1);
    const w7aStart = html.indexOf('text--bold">', w7Start);
    const w7Ende = html.indexOf('</div>', w7aStart);

    const w10Start = html.indexOf('elta text--center',w7Start+1);
    const w10aStart = html.indexOf('text--bold">', w10Start);
    const w10Ende = html.indexOf('</div>', w10aStart);

    const w3start = html.indexOf('"weather-short-text palm-text-clamp"');
    const w6start = html.indexOf('"weather-short-text palm-text-clamp"',w3start+1);
    const w9start = html.indexOf('"weather-short-text palm-text-clamp"',w6start+1);
    const w12start = html.indexOf('"weather-short-text palm-text-clamp"',w9start+1);
    
    array.push({
      tageszeit: html.substring(w1aStart+12, w1Ende).trim(),
      regenwahrscheinlichkeit: parseInt(html.substring(w2aStart+15, w2Ende).trim()),
      wetterbeschreibung: wetterbeschreibungextrahieren(html, w3start)
    });
    array.push({
      tageszeit: html.substring(w4aStart+12, w4Ende).trim(),
      regenwahrscheinlichkeit: parseInt(html.substring(w5aStart+15, w5Ende).trim()),
      wetterbeschreibung: wetterbeschreibungextrahieren(html, w6start)
    });
    array.push({
      tageszeit: html.substring(w7aStart+12, w7Ende).trim(),
      regenwahrscheinlichkeit: parseInt(html.substring(w8aStart+15, w8Ende).trim()),
      wetterbeschreibung: wetterbeschreibungextrahieren(html, w9start)
    });
    array.push({
      tageszeit: html.substring(w10aStart+12, w10Ende).trim(),
      regenwahrscheinlichkeit: parseInt(html.substring(w11aStart+15, w11Ende).trim()),
      wetterbeschreibung: wetterbeschreibungextrahieren(html, w12start)
    });
}


// Funktion Wetterbeschreibungen aus Webseiten-Quelltext holen
function wetterbeschreibungextrahieren(html, start) {
  const start2 = html.indexOf('>', start);
  const ende = html.indexOf('</div>', start2);
  const teststring = html.substring(start2+1, ende).trim();
  // Kürzung wenn Sonderfall <br />
  const test = teststring.includes("<br />");

  if (test) {
    const ende2 = teststring.indexOf('<br />');
    teststring = teststring.substring(0, ende2-1).trim()+'…';
  }
  debugLog(1, "[wetterbeschreibungextrahieren] teststring: " + teststring);
  return teststring;
}


// Funktion Sonnenstunden aus Webseiten-Quelltext holen
// Textvariante 1: Die Sonne ist heute fast nicht zu sehen
// Textvariante 2: Heute gibt es bis zu 6 Sonnenstunden
// Textvariante 3: Heute werden bis zu 7 Sonnenstunden
// Textvariante 4: Die Sonne zeigt sich nur etwa 1 Stunde
// Textvariante 5: Es gibt bis zu 4 Sonnenstunden
// Textvariante 6: Die Sonne ist fast nicht zu sehen
// Textvariante 7: 1 Stunde oder X Stunden
function extrahieresonnenstunden(html) {
    const text1start = html.indexOf('Die Sonne ist heute fast nicht zu sehen');
    const text2start = html.indexOf('Heute gibt es bis zu ');
    const text3start = html.indexOf('Heute werden bis zu ');
    const text4start = html.indexOf('Die Sonne zeigt sich nur etwa ');
    const text5start = html.indexOf('Es gibt bis zu ');
    const text6start = html.indexOf('Die Sonne ist fast nicht zu sehen');
    const text7start = html.indexOf('der astronomisch möglichen Sonnenscheindauer');
    let s = '?'
    
    if (text1start != -1){s = 0}
    
    else if (text2start != -1) {
        const sEnde = html.indexOf('Sonnenstunden', text2start);
        s = html.substring(text2start+21, sEnde-1).trim();
    }
    
    else if (text3start != -1) {
        const sEnde = html.indexOf('Sonnenstunden', text3start);
        s = html.substring(text3start+20, sEnde-1).trim();
    }    

    else if (text4start != -1) {
        const sEnde = html.indexOf('Stunde', text4start);
        s = html.substring(text4start+29, sEnde-1).trim();
    }    

    else if (text5start != -1) {
        const sEnde = html.indexOf('Sonnenstunden', text5start);
        s = html.substring(text5start+15, sEnde-1).trim();
    }      
    
    else if (text6start != -1) {
        s = 0;
    }                                
                                                                                                
    else if (text7start != -1) {
        const sEnde = html.indexOf('Stunde', text7start);
        s = html.substring(sEnde-3, sEnde-1).trim();
    }      
    
    return s;
}


// Funktion Auswertung Daten (Ergebnis: trocken oder nass)
function auswertungDaten(wetterdaten) {
  for (const eintrag of wetterdaten) {
    if (eintrag.regenwahrscheinlichkeit >= grenzwertRegenwahrscheinlichkeit) {
      return 'nass';
    }
  }
  return 'trocken';
}


// Funktion zum Einfärben von Stacks
function colorStack(stack, color, level = 2) {
    if (debugLevel >= level) {
        stack.backgroundColor = new Color(color);
    }
}


// Funktion antworttextausgeben zur Ausgabe der zwei zentrierten Textzeilen
function antworttextausgeben(stack, text, color) {
    const zentriert = stack.addStack();
    zentriert.layoutHorizontally();
    zentriert.addSpacer();
    zentriert.size = new Size(0,18);
    colorStack(zentriert, '#113311');
    const t = zentriert.addText(text);
    t.font = Font.boldSystemFont(16);
    t.textColor =  color;
    zentriert.addSpacer();
    return t;
}


// Funktion Ausgabe Spalte 1
function spalte1ausgeben(stack, text) {
  const formatieren = stack.addStack();
  formatieren.layoutHorizontally();
  formatieren.size = new Size(0,22);
  formatieren.centerAlignContent();
  colorStack(formatieren, '#AA4695');
  let t = formatieren.addText(text + ':');
  t.font=Font.regularSystemFont(9);
}


// Funktion Ausgabe Spalte 2
function spalte2ausgeben(stack, text) {
  const rechtsbuendig = stack.addStack();
  rechtsbuendig.layoutHorizontally();
  rechtsbuendig.size = new Size(0,22);
  rechtsbuendig.centerAlignContent();
  rechtsbuendig.addSpacer();
  colorStack(rechtsbuendig, '#2496a1');
  const t = rechtsbuendig.addText(text + '%');
  t.font=Font.boldSystemFont(12);
  if (text >= grenzwertRegenwahrscheinlichkeit) {
    t.textColor=Color.red();
  }
}


// Funktion Ausgabe Spalte 3
function spalte3ausgeben(stack, text) {
  const formatieren = stack.addStack();
  formatieren.layoutHorizontally();
  formatieren.size = new Size(0,22);
  formatieren.centerAlignContent();
  colorStack(formatieren, '#68391A');
  const t = formatieren.addText(text);
  t.font=Font.regularSystemFont(9);
}


// Funktion Linie im Log zeichnen
function logDivider(level) {
  if (debugLevel >= level) console.log("-------------------");
}


// Funktion Log-Eintrag erstellen
function debugLog(level, text) {
  if (debugLevel >= level) console.log(text);
}
