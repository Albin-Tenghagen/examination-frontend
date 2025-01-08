Kod: Lämna in GitHub-länk till läraren i Canvas Modul exmination ->Slutbetyg.

README.md:

- Kortfattad beskrivning av projektet och hur man kör igång det lokalt.
  Detta är en simpel Hemsida som hämtar filmdata från TMDB där du kan se vad som trendar just nu, och också utforska filmer baserat på på olika sorteringar och genrer

Clona repot till din lokala maskin med hjälp av git clone
när du gjort detta ladda ner extensionen live server
när du gjort detta borde du kunna högerklicka index.html filen och trycka på open with live server
Så kommer en flik på din webläsare öppnas automatiskt och då har du kört igång det!

- Länk eller bild till din Figma-skiss.

- Kortfattad förklaring av hur du uppfyllt JSON-, HTTP/HTTPS-, asynkronitets- och UX/UI-kraven.
  Med Api anropen så hämtar jag JSON data, för att sedan om datan hämtades korrekt, översätta till JavaScript och populera olika arrays med film objekt för mig att manipulera och skapa dom element dynamiskt.

Jag använder mig av asynkrona fetch funktioner för att hämta den information jag vill ifrån Api:et. I Api Anropen använder jag try /catch satser för att fånga upp fel. Där jag fetchar HTTPS och beroende på användarinmatning så förändras länken för att hämta olika filmer.  
Funktionerna checkUserPage och "DOMContentLoaded" funktion är osså asynkrona. Det är dem delvis för att se till att all data hämtas och kan generesas innan eventlistenern läggs till, för att förhindra att MoviaContainer = null till exempel
När det dyker upp ett fel på hemsidan så visas en liten bar som heter Snackbar, den ger simpel information om vad som gick fel för användaren som sedan försvinner efter 3 sekunder
När användaren "hovrar" över film bilderna så visar muspekaren en pointer som antyder att dem är klickbara. när dem klickas på så dyker en overlay upp som visar mer info om filmen. som går att stänga med en liten knapp på overlayen.

- Beskriv hur du hämtar data från API:et (Vilket API? URL/enpoint, parametrar, API nyckel?).

Jag använde mig av TMDB Api:et
Där använde jag jag mig av trending/movie endpointen för att få deras trendiga filmer med parametern day. för att denna sektion ska uppdateras dagligen.

I min explore section valde jag att använda mig av discover/movie vilket var deras bredaste endpoint till min förståelse, med väldigt många olika filtreringar.
När sidan laddats färdig så anropas checkUserPage() Där beroende på vilken undersida du är på, så kallas antingen en eller båda ApiFetch funktioner. FÖr att skapa en filtreringsfunktion så tar jag emot användarinmatning igenom ett formulär som har två värden, som är knytna till två olika parametrar. Den ena är deras egna sortering som sorterar utefter variabeln sorting och parametern sort_by=. Om användaren inte anger något så sorteras det efter populärast först
Andra filtrerings funktionen jag har fokuserar mest på deras olika genrer. med hjälp av formuläret tar jag emot ett nummeriskt värde som står för olika genrer, detta använder parametern with_genres= vilket kan sortera ut filmer som innehåller dessa genrer.

- Hur man navigerar/använder applikationen.
  Du använder
  Presentation (ca 8-10 min):

- Visa applikationen i webbläsaren.

- Förklara hur du hämtar och presenterar data från API:et.

- Påvisa var du använt async/await och try/catch.

- Visa din Figma-skiss och förklara hur du tänkt kring UX/UI och WCAG.

- Diskuterar hur Git använts i projektet.

- Om du siktar på VG, visa de extra funktionerna du lagt till.

- Var beredd på frågor.

Mål för dagen:
Förstå de 6 UX/UI-principerna:
Användarvänlighet
Konsekvens och standarder
Estetik och minimalistisk design
Feedback och kommunikation
Felprevention och felmeddelanden
Översikt av tillgänglighet enligt WCAG (kort repetition)
