//Widget Regen Vaihingen
//Jens Hamann (j_hamann@gmx.net)
// Optimierungen durch ChatGPT

//Version
const version = "2.00𝛃";
// 08.05.2026

// ToDo / Bugs / Ideen: 
// – Idee: Umstellung Speicherstruktur auf Objekt


const wetterdatenArray = [];

const debugLevel = 0;
// 0 - Kein Debuggin
// 1 - Werte loggen
// 2 - Zusätzlich Stacks einfärben

// Definition Grenzwert für Regenwahrscheinlichkeit
let grenzwertRegenwahrscheinlichkeit = 50;

// Definition Farbschema für Symbole und Text
let lightColor = Color.black();
let darkColor = Color.white();
let dynColor = Color.dynamic(lightColor, darkColor);

// Färbung Hintergrund
let hghelloben = new Color('#D8F6CE');
let hghellunten = new Color('#CEECF5');
let hgdunkel = Color.black();
let hgfarbeoben = Color.dynamic(hghelloben, hgdunkel);
let hgfarbeunten = Color.dynamic(hghellunten, hgdunkel);
let g = new LinearGradient();
g.locations = [0,1];
g.colors = [hgfarbeoben, hgfarbeunten];

// HTML-Quelltext der Anzeigenseite abrufen
let url = 'https://www.wetter.com/deutschland/stuttgart/vaihingen/DE0010287103.html';
let req = new Request(url);
let html = await req.loadString();

// Widget initialisieren
let widget = new ListWidget();
widget.setPadding(5, 5, 5, 5);
widget.url = 'https://www.wetter.com/deutschland/stuttgart/vaihingen/DE0010287103.html';
widget.backgroundGradient = g;

// Wetterdaten auswerten
extrahierewetterdaten(html,wetterdatenArray);
let sonnenstunden = extrahieresonnenstunden(html);
let ergebnis = auswertungDaten(wetterdatenArray);

if (debugLevel > 0) {
  for (i = 1; i < wetterdatenArray.length; i++) {
    console.log("wetterdatenArray[" + i + "]: " + wetterdatenArray[i]);
  }
}

// hauptStack für Trennung linke und rechte Spalte
let hauptStack = widget.addStack();
hauptStack.layoutHorizontally();

// linksStack für Inhalt auf der linken Seite (Antwort und Antwortsymbol)
let linksStack = hauptStack.addStack();
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
let antwortsymbolStack = linksStack.addStack();
antwortsymbolStack.layoutHorizontally();
colorStack(antwortsymbolStack, '#FF0054');
//antwortsymbolStack.addSpacer();

let antwortSymbol;
if (ergebnis === "trocken") {
  antwortSymbol = SFSymbol.named('hand.thumbsup');
} else {
  antwortSymbol = SFSymbol.named('umbrella.fill');
} 

antwortsymbolStack.addSpacer();

let antwortSymbolBild = antwortsymbolStack.addImage(antwortSymbol.image);
antwortSymbolBild.imageSize = new Size(70, 70);

if (ergebnis === "trocken") {
  antwortSymbolBild.tintColor = Color.green()
} else {
  antwortSymbolBild.tintColor = Color.red()
} 

antwortsymbolStack.addSpacer();
linksStack.addSpacer();

// Sonne und Sonnenstunden ausgeben
let sonnenStack = linksStack.addStack();
sonnenStack.layoutHorizontally();
sonnenStack.centerAlignContent();
colorStack(sonnenStack, '#841930');

sonnenStack.addSpacer();

let sonneSymbol = SFSymbol.named('sun.max');
let sonneSymbolBild = sonnenStack.addImage(sonneSymbol.image);
sonneSymbolBild.imageSize = new Size(22, 22);
sonneSymbolBild.tintColor = Color.yellow();

sonnenStack.addSpacer();

let sonnenstundentext = sonnenStack.addText(sonnenstunden + " h");
sonnenstundentext.font=Font.regularSystemFont(12);

sonnenStack.addSpacer();


// rechtsStack für Inhalte auf der rechten Seite
let rechtsStack = hauptStack.addStack();
rechtsStack.layoutVertically();
rechtsStack.size = new Size(250,0);
colorStack(rechtsStack, '#129951');

// Ort und Stand einfügen
let ortText = rechtsStack.addText('Stuttgart-Vaihingen');
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
let standtext = rechtsStack.addText("Stand: " + jetzt + ' Uhr');
standtext.font = Font.regularSystemFont(12);

let textzeile1 = rechtsStack.addText('Regenwahrscheinlichkeiten');
textzeile1.font= Font.italicSystemFont(8);

rechtsStack.addSpacer();

let tabelleStack = rechtsStack.addStack();
tabelleStack.layoutHorizontally();

