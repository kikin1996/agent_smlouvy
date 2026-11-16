# Porovnání smluv

Otevři `index.html` v prohlížeči. Rozhraní funguje lokálně i bez serveru a bez připojení k internetu. Obsahuje skutečné texty původních vzorů a návrhů v10; soubory neodesílá žádné službě.

Vlevo vyber smlouvu. Kliknutím na změnu nebo šipkami přejdeš na rozdíl v obou dokumentech. Žlutě jsou změny, zeleně doplnění a červeně odstranění. K dispozici je hledání, zkrácení nezměněného textu a volitelné propojení posouvání. Odkazy otevřou původní dokument a PDF návrhu.

Jde o textové porovnání, nikoli o právní hodnocení nebo věrný náhled sazby Wordu. Porovnání ignoruje rozdíly v mezerách a sazbě. Pro kontrolu původního formátování otevři příslušné soubory.

Po změně smluv obnov vložené podklady příkazem `node ui/build.cjs`. Výběr verze je v tomto skriptu. `index.html` obsahuje osobní údaje z dokumentů; není určen ke zveřejnění. Zdrojové soubory jsou `template.html`, `style.css`, `app.js` a `build.cjs`.
