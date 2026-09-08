# GitHub- und Owlbear-Installation

## 1. Repository anlegen

Lege bei GitHub ein öffentliches Repository mit dem Namen `DSA-NSC-Generator` an. Falls du einen anderen Namen verwendest, müssen die Adressen in `docs/manifest.json` entsprechend geändert werden.

## 2. Dateien hochladen

Lade `README.md`, `GITHUB-UPLOAD-ANLEITUNG.md` und den vollständigen Ordner `docs` in das Repository. Die ZIP-Datei muss vorher entpackt werden.

## 3. GitHub Pages einschalten

1. Öffne im Repository **Settings**.
2. Wähle links **Pages**.
3. Stelle unter **Build and deployment** die Quelle **Deploy from a branch** ein.
4. Wähle den Branch **main** und den Ordner **/docs**.
5. Speichere die Einstellung.

Die Webseite ist anschließend unter dieser Adresse erreichbar:

`https://1sabuto1-bip.github.io/DSA-NSC-Generator/?v=040`

## 4. In Owlbear Rodeo installieren

Füge in Owlbear Rodeo diese Manifest-Adresse als Erweiterung hinzu:

`https://1sabuto1-bip.github.io/DSA-NSC-Generator/manifest.json?v=040`

Der Generator öffnet sich danach über das Symbol **NSC-Namen**. Im Owlbear-Popover wird automatisch die kompakte eingebettete Darstellung verwendet.
