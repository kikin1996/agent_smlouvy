# Porovnání smluv

Otevři `index.html` v prohlížeči nebo spusť `npm start`. Rozhraní funguje lokálně a soubory neodesílá žádné službě. Pokud jsou přítomné soukromé podklady, obsahuje skutečné texty původních vzorů a aktuálních návrhů; jinak anonymní ukázku. Aktuální verzi vybírá `build.cjs`.

Vlevo vyber smlouvu. Kliknutím na změnu nebo šipkami přejdeš na rozdíl v obou dokumentech. Žlutě jsou změny, zeleně doplnění a červeně odstranění. K dispozici je hledání, zkrácení nezměněného textu a volitelné propojení posouvání. Odkazy otevřou původní dokument a PDF návrhu. Sekce Dokumenty bytu nabízí náhledy připojených PDF a stažení; odkaz `index.html#documents` ji otevře přímo. Náhled PDF vyžaduje podporu PDF v prohlížeči; soubor lze také otevřít samostatně či stáhnout.

Jde o textové porovnání, nikoli o právní hodnocení nebo věrný náhled sazby Wordu. Porovnání ignoruje rozdíly v mezerách a sazbě. Pro kontrolu původního formátování otevři příslušné soubory.

Pokud je připojen souhrn podkladů k bytu, stránka Dokumenty bytu zobrazí přehled nemovitosti, nájemníka a plateb. Úplný souhrn je první položkou seznamu PDF, vedle smluv a dalších podkladů. Rozpory a neověřené informace jsou oddělené od potvrzených údajů. Profil se načítá z lokálního soukromého souboru a není součástí veřejného repozitáře.

Po změně smluv obnov vložené podklady příkazem `node ui/build.cjs`. Výběr verze je v tomto skriptu. `index.html` obsahuje osobní údaje z dokumentů; není určen ke zveřejnění. Zdrojové soubory jsou `template.html`, `style.css`, `app.js` a `build.cjs`.