let spalte1Stack = tabelleStack.addStack();
spalte1Stack.layoutVertically();
spalte1ausgeben(spalte1Stack, wetterdatenArray[1]);
spalte1ausgeben(spalte1Stack, wetterdatenArray[4]);
spalte1ausgeben(spalte1Stack, wetterdatenArray[7]);
spalte1ausgeben(spalte1Stack, wetterdatenArray[10]);

let spalte2Stack = tabelleStack.addStack();
spalte2Stack.layoutVertically();
spalte2Stack.size = new Size(45,0);

spalte2ausgeben(spalte2Stack, wetterdatenArray[2]);
spalte2ausgeben(spalte2Stack, wetterdatenArray[5]);
spalte2ausgeben(spalte2Stack, 100);
spalte2ausgeben(spalte2Stack, wetterdatenArray[11]);

tabelleStack.addSpacer(4);

let spalte3Stack = tabelleStack.addStack();
spalte3Stack.layoutVertically();

spalte3ausgeben(spalte3Stack, wetterdatenArray[3]);
spalte3ausgeben(spalte3Stack, wetterdatenArray[6]);
spalte3ausgeben(spalte3Stack, wetterdatenArray[9]);
spalte3ausgeben(spalte3Stack, wetterdatenArray[12]);

rechtsStack.addSpacer();

//Version ausgeben
let versionsStack = rechtsStack.addStack();
versionsStack.layoutHorizontally();
versionsStack.addSpacer();
colorStack(versionsStack, '#636363');
let versiontext = versionsStack.addText('[V' + version + "]");
versiontext.font = Font.regularSystemFont(7);
versiontext.textColor = Color.darkGray();
versionsStack.addSpacer(10);



// Widget starten
widget.presentMedium();


// Funktion Wetterdaten aus Webseiten-Quelltext holen
function extrahierewetterdaten(html,array) {
    let w2Start = html.indexOf('Niederschlagswahrscheinlichkeit und Niederschlagsmenge');
    let w2aStart = html.indexOf('<span class="">', w2Start);
    let w2Ende = html.indexOf('&#8239;', w2aStart);
    array[2] = html.substring(w2aStart+15, w2Ende).trim();
    let w5Start = html.indexOf('Niederschlagswahrscheinlichkeit und Niederschlagsmenge',w2Start+1);
    let w5aStart = html.indexOf('<span class="">', w5Start);
    let w5Ende = html.indexOf('&#8239;', w5aStart);
    array[5] = html.substring(w5aStart+15, w5Ende).trim();
    let w8Start = html.indexOf('Niederschlagswahrscheinlichkeit und Niederschlagsmenge',w5Start+1);
    let w8aStart = html.indexOf('<span class="">', w8Start);
    let w8Ende = html.indexOf('&#8239;', w8aStart);
    array[8] = html.substring(w8aStart+15, w8Ende).trim();
    let w11Start = html.indexOf('Niederschlagswahrscheinlichkeit und Niederschlagsmenge',w8Start+1);
    let w11aStart = html.indexOf('<span class="">', w11Start);
    let w11Ende = html.indexOf('&#8239;', w11aStart);
    array[11] = html.substring(w11aStart+15, w11Ende).trim();
    
    let w1Start = html.indexOf('elta text--center');
    let w1aStart = html.indexOf('text--bold">', w1Start);
    let w1Ende = html.indexOf('</div>', w1aStart);
    array[1] = html.substring(w1aStart+12, w1Ende).trim();
    let w4Start = html.indexOf('elta text--center',w1Start+1);
    let w4aStart = html.indexOf('text--bold">', w4Start);
    let w4Ende = html.indexOf('</div>', w4aStart);
    array[4] = html.substring(w4aStart+12, w4Ende).trim();
    let w7Start = html.indexOf('elta text--center',w4Start+1);
    let w7aStart = html.indexOf('text--bold">', w7Start);
    let w7Ende = html.indexOf('</div>', w7aStart);
    array[7] = html.substring(w7aStart+12, w7Ende).trim();
    let w10Start = html.indexOf('elta text--center',w7Start+1);
    let w10aStart = html.indexOf('text--bold">', w10Start);
    let w10Ende = html.indexOf('</div>', w10aStart);
    array[10] = html.substring(w10aStart+12, w10Ende).trim();

    // Wetterbeschreibung extrahieren
    let w3start = html.indexOf('"weather-short-text palm-text-clamp"');
    let w6start = html.indexOf('"weather-short-text palm-text-clamp"',w3start+1);
    let w9start = html.indexOf('"weather-short-text palm-text-clamp"',w6start+1);
    let w12start = html.indexOf('"weather-short-text palm-text-clamp"',w9start+1);
    array[3] = wetterbeschreibungextrahieren(w3start);
    array[6] = wetterbeschreibungextrahieren(w6start);
    array[9] = wetterbeschreibungextrahieren(w9start);
    array[12] = wetterbeschreibungextrahieren(w12start);
}


