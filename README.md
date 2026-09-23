# Ironwood Protocol — Pro Edition

Eredeti, offline taktikai FPS böngészőre.

## Indítás
Az `index.html` modern Chrome / Edge / Firefox alatt közvetlenül megnyitható.
Ha a böngésző biztonsági szabályai miatt a modulbetöltés tiltott, indíts helyi statikus szervert a projekt mappájából:
`python -m http.server 8080`
majd nyisd meg: `http://localhost:8080`

## Fő rendszerek
- 5v5 Attack / Defense
- első személyű kamera
- 4 támadó + 5 védő bot
- állapotgépes taktikai AI
- látóvonal alapú érzékelés
- utolsó ismert pozíció keresése
- patrol / objective / engage / search / retreat
- több fegyver
- recoil-szerű pontatlanság és fejlövés
- részben rombolható falak
- objektív aktiválás / visszafoglalás
- körrendszer, HUD, kill feed, pause
- teljesen saját nevek és elemek
- külső asset és hálózati függőség nélkül

Ez továbbra is egy önálló böngészős játékprojekt, nem AAA-motor; a stabil offline futás és a bővíthető forráskód az elsődleges.
