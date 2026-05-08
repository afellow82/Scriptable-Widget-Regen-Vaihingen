//Widget Regen Vaihingen
//Jens Hamann (j_hamann@gmx.net)
// Optimierungen durch ChatGPT

//Version
const version = "2.00𝛂";
// 08.05.2026

// ToDo / Bugs / Ideen: 
// – Umstellung Speicherstruktur auf Objekt


const wetterdatenArray = [];

const debugLevel = 2;
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
let ergebnis = auswertungDaten(wetterdatenArray);

// hauptStack für Trennung linke und rechte Spalte
let hauptStack = widget.addStack();
hauptStack.layoutHorizontally();

// linksStack für Inhalt auf der linken Seite (Antwort und Antwortsymbol)
let linksStack = hauptStack.addStack();
linksStack.layoutVertically();
linksStack.size = new Size(100,0);
colorStack(linksStack, '#8639FF');

linksStack.addSpacer();

// Ausgabe der Antwort auf der linken Seite
if (ergebnis === "trocken") {
  antworttextAusgeben(linksStack, "Es bleibt",Color.green());
  antworttextAusgeben(linksStack, "trocken.",Color.green());
} else {
  antworttextAusgeben(linksStack, "Es wird",Color.red());
  antworttextAusgeben(linksStack, "regnen.",Color.red());
} 
  
// Ausgabe Antwortsymbol  
let antwortsymbolStack = linksStack.addStack();
antwortsymbolStack.layoutHorizontally();
antwortsymbolStack.addSpacer();

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

//Version einfügen
let versionsStack = linksStack.addStack();
versionsStack.layoutHorizontally();
versionsStack.addSpacer();
let versiontext = versionsStack.addText('[V' + version + "]");
versiontext.font = Font.regularSystemFont(7);;
versiontext.textColor = Color.darkGray();
versionsStack.addSpacer();


// rechtsStack für Inhalte auf der rechten Seite
let rechtsStack = hauptStack.addStack();
rechtsStack.layoutVertically();
colorStack(rechtsStack, '#129951');

// Ort und Datum einfügen
let ortText = rechtsStack.addText('Stuttgart-Vaihingen');
ortText.font=Font.semiboldSystemFont(12);
let heute = new Date();
let stundenaktuell = heute.getHours();
let stundenaktuelltext = stundenaktuell;
if (stundenaktuell < 10) {stundenaktuelltext = '0'+ stundenaktuell;}
let minutenaktuell = heute.getMinutes();
let minutenaktuelltext = minutenaktuell;
if (minutenaktuell < 10) {minutenaktuelltext = '0'+ minutenaktuell;}
let heutetextformat = new DateFormatter();
heutetextformat.dateFormat= 'dd.MM.yyyy';
let heutetext2 = "Stand: " + heutetextformat.string(heute) + ' ' + stundenaktuelltext + ':' + minutenaktuelltext + ' Uhr';
let heutetext3 = rechtsStack.addText(heutetext2);
heutetext3.font = Font.regularSystemFont(12);

// Stack "v6" für Regenwahrscheinlichkeit und Textspalten
let v6Stack = rechtsStack.addStack();
v6Stack.layoutVertically();
v6Stack.addSpacer();
let textzeile1 = v6Stack.addText('Regenwahrscheinlichkeit');
textzeile1.font= Font.italicSystemFont(8);

// Stack "h4" für Textspalten nebeneinander
let h4Stack = v6Stack.addStack();
h4Stack.layoutHorizontally();

// Stack "v4" für erste Textspalte
let v4Stack = h4Stack.addStack();
v4Stack.layoutVertically();
//v4Stack.size = new Size (55,103);
//Test v4Stack.backgroundColor=new Color('888888');

let textzeile2a = v4Stack.addText(wetterdatenArray[1]+':');
textzeile2a.font=Font.regularSystemFont(12);
let textzeile3a = v4Stack.addText(wetterdatenArray[4]+':');
textzeile3a.font=Font.regularSystemFont(12);
let textzeile4a = v4Stack.addText(wetterdatenArray[7]+':');
textzeile4a.font=Font.regularSystemFont(12);
let textzeile5a = v4Stack.addText(wetterdatenArray[10]+':');
textzeile5a.font=Font.regularSystemFont(12);
v4Stack.addSpacer(6);
let sonneSymbol = SFSymbol.named('sun.max');
let sonneSymbolBild = v4Stack.addImage(sonneSymbol.image);
sonneSymbolBild.imageSize = new Size(22, 22);
sonneSymbolBild.tintColor = Color.yellow();

// Stack "v5" für zweite Textspalte
let v5Stack = h4Stack.addStack();
v5Stack.layoutVertically();
//Test v5Stack.backgroundColor=new Color('888888');
v5Stack.setPadding(0, 0, 0, 0)
//v5Stack.size=new Size(40, 98)

