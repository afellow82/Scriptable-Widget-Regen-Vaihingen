// jshint -W119
// Code source: https://github.com/linusmimietz/Scriptable-Auto-Update

async function main() {
//AB HIER CODE EINFÜGEN  
    
   
    
    
//Widget Regen Vaihingen
//Jens Hamann (j_hamann@gmx.net)

//Version
const version = 1.50;
// 23.02.2024

const wetterdatenArray = [];

// Definition Grenzwert für Regenwahrscheinlichkeit
let gwRW = 50;

//Definition Farbschema für Symbole und Text
let lightColor = Color.black()
let darkColor = Color.white()
let dynColor = Color.dynamic(lightColor, darkColor)

// Farben Hintergrund definieren
let hghelloben = new Color('#D8F6CE');
let hghellunten = new Color('#CEECF5');
let hgdunkel = Color.black();
let hgfarbeoben = Color.dynamic(hghelloben, hgdunkel);
let hgfarbeunten = Color.dynamic(hghellunten, hgdunkel);
let g = new LinearGradient();
g.locations = [0,1];
g.colors = [  
  // Definition Werte durch die Kinder
  //new Color('#D8F6CE'),
  //new Color('#CEECF5')
  hgfarbeoben,
  hgfarbeunten
  ];

// HTML-Quelltext der Anzeigenseite abrufen
let url = 'https://www.wetter.com/deutschland/stuttgart/vaihingen/DE0010287103.html';
let req = new Request(url);
let html = await req.loadString();

// Widget initialisieren
let widget = new ListWidget();
widget.setPadding(10, 5, 5, 5);
widget.url = 'https://www.wetter.com/deutschland/stuttgart/vaihingen/DE0010287103.html';
widget.backgroundGradient = g;

// Wetterdaten auswerten
extrahierewetterdaten(html,wetterdatenArray);
let ergebnis = auswertungDaten(wetterdatenArray);

// Stack "h" für Trennung Antwort und Rest
let hStack = widget.addStack();
hStack.layoutHorizontally();

// Stack "v" für Antwort und Daumen
let vStack = hStack.addStack();
vStack.layoutVertically();
vStack.size = new Size (90,140);
//Test vStack.backgroundColor = new Color('aaaaaa');

vStack.addSpacer();

//Stack "antworttext" zur Zentrierung Antwort
let antworttextStack = vStack.addStack();
antworttextStack.layoutHorizontally();
antworttextStack.addSpacer();
let antwort = 'Fehler';
if (ergebnis=='trocken') {antwort = 'Es bleibt trocken.';}
if (ergebnis=='nass') {antwort = 'Es wird regnen.';}
let antwortText= antworttextStack.addText(antwort);
antwortText.font= Font.boldSystemFont(16);
antwortText.textColor =  dynColor;
if (ergebnis=='trocken') {antwortText.textColor =  Color.green();}
if (ergebnis=='nass') {antwortText.textColor =  Color.red();}
antwortText.centerAlignText();
antworttextStack.addSpacer();
vStack.addSpacer();

//Stack "antwortsymbol" zur Zentrierung Antwort-Symbolbild
let antwortsymbolStack = vStack.addStack();
antwortsymbolStack.layoutHorizontally();
antwortsymbolStack.addSpacer();
let antwortSymbol = SFSymbol.named('sun.max');
if (ergebnis=='trocken') {antwortSymbol = SFSymbol.named('hand.thumbsup');}
if (ergebnis=='nass') {antwortSymbol = SFSymbol.named('umbrella.fill');}
let antwortSymbolBild = antwortsymbolStack.addImage(antwortSymbol.image);
antwortSymbolBild.imageSize = new Size(70, 70);
antwortSymbolBild.tintColor = dynColor;
//Test antwortSymbolBild.borderColor = Color.black();
//Test antwortSymbolBild.borderWidth = 1;
if (ergebnis=='trocken') {antwortSymbolBild.tintColor = Color.green();}
if (ergebnis=='nass') {antwortSymbolBild.tintColor = Color.red();}

//Version einfügen
vStack.addSpacer(3);
let versiontext = vStack.addText('     V'+version);
versiontext.font=Font.thinSystemFont(6);
versiontext.textColor = Color.blue();

antwortsymbolStack.addSpacer();
hStack.addSpacer();

// Stack "v3" für Rest in zwei großen Zeilen
let v3Stack = hStack.addStack();
v3Stack.layoutVertically();
//Test v3Stack.backgroundColor = new Color('aaaaaa');

// Stack "h2" für Ort/Datum und Suchsymbol
let h2Stack = v3Stack.addStack();
h2Stack.layoutHorizontally();

// Stack "v2" für Ort und Datum
let v2Stack = h2Stack.addStack();
v2Stack.layoutVertically();
v2Stack.size = new Size (160,25);

// Ort und Datum einfügen
let ortText = v2Stack.addText('Stuttgart-Vaihingen');
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
let heutetext2 = heutetextformat.string(heute)+ ' ('+stundenaktuelltext+':'+minutenaktuelltext+')';
let heutetext3 = v2Stack.addText(heutetext2);
heutetext3.font = Font.regularSystemFont(12);

// Suchsymbol einfügen
//Stack "suchsymbol" zur Ausrichtung Suchsymbol rechts
let suchsymbolStack = h2Stack.addStack();
suchsymbolStack.layoutHorizontally();
suchsymbolStack.addSpacer();
let sucheSymbol = SFSymbol.named('doc.text.magnifyingglass');
let sucheSymbolBild = h2Stack.addImage(sucheSymbol.image);
sucheSymbolBild.imageSize = new Size(20, 20);
sucheSymbolBild.tintColor = dynColor;

// Stack "v6" für Regenwahrscheinlichkeit und Textspalten
let v6Stack = v3Stack.addStack();
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
v4Stack.size = new Size (55,103);
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
v5Stack.size=new Size(40, 98)

// Stack "h5" für erste Textzeile rechtsbündig
let h5Stack = v5Stack.addStack();
h5Stack.layoutHorizontally();
h5Stack.addSpacer();
let textzeile2b = h5Stack.addText(wetterdatenArray[2]+'%');
textzeile2b.font=Font.regularSystemFont(12);
if (wetterdatenArray[2]>= gwRW) {textzeile2b.textColor=Color.red();}
// Stack "h6" für zweite Textzeile rechtsbündig
let h6Stack = v5Stack.addStack();
h6Stack.layoutHorizontally();
h6Stack.addSpacer();
let textzeile3b = h6Stack.addText(wetterdatenArray[5]+'%');
textzeile3b.font=Font.regularSystemFont(12);
if (wetterdatenArray[5]>= gwRW) {textzeile3b.textColor=Color.red();}
// Stack "h7" für dritte Textzeile rechtsbündig
let h7Stack = v5Stack.addStack();
h7Stack.layoutHorizontally();
h7Stack.addSpacer();
let textzeile4b = h7Stack.addText(wetterdatenArray[8]+'%');
textzeile4b.font=Font.regularSystemFont(12);
if (wetterdatenArray[8]>= gwRW) {textzeile4b.textColor=Color.red();}
// Stack "h8" für vierte Textzeile rechtsbündig
let h8Stack = v5Stack.addStack();
h8Stack.layoutHorizontally();
h8Stack.addSpacer();
let textzeile5b = h8Stack.addText(wetterdatenArray[11]+'%');
textzeile5b.font=Font.regularSystemFont(12);
if (wetterdatenArray[11]>= gwRW) {textzeile5b.textColor=Color.red();}
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
drittespalteStack.size = new Size(120,75);
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
    let w3start = html.indexOf('text--center delta');
    let w6start = html.indexOf('text--center delta',w3start+1);
    let w9start = html.indexOf('text--center delta',w6start+1);
    let w12start = html.indexOf('text--center delta',w9start+1);
    array[3] = wetterbeschreibungextrahieren(w3start);
    array[6] = wetterbeschreibungextrahieren(w6start);
    array[9] = wetterbeschreibungextrahieren(w9start);
    array[12] = wetterbeschreibungextrahieren(w12start);
}

