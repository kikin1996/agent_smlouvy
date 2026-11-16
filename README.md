# Agent pro realitní smlouvy

## Spuštění porovnávacího rozhraní

Vyžaduje Node.js 18 nebo novější. Projekt nemá externí závislosti.

```sh
npm start
```

Otevři http://127.0.0.1:8765/ui/index.html. Rozhraní porovnává vzor a návrh, barevně označuje změny a nabízí hledání a přechod mezi rozdíly. Bez soukromých podkladů zobrazí anonymní ukázková data. Soukromé smlouvy, osobní údaje, PDF a vygenerovaný `ui/index.html` se do Gitu neukládají. Skutečné dokumenty se načítají jen z lokálních složek, pokud jsou přítomné; jejich cesty určuje `ui/build.cjs`.

Ověření syntaxe: `npm run check`. Podrobnosti jsou v [ui/README.md](ui/README.md).

Pravidla agenta jsou v [AGENTS.md](AGENTS.md). Při práci v tomto projektu se jimi Codex řídí. Agent komunikuje česky a zaměřuje se na české realitní dokumenty: rezervace, nájmy, podnájmy, koupě, budoucí smlouvy, zprostředkování a dodatky.

## Jak začít

Vlož smlouvu nebo související dokumenty do `podklady/`, případně připoj dokument k zadání. Napiš, co potřebuješ a koho zastupuješ. Pro první návrh můžeš použít anonymizované údaje.

Příklady zadání:

- „Analyzuj smlouvu v podkladech z pohledu kupujícího. U každého rizika navrhni konkrétní úpravu.“
- „Uprav nájemní smlouvu z pohledu pronajímatele. Nájemné ponech stejné, změny vysvětli v samostatném souboru.“
- „Připrav návrh rezervační smlouvy na byt. Jsem kupující a budu financovat hypotékou. Neznámé údaje označ k doplnění.“
- „Porovnej obě verze kupní smlouvy a vypiš věcné změny a jejich dopad.“
- „Připrav dodatek k nájemní smlouvě, kterým se od 1. ledna prodlouží nájem o rok. Ostatní podmínky zachovej.“

## Výstupy

- `navrhy/`: návrhy smluv a upravená znění ve verzích.
- `analyzy/`: rozbory, připomínky, přehledy změn a otázky k doplnění.
- `zdroje/`: záznamy použitých právních zdrojů a data ověření.

Výchozím výstupem je Markdown. Práce s PDF či Wordem závisí na dostupných nástrojích a čitelnosti souboru. Právní závěry se ověřují až pro konkrétní zadání a jeho rozhodné datum; samotné nastavení projektu není právním ověřením smlouvy.

Toto je agent pro práci v Codexu v tomto projektu. Není to samostatná aplikace ani služba běžící na pozadí. Dokumenty se nepodepisují ani neodesílají automaticky.