// Stack "h5" für erste Textzeile rechtsbündig
let h5Stack = v5Stack.addStack();
h5Stack.layoutHorizontally();
h5Stack.addSpacer();
let textzeile2b = h5Stack.addText(wetterdatenArray[2]+'%');
textzeile2b.font=Font.regularSystemFont(12);
if (wetterdatenArray[2]>= grenzwertRegenwahrscheinlichkeit) {textzeile2b.textColor=Color.red();}
// Stack "h6" für zweite Textzeile rechtsbündig
let h6Stack = v5Stack.addStack();
h6Stack.layoutHorizontally();
h6Stack.addSpacer();
let textzeile3b = h6Stack.addText(wetterdatenArray[5]+'%');
textzeile3b.font=Font.regularSystemFont(12);
if (wetterdatenArray[5]>= grenzwertRegenwahrscheinlichkeit) {textzeile3b.textColor=Color.red();}
// Stack "h7" für dritte Textzeile rechtsbündig
let h7Stack = v5Stack.addStack();
h7Stack.layoutHorizontally();
h7Stack.addSpacer();
let textzeile4b = h7Stack.addText(wetterdatenArray[8]+'%');
textzeile4b.font=Font.regularSystemFont(12);
if (wetterdatenArray[8]>= grenzwertRegenwahrscheinlichkeit) {textzeile4b.textColor=Color.red();}
// Stack "h8" für vierte Textzeile rechtsbündig
let h8Stack = v5Stack.addStack();
h8Stack.layoutHorizontally();
h8Stack.addSpacer();
let textzeile5b = h8Stack.addText(wetterdatenArray[11]+'%');
textzeile5b.font=Font.regularSystemFont(12);
if (wetterdatenArray[11]>= grenzwertRegenwahrscheinlichkeit) {textzeile5b.textColor=Color.red();}
v5Stack.addSpacer(8);
// Stack "h9" für fünfte Textzeile rechtsbündig
let h9Stack = v5Stack.addStack();
h9Stack.layoutHorizontally();
h9Stack.addSpacer();
let sonnenstunden = extrahieresonnenstunden(html);
let textzeile6b = h9Stack.addText(sonnenstunden+' h');
textzeile6b.font=Font.regularSystemFont(12);

h4Stack.addSpacer(3);

// Stack "drittespalte" für dritte Textspalte
//Längster Text bisher: "leichter Regenschauer"
let drittespalteStack = h4Stack.addStack();
drittespalteStack.layoutVertically();
//drittespalteStack.size = new Size(120,75);
//Test drittespalteStack.backgroundColor=new Color('777777');

let textzeile2c =drittespalteStack.addText(wetterdatenArray[3]);
textzeile2c.font=Font.regularSystemFont(10);
drittespalteStack.addSpacer(2);
let textzeile3c =drittespalteStack.addText(wetterdatenArray[6]);
textzeile3c.font=Font.regularSystemFont(10);
drittespalteStack.addSpacer(2);
let textzeile4c =drittespalteStack.addText(wetterdatenArray[9]);
textzeile4c.font=Font.regularSystemFont(10);
drittespalteStack.addSpacer(2);
let textzeile5c =drittespalteStack.addText(wetterdatenArray[12]);
textzeile5c.font=Font.regularSystemFont(10);
//Test widget.addText(wetterdatenArray[12]);


// Widget starten
widget.presentMedium();



// Wetterdaten aus Webseiten-Quelltext holen
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
    //Test array[11] =100;
    
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

function wetterbeschreibungextrahieren(start) {
let start2 = html.indexOf('>', start);
let ende = html.indexOf('</div>', start2);
let teststring = html.substring(start2+1, ende).trim();
// Kürzung wenn Sonderfall <br />
test = teststring.includes("<br />");
//Test widget.addText(test3.toString());
//Test widget.addText(teststring3);
if (test == true) {
    let ende2 = teststring.indexOf('<br />');
    teststring = teststring.substring(0, ende2-1).trim()+'…';
}
//Test console.log(teststring);
return teststring;
}


// Sonnenstunden aus Webseiten-Quelltext holen
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

function auswertungDaten(array) {
	let bewertung='trocken';
	if (array[2] >= grenzwertRegenwahrscheinlichkeit) {bewertung='nass'};
	if (array[5] >= grenzwertRegenwahrscheinlichkeit) {bewertung='nass'};
	if (array[8] >= grenzwertRegenwahrscheinlichkeit) {bewertung='nass'};
	if (array[11] >= grenzwertRegenwahrscheinlichkeit) {bewertung='nass'};
	//bewertung='nass';
	return bewertung;
}

// Funktion zum Einfärben von Stacks
function colorStack(stack, color, level = 2) {
    if (debugLevel >= level) {
        stack.backgroundColor = new Color(color);
    }
}

// Funktion antworttextAusgeben zur Ausgabe der zwei zentrierten Textzeilen
function antworttextAusgeben(stack, text, color) {
    let zentriertstack = stack.addStack();
    zentriertstack.layoutHorizontally();
    zentriertstack.addSpacer();
    const t = zentriertstack.addText(text);
    t.font = Font.boldSystemFont(16);
    t.textColor =  color;
    zentriertstack.addSpacer();
    return t;
}