function wetterbeschreibungextrahieren(start) {
let start2 = html.indexOf('>', start);
let ende = html.indexOf('</td>', start2);
let teststring = html.substring(start2+1, ende).trim();
// Kürzung wenn Sonderfall <br />
test = teststring.includes("<br />");
//Test widget.addText(test3.toString());
//Test widget.addText(teststring3);
if (test == true) {
    let ende2 = teststring.indexOf('<br />');
    teststring = teststring.substring(0, ende2-1).trim()+'…';
}
//Test widget.addText(teststring);
return teststring;
}


// Sonnenstunden aus Webseiten-Quelltext holen
// Textvariante 1: Die Sonne ist heute fast nicht zu sehen
// Textvariante 2: Heute gibt es bis zu 6 Sonnenstunden
// Textvariante 3: Heute werden bis zu 7 Sonnenstunden
// Textvariante 4: Die Sonne zeigt sich nur etwa 1 Stunde
// Textvariante 5: Es gibt bis zu 4 Sonnenstunden
// Textvariante 6: Die Sonne ist fast nicht zu sehen
// Textvariante 7: 0 Stunden
function extrahieresonnenstunden(html) {
    let text1start = html.indexOf('Die Sonne ist heute fast nicht zu sehen');
    let text2start = html.indexOf('Heute gibt es bis zu ');
    let text3start = html.indexOf('Heute werden bis zu ');
    let text4start = html.indexOf('Die Sonne zeigt sich nur etwa ');
    let text5start = html.indexOf('Es gibt bis zu ');
    let text6start = html.indexOf('Die Sonne ist fast nicht zu sehen');
    let text7start = html.indexOf('0 Stunden');
    let s = '?'
    
    if (text1start != -1){s = 0}
    
    if (text2start != -1) {
        let sEnde = html.indexOf('Sonnenstunden', text2start);
        s = html.substring(text2start+21, sEnde-1).trim();
    }
    
    if (text3start != -1) {
        let sEnde = html.indexOf('Sonnenstunden', text3start);
        s = html.substring(text3start+20, sEnde-1).trim();
    }    

    if (text4start != -1) {
        let sEnde = html.indexOf('Stunde', text4start);
        s = html.substring(text4start+29, sEnde-1).trim();
    }    

    if (text5start != -1) {
        let sEnde = html.indexOf('Sonnenstunden', text5start);
        s = html.substring(text5start+15, sEnde-1).trim();
    }      
    
    if (text6start != -1) {
        s = 0;
    }                                
                                                                                                
    if (text7start != -1) {
        s = 0;
    }      
    
    return s;
}

function auswertungDaten(array) {
	let bewertung='trocken'
	if (array[2] >= gwRW) {bewertung='nass'};
	if (array[5] >= gwRW) {bewertung='nass'};
	if (array[8] >= gwRW) {bewertung='nass'};
	if (array[11] >= gwRW) {bewertung='nass'};
	// bewertung='trocken';
	return bewertung;
}



 
    


    
    
    
//BIS HIER CODE EINFÜGEN  
}

module.exports = {
  main
};
