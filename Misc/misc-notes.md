    1. JSON-----------------

        * Det finns en async Api fetch med JSON response.
        behöver utökas med fler GET requests

        * LocalStorage Använder JSON för Watchlisten!

            OBS! Den behöver debuggas


    2. HTTPS & ASYNC-----------------

        *    ASYNC FUNCTIONS
        * MovieApiFetch är Async med try/catch & Async / Await
            OBS! Behöver utökas med fler anrop.
            OBS! Behöver använda promise.all && || promise.allSettled

            SÅ SOM
            OBS!    [Sort by],

            OBS!    [searchinput].

            OBS!    [Hämta flera pages från api med promise.all]


        *  FELHANTERING
        * FELHANTERING I OLIKA FORMER (på ett användarvänligt sätt.)
            OBS! Nätversfel (NO INTERNET)

            OBS! Ogiltig input (SEARCH FUNC)

            OBS! Oväntade svar (API och dess like.)
                                *API error behöver modifieras med MODAL && || DOM




    3. DATATYPER/OPERATORER-----------------

        * DIFFERENT FUNCTION TO DO-----------------
            OBS! MORE INFO About movie OR ZOOM when movieDOM gets clicked (Modal / Samma Sida)

            OBS! SEARCH BY INPUT // TODO

            OBS! SORT BY/FILTER //TODO

            OBS! DOM MANIPULATION
                    * MOVIE CREATION // DONE
                    * WATCHLIST DOM // IN PROGRESS
                OBS! uppdatera dessa DOM dynamiskt med användarinteraktion


        * EVENT LISTENING-----------------
            OBS! window.addEventListener DOMContentLoaded
                    * kallar på displayWatchlist & MovieAPiFetch
                    * Kan också utökas!

            OBS! spotlightSection.addEventListener click (Save to local storage) // ALMOST done.
                    *Behöver lägga till liten popup när den trycks
                    *Felhantering --> Speciellt att inte kunna lägga till flera exemplar av samma film
                    Kallar på --> localStorageAddition(localMovie)

            //TODO Main section eventlistener för att spara till Watchlist på explore.html

            OBS! watchListContainer.addEventListener (Remove From watchlist) // NEEDS to be tweaked

                    * Behöver kunna ta bort från Local storage, //TODO
                    * Ska ta bort DOM artikeln //TODO
                    Kallar på --> localstorageSubtraction

        * FELHANTERING
            OBS!
            OBS!
            OBS!
            OBS!
        *

    4.UX & UI & WCAG & CSS -----------------

        OBS! FELPREVENTION

        OBS! TYDLIG åertkoppling till user

        * Figma mockup || && wireframe

            OBS! Visa tanke bakom 6 principer i design & layout
            OBS! Länka FigmaLänk i README.md //TODO

        * WCAG aspekter i design som t.ex:

            OBS! ALT-text till bilder
            OBS! Tab-index
            OBS! Färgkontrast

            OBS! SEMANTISK-HTML --> {
                * Heading & Heading Hiearchy
                * footing
                * Main/section/article

                * classes & id
            }

            OBS! Style.CSS --> {

                * Layout
                * Färgkontrast
                * Animering
                * hover
                * Sleek design
                * OSV.
            }

OBS! 6 UX/UI-principerna: ----------------------------------

1. Användarvänlighet
2. Konsekvens och standarder
3. Estetik och minimalistisk design
4. Feedback och kommunikation
5. Felprevention och felmeddelanden
6. Översikt av tillgänglighet enligt WCAG (kort repetition)