// Funktion Wetterbeschreibungen aus Webseiten-Quelltext holen
function wetterbeschreibungextrahieren(start) {
  let start2 = html.indexOf('>', start);
  let ende = html.indexOf('</div>', start2);
  let teststring = html.substring(start2+1, ende).trim();
  // Kürzung wenn Sonderfall <br />
  test = teststring.includes("<br />");

  if (test == true) {
    let ende2 = teststring.indexOf('<br />');
    teststring = teststring.substring(0, ende2-1).trim()+'…';
  }
  if (debugLevel > 0) console.log("[wetterbeschreibungextrahieren] teststring: " + teststring);
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
    let text1start = html.indexOf('Die Sonne ist heute fast nicht zu sehen');
    let text2start = html.indexOf('Heute gibt es bis zu ');
    let text3start = html.indexOf('Heute werden bis zu ');
    let text4start = html.indexOf('Die Sonne zeigt sich nur etwa ');
    let text5start = html.indexOf('Es gibt bis zu ');
    let text6start = html.indexOf('Die Sonne ist fast nicht zu sehen');
    let text7start = html.indexOf('der astronomisch möglichen Sonnenscheindauer');
    let s = '?'
    
    if (text1start != -1){s = 0}
    
    else if (text2start != -1) {
        let sEnde = html.indexOf('Sonnenstunden', text2start);
        s = html.substring(text2start+21, sEnde-1).trim();
    }
    
    else if (text3start != -1) {
        let sEnde = html.indexOf('Sonnenstunden', text3start);
        s = html.substring(text3start+20, sEnde-1).trim();
    }    

    else if (text4start != -1) {
        let sEnde = html.indexOf('Stunde', text4start);
        s = html.substring(text4start+29, sEnde-1).trim();
    }    

    else if (text5start != -1) {
        let sEnde = html.indexOf('Sonnenstunden', text5start);
        s = html.substring(text5start+15, sEnde-1).trim();
    }      
    
    else if (text6start != -1) {
        s = 0;
    }                                
                                                                                                
    else if (text7start != -1) {
        let sEnde = html.indexOf('Stunde', text7start);
        s = html.substring(sEnde-3, sEnde-1).trim();
    }      
    
    return s;
}


// Funktion Auswertung Daten (Ergebnis: trocken oder nass)
function auswertungDaten(array) {
	let bewertung='trocken';
	if (array[2] >= grenzwertRegenwahrscheinlichkeit) {bewertung='nass'};
	if (array[5] >= grenzwertRegenwahrscheinlichkeit) {bewertung='nass'};
	if (array[8] >= grenzwertRegenwahrscheinlichkeit) {bewertung='nass'};
	if (array[11] >= grenzwertRegenwahrscheinlichkeit) {bewertung='nass'};
	return bewertung;
}


// Funktion zum Einfärben von Stacks
function colorStack(stack, color, level = 2) {
    if (debugLevel >= level) {
        stack.backgroundColor = new Color(color);
    }
}


// Funktion antworttextausgeben zur Ausgabe der zwei zentrierten Textzeilen
function antworttextausgeben(stack, text, color) {
    let zentriert = stack.addStack();
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
  let formatieren = stack.addStack();
  formatieren.layoutHorizontally();
  formatieren.size = new Size(0,22);
  formatieren.centerAlignContent();
  colorStack(formatieren, '#AA4695');
  let t = formatieren.addText(text + ':');
  t.font=Font.regularSystemFont(9);
}


// Funktion Ausgabe Spalte 2
function spalte2ausgeben(stack, text) {
  let rechtsbuendig = stack.addStack();
  rechtsbuendig.layoutHorizontally();
  rechtsbuendig.size = new Size(0,22);
  rechtsbuendig.centerAlignContent();
  rechtsbuendig.addSpacer();
  colorStack(rechtsbuendig, '#2496a1');
  let t = rechtsbuendig.addText(text + '%');
  t.font=Font.boldSystemFont(12);
  if (text >= grenzwertRegenwahrscheinlichkeit) {
    t.textColor=Color.red();
  }
}


// Funktion Ausgabe Spalte 3
function spalte3ausgeben(stack, text) {
  let formatieren = stack.addStack();
  formatieren.layoutHorizontally();
  formatieren.size = new Size(0,22);
  formatieren.centerAlignContent();
  colorStack(formatieren, '#68391A');
  let t = formatieren.addText(text);
  t.font=Font.regularSystemFont(9);
}
