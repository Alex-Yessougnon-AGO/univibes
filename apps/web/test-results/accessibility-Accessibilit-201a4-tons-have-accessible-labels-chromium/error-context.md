# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: accessibility.spec.ts >> Accessibility - WCAG 2.1 AA >> buttons-have-accessible-labels
- Location: tests/accessibility.spec.ts:29:7

# Error details

```
Error: expect(received).toHaveLength(expected)

Expected length: 0
Received length: 1
Received array:  ["button #0"]
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e6] [cursor=pointer]:
    - button "Open Next.js Dev Tools" [ref=e7]:
      - img [ref=e8]
    - generic [ref=e11]:
      - button "Open issues overlay" [ref=e12]:
        - generic [ref=e13]:
          - generic [ref=e14]: "8"
          - generic [ref=e15]: "9"
        - generic [ref=e16]:
          - text: Issue
          - generic [ref=e17]: s
      - button "Collapse issues badge" [ref=e18]:
        - img [ref=e19]
  - banner [ref=e21]:
    - navigation [ref=e22]:
      - link "UV Univibes" [ref=e23] [cursor=pointer]:
        - /url: /
        - generic [ref=e25]: UV
        - generic [ref=e26]: Univibes
      - generic [ref=e27]:
        - link "Accueil" [ref=e28] [cursor=pointer]:
          - /url: /
        - link "Explorer" [ref=e29] [cursor=pointer]:
          - /url: /explore
      - generic [ref=e30]:
        - link "Rechercher… ⌘K" [ref=e31] [cursor=pointer]:
          - /url: /explore
          - img [ref=e32]
          - generic [ref=e35]: Rechercher…
          - generic [ref=e36]: ⌘K
        - button "Changer de thème" [ref=e37]:
          - img [ref=e38]
        - link "Connexion" [ref=e40] [cursor=pointer]:
          - /url: /login
          - generic [ref=e41]: Connexion
  - main [ref=e43]:
    - generic [ref=e46]:
      - generic [ref=e47]:
        - img [ref=e48]
        - generic [ref=e50]: Le hub de la vie étudiante
      - heading "Découvre tout ce qui se passe sur ton campus" [level=1] [ref=e51]:
        - text: Découvre tout ce qui se passe
        - text: sur ton campus
      - paragraph [ref=e52]: Soirées, conférences, hackathons, galas — trouve et réserve les meilleurs événements étudiants près de chez toi.
      - generic [ref=e55]:
        - generic [ref=e56]:
          - img [ref=e57]
          - combobox [ref=e60] [cursor=pointer]:
            - option "Toutes les villes" [selected]
            - option "Cotonou"
            - option "Abomey-Calavi"
            - option "Porto-Novo"
            - option "Parakou"
            - option "Lomé"
            - option "Dakar"
            - option "Abidjan"
            - option "Ouagadougou"
            - option "Bamako"
            - option "Niamey"
            - option "Yaoundé"
            - option "Douala"
        - img [ref=e61]
        - textbox "Rechercher un événement, un organisateur..." [ref=e64]
        - button "Rechercher" [ref=e66] [cursor=pointer]
      - generic [ref=e67]:
        - link "Explorer les événements" [ref=e68] [cursor=pointer]:
          - /url: /explore
          - text: Explorer les événements
          - img [ref=e69]
        - link "Créer un compte" [ref=e71] [cursor=pointer]:
          - /url: /register
      - generic [ref=e72]:
        - generic [ref=e78]: 2 400+étudiants inscrits
        - generic [ref=e79]: 150+événements
    - generic [ref=e81]:
      - generic [ref=e82]:
        - generic [ref=e83]:
          - generic [ref=e84]: Catégories
          - heading "Parcourir par catégorie" [level=2] [ref=e85]
        - link "Voir tout" [ref=e86] [cursor=pointer]:
          - /url: /explore
          - text: Voir tout
          - img [ref=e87]
      - generic [ref=e89]:
        - link "🎵 Musique" [ref=e90] [cursor=pointer]:
          - /url: /explore?category=musique
          - generic [ref=e92]: 🎵
          - generic [ref=e93]: Musique
        - link "🎤 Conférences" [ref=e94] [cursor=pointer]:
          - /url: /explore?category=conferences
          - generic [ref=e96]: 🎤
          - generic [ref=e97]: Conférences
        - link "✨ Galas" [ref=e98] [cursor=pointer]:
          - /url: /explore?category=galas
          - generic [ref=e100]: ✨
          - generic [ref=e101]: Galas
        - link "💻 Hackathons" [ref=e102] [cursor=pointer]:
          - /url: /explore?category=hackathons
          - generic [ref=e104]: 💻
          - generic [ref=e105]: Hackathons
        - link "⚽ Sports" [ref=e106] [cursor=pointer]:
          - /url: /explore?category=sports
          - generic [ref=e108]: ⚽
          - generic [ref=e109]: Sports
        - link "🎨 Culture" [ref=e110] [cursor=pointer]:
          - /url: /explore?category=culture
          - generic [ref=e112]: 🎨
          - generic [ref=e113]: Culture
        - link "🤝 Networking" [ref=e114] [cursor=pointer]:
          - /url: /explore?category=networking
          - generic [ref=e116]: 🤝
          - generic [ref=e117]: Networking
        - link "🥂 Afterwork" [ref=e118] [cursor=pointer]:
          - /url: /explore?category=afterwork
          - generic [ref=e120]: 🥂
          - generic [ref=e121]: Afterwork
    - generic [ref=e123]:
      - generic [ref=e124]:
        - generic [ref=e125]:
          - generic [ref=e126]:
            - img [ref=e127]
            - generic [ref=e129]: À la une
          - heading "Événements populaires" [level=2] [ref=e130]
          - paragraph [ref=e131]: Les événements les plus en vue du moment
        - generic [ref=e132]:
          - button "Défiler vers la gauche" [ref=e133]:
            - img [ref=e134]
          - button "Défiler vers la droite" [ref=e136]:
            - img [ref=e137]
      - generic [ref=e139]:
        - link "Gala de Fin d'Année FASEG 2025 Ajouter aux favoris ✨ Galas Gala de Fin d'Année FASEG 2025 19 juil. Cotonou dès 5 000 FCFA" [ref=e141] [cursor=pointer]:
          - /url: /event/gala-fin-annee-faseg-2025
          - img "Gala de Fin d'Année FASEG 2025" [ref=e142]
          - button "Ajouter aux favoris" [ref=e144]:
            - img [ref=e145]
          - generic [ref=e147]:
            - generic [ref=e148]:
              - generic [ref=e149]: ✨
              - text: Galas
            - heading "Gala de Fin d'Année FASEG 2025" [level=3] [ref=e150]
            - generic [ref=e151]:
              - generic [ref=e152]:
                - generic [ref=e153]:
                  - img [ref=e154]
                  - text: 19 juil.
                - generic [ref=e156]:
                  - img [ref=e157]
                  - text: Cotonou
              - generic [ref=e160]: dès 5 000 FCFA
        - link "HackBénin — 48h Innovation Numérique Retirer des favoris 💻 Hackathons HackBénin — 48h Innovation Numérique 25 juil. Abomey-Calavi Gratuit" [ref=e162] [cursor=pointer]:
          - /url: /event/hackbenin-48h-innovation-numerique
          - img "HackBénin — 48h Innovation Numérique" [ref=e163]
          - button "Retirer des favoris" [ref=e165]:
            - img [ref=e166]
          - generic [ref=e168]:
            - generic [ref=e169]:
              - generic [ref=e170]: 💻
              - text: Hackathons
            - heading "HackBénin — 48h Innovation Numérique" [level=3] [ref=e171]
            - generic [ref=e172]:
              - generic [ref=e173]:
                - generic [ref=e174]:
                  - img [ref=e175]
                  - text: 25 juil.
                - generic [ref=e177]:
                  - img [ref=e178]
                  - text: Abomey-Calavi
              - generic [ref=e181]: Gratuit
        - 'link "Conférence : L''Entrepreneuriat Étudiant en Afrique Ajouter aux favoris 🎤 Conférences Conférence : L''Entrepreneuriat Étudiant en Afrique 12 juil. Abomey-Calavi dès 2 000 FCFA" [ref=e183] [cursor=pointer]':
          - /url: /event/conference-entrepreneuriat-etudiant-afrique
          - 'img "Conférence : L''Entrepreneuriat Étudiant en Afrique" [ref=e184]'
          - button "Ajouter aux favoris" [ref=e186]:
            - img [ref=e187]
          - generic [ref=e189]:
            - generic [ref=e190]:
              - generic [ref=e191]: 🎤
              - text: Conférences
            - 'heading "Conférence : L''Entrepreneuriat Étudiant en Afrique" [level=3] [ref=e192]'
            - generic [ref=e193]:
              - generic [ref=e194]:
                - generic [ref=e195]:
                  - img [ref=e196]
                  - text: 12 juil.
                - generic [ref=e198]:
                  - img [ref=e199]
                  - text: Abomey-Calavi
              - generic [ref=e202]: dès 2 000 FCFA
        - link "AfroBeats Night — Open Mic & DJ Set Ajouter aux favoris 🎵 Musique AfroBeats Night — Open Mic & DJ Set 2 août Cotonou dès 3 000 FCFA" [ref=e204] [cursor=pointer]:
          - /url: /event/afrobeats-night-open-mic-dj-set
          - img "AfroBeats Night — Open Mic & DJ Set" [ref=e205]
          - button "Ajouter aux favoris" [ref=e207]:
            - img [ref=e208]
          - generic [ref=e210]:
            - generic [ref=e211]:
              - generic [ref=e212]: 🎵
              - text: Musique
            - heading "AfroBeats Night — Open Mic & DJ Set" [level=3] [ref=e213]
            - generic [ref=e214]:
              - generic [ref=e215]:
                - generic [ref=e216]:
                  - img [ref=e217]
                  - text: 2 août
                - generic [ref=e219]:
                  - img [ref=e220]
                  - text: Cotonou
              - generic [ref=e223]: dès 3 000 FCFA
        - link "Speed Networking Étudiants — Promo 2025 Retirer des favoris 🤝 Networking Speed Networking Étudiants — Promo 2025 15 août Cotonou dès 1 500 FCFA" [ref=e225] [cursor=pointer]:
          - /url: /event/speed-networking-etudiants-promo-2025
          - img "Speed Networking Étudiants — Promo 2025" [ref=e226]
          - button "Retirer des favoris" [ref=e228]:
            - img [ref=e229]
          - generic [ref=e231]:
            - generic [ref=e232]:
              - generic [ref=e233]: 🤝
              - text: Networking
            - heading "Speed Networking Étudiants — Promo 2025" [level=3] [ref=e234]
            - generic [ref=e235]:
              - generic [ref=e236]:
                - generic [ref=e237]:
                  - img [ref=e238]
                  - text: 15 août
                - generic [ref=e240]:
                  - img [ref=e241]
                  - text: Cotonou
              - generic [ref=e244]: dès 1 500 FCFA
    - generic [ref=e246]:
      - generic [ref=e247]:
        - generic [ref=e248]:
          - generic [ref=e249]:
            - img [ref=e250]
            - generic [ref=e252]: À venir
          - heading "Événements à venir" [level=2] [ref=e253]
          - paragraph [ref=e254]: Ne rate pas les prochains rendez-vous
        - link "Voir tout" [ref=e255] [cursor=pointer]:
          - /url: /explore
          - text: Voir tout
          - img [ref=e256]
      - generic [ref=e258]:
        - link "Gala de Fin d'Année FASEG 2025 ✨ Galas Ajouter aux favoris Gala de Fin d'Année FASEG 2025 19 juil. à 20h00 Palais des Congrès de Cotonou, Cotonou BDE FASEG BDE FASEG 5 000 FCFA" [ref=e260] [cursor=pointer]:
          - /url: /event/gala-fin-annee-faseg-2025
          - generic [ref=e261]:
            - img "Gala de Fin d'Année FASEG 2025" [ref=e262]
            - generic [ref=e264]:
              - generic [ref=e265]: ✨
              - text: Galas
            - button "Ajouter aux favoris" [ref=e266]:
              - img [ref=e267]
          - generic [ref=e269]:
            - heading "Gala de Fin d'Année FASEG 2025" [level=3] [ref=e270]
            - generic [ref=e271]:
              - paragraph [ref=e272]:
                - img [ref=e273]
                - text: 19 juil. à 20h00
              - paragraph [ref=e275]:
                - img [ref=e276]
                - generic [ref=e279]: Palais des Congrès de Cotonou, Cotonou
            - generic [ref=e280]:
              - generic [ref=e281]:
                - img "BDE FASEG" [ref=e283]
                - generic [ref=e284]: BDE FASEG
              - generic [ref=e285]: 5 000 FCFA
        - link "HackBénin — 48h Innovation Numérique 💻 Hackathons Retirer des favoris HackBénin — 48h Innovation Numérique 25 juil. à 08h00 EPAC — Campus d'Abomey-Calavi, Abomey-Calavi TECH HUB UAC TECH HUB UAC Gratuit" [ref=e287] [cursor=pointer]:
          - /url: /event/hackbenin-48h-innovation-numerique
          - generic [ref=e288]:
            - img "HackBénin — 48h Innovation Numérique" [ref=e289]
            - generic [ref=e291]:
              - generic [ref=e292]: 💻
              - text: Hackathons
            - button "Retirer des favoris" [ref=e293]:
              - img [ref=e294]
          - generic [ref=e296]:
            - heading "HackBénin — 48h Innovation Numérique" [level=3] [ref=e297]
            - generic [ref=e298]:
              - paragraph [ref=e299]:
                - img [ref=e300]
                - text: 25 juil. à 08h00
              - paragraph [ref=e302]:
                - img [ref=e303]
                - generic [ref=e306]: EPAC — Campus d'Abomey-Calavi, Abomey-Calavi
            - generic [ref=e307]:
              - generic [ref=e308]:
                - img "TECH HUB UAC" [ref=e310]
                - generic [ref=e311]: TECH HUB UAC
              - generic [ref=e312]: Gratuit
        - 'link "Conférence : L''Entrepreneuriat Étudiant en Afrique 🎤 Conférences Ajouter aux favoris Conférence : L''Entrepreneuriat Étudiant en Afrique 12 juil. à 09h00 Amphithéâtre 500 — UAC, Abomey-Calavi TECH HUB UAC TECH HUB UAC 2 000 FCFA" [ref=e314] [cursor=pointer]':
          - /url: /event/conference-entrepreneuriat-etudiant-afrique
          - generic [ref=e315]:
            - 'img "Conférence : L''Entrepreneuriat Étudiant en Afrique" [ref=e316]'
            - generic [ref=e318]:
              - generic [ref=e319]: 🎤
              - text: Conférences
            - button "Ajouter aux favoris" [ref=e320]:
              - img [ref=e321]
          - generic [ref=e323]:
            - 'heading "Conférence : L''Entrepreneuriat Étudiant en Afrique" [level=3] [ref=e324]'
            - generic [ref=e325]:
              - paragraph [ref=e326]:
                - img [ref=e327]
                - text: 12 juil. à 09h00
              - paragraph [ref=e329]:
                - img [ref=e330]
                - generic [ref=e333]: Amphithéâtre 500 — UAC, Abomey-Calavi
            - generic [ref=e334]:
              - generic [ref=e335]:
                - img "TECH HUB UAC" [ref=e337]
                - generic [ref=e338]: TECH HUB UAC
              - generic [ref=e339]: 2 000 FCFA
        - link "AfroBeats Night — Open Mic & DJ Set 🎵 Musique Ajouter aux favoris AfroBeats Night — Open Mic & DJ Set 2 août à 21h00 Le Millénaire — Cotonou, Cotonou Élite Events Élite Events 3 000 FCFA" [ref=e341] [cursor=pointer]:
          - /url: /event/afrobeats-night-open-mic-dj-set
          - generic [ref=e342]:
            - img "AfroBeats Night — Open Mic & DJ Set" [ref=e343]
            - generic [ref=e345]:
              - generic [ref=e346]: 🎵
              - text: Musique
            - button "Ajouter aux favoris" [ref=e347]:
              - img [ref=e348]
          - generic [ref=e350]:
            - heading "AfroBeats Night — Open Mic & DJ Set" [level=3] [ref=e351]
            - generic [ref=e352]:
              - paragraph [ref=e353]:
                - img [ref=e354]
                - text: 2 août à 21h00
              - paragraph [ref=e356]:
                - img [ref=e357]
                - generic [ref=e360]: Le Millénaire — Cotonou, Cotonou
            - generic [ref=e361]:
              - generic [ref=e362]:
                - img "Élite Events" [ref=e364]
                - generic [ref=e365]: Élite Events
              - generic [ref=e366]: 3 000 FCFA
        - link "Tournoi de Football Inter-Facs ⚽ Sports Ajouter aux favoris Tournoi de Football Inter-Facs 8 juil. à 14h00 Stade UAC — Abomey-Calavi, Abomey-Calavi SportCampus BJ SportCampus BJ Gratuit" [ref=e368] [cursor=pointer]:
          - /url: /event/tournoi-football-inter-facs
          - generic [ref=e369]:
            - img "Tournoi de Football Inter-Facs" [ref=e370]
            - generic [ref=e372]:
              - generic [ref=e373]: ⚽
              - text: Sports
            - button "Ajouter aux favoris" [ref=e374]:
              - img [ref=e375]
          - generic [ref=e377]:
            - heading "Tournoi de Football Inter-Facs" [level=3] [ref=e378]
            - generic [ref=e379]:
              - paragraph [ref=e380]:
                - img [ref=e381]
                - text: 8 juil. à 14h00
              - paragraph [ref=e383]:
                - img [ref=e384]
                - generic [ref=e387]: Stade UAC — Abomey-Calavi, Abomey-Calavi
            - generic [ref=e388]:
              - generic [ref=e389]:
                - img "SportCampus BJ" [ref=e391]
                - generic [ref=e392]: SportCampus BJ
              - generic [ref=e393]: Gratuit
        - 'link "Expo-Photo : Visages d''Afrique 🎨 Culture Ajouter aux favoris Expo-Photo : Visages d''Afrique 10 août à 10h00 Centre Culturel Français — Cotonou, Cotonou Club Culturel UAC Club Culturel UAC 1 000 FCFA" [ref=e395] [cursor=pointer]':
          - /url: /event/expo-photo-visages-afrique
          - generic [ref=e396]:
            - 'img "Expo-Photo : Visages d''Afrique" [ref=e397]'
            - generic [ref=e399]:
              - generic [ref=e400]: 🎨
              - text: Culture
            - button "Ajouter aux favoris" [ref=e401]:
              - img [ref=e402]
          - generic [ref=e404]:
            - 'heading "Expo-Photo : Visages d''Afrique" [level=3] [ref=e405]'
            - generic [ref=e406]:
              - paragraph [ref=e407]:
                - img [ref=e408]
                - text: 10 août à 10h00
              - paragraph [ref=e410]:
                - img [ref=e411]
                - generic [ref=e414]: Centre Culturel Français — Cotonou, Cotonou
            - generic [ref=e415]:
              - generic [ref=e416]:
                - img "Club Culturel UAC" [ref=e418]
                - generic [ref=e419]: Club Culturel UAC
              - generic [ref=e420]: 1 000 FCFA
      - link "Voir tous les événements" [ref=e422] [cursor=pointer]:
        - /url: /explore
        - text: Voir tous les événements
        - img [ref=e423]
    - generic [ref=e426]:
      - generic [ref=e428]:
        - generic [ref=e429]:
          - img [ref=e430]
          - generic [ref=e435]: Organisateurs
        - heading "Top organisateurs" [level=2] [ref=e436]
        - paragraph [ref=e437]: Les associations et clubs les plus actifs
      - generic [ref=e438]:
        - link "BDE FASEG BDE FASEG 4,200 abonnés · 24 événements" [ref=e439] [cursor=pointer]:
          - /url: /organizer/bde-faseg
          - img "BDE FASEG" [ref=e441]
          - generic [ref=e442]:
            - generic [ref=e443]:
              - heading "BDE FASEG" [level=3] [ref=e444]
              - img [ref=e446]
            - paragraph [ref=e448]: 4,200 abonnés · 24 événements
          - img [ref=e449]
        - link "TECH HUB UAC TECH HUB UAC 3,100 abonnés · 18 événements" [ref=e451] [cursor=pointer]:
          - /url: /organizer/tech-hub-uac
          - img "TECH HUB UAC" [ref=e453]
          - generic [ref=e454]:
            - generic [ref=e455]:
              - heading "TECH HUB UAC" [level=3] [ref=e456]
              - img [ref=e458]
            - paragraph [ref=e460]: 3,100 abonnés · 18 événements
          - img [ref=e461]
        - link "SportCampus BJ SportCampus BJ 2,700 abonnés · 31 événements" [ref=e463] [cursor=pointer]:
          - /url: /organizer/sportcampus-bj
          - img "SportCampus BJ" [ref=e465]
          - generic [ref=e466]:
            - generic [ref=e467]:
              - heading "SportCampus BJ" [level=3] [ref=e468]
              - img [ref=e470]
            - paragraph [ref=e472]: 2,700 abonnés · 31 événements
          - img [ref=e473]
        - link "Élite Events Élite Events 5,600 abonnés · 42 événements" [ref=e475] [cursor=pointer]:
          - /url: /organizer/elite-events
          - img "Élite Events" [ref=e477]
          - generic [ref=e478]:
            - generic [ref=e479]:
              - heading "Élite Events" [level=3] [ref=e480]
              - img [ref=e482]
            - paragraph [ref=e484]: 5,600 abonnés · 42 événements
          - img [ref=e485]
    - generic [ref=e490]:
      - img [ref=e491]
      - heading "Tu organises des événements ?" [level=2] [ref=e494]
      - paragraph [ref=e495]: Rejoins Univibes et donne de la visibilité à tes événements. Crée, promeut et vends tes billets en toute simplicité.
      - generic [ref=e496]:
        - link "Devenir organisateur" [ref=e497] [cursor=pointer]:
          - /url: /register?role=organizer
          - text: Devenir organisateur
          - img [ref=e498]
        - link "En savoir plus" [ref=e500] [cursor=pointer]:
          - /url: /explore
    - generic [ref=e502]:
      - generic [ref=e503]:
        - generic [ref=e504]:
          - generic [ref=e505]:
            - generic [ref=e507]: UV
            - generic [ref=e508]: Univibes
          - paragraph [ref=e509]: La plateforme de référence pour découvrir et promouvoir les événements étudiants en Afrique francophone.
        - generic [ref=e510]:
          - heading "Découvrir" [level=3] [ref=e511]
          - list [ref=e512]:
            - listitem [ref=e513]:
              - link "Événements" [ref=e514] [cursor=pointer]:
                - /url: /explore
            - listitem [ref=e515]:
              - link "Concerts" [ref=e516] [cursor=pointer]:
                - /url: /explore?category=concert
            - listitem [ref=e517]:
              - link "Conférences" [ref=e518] [cursor=pointer]:
                - /url: /explore?category=conference
            - listitem [ref=e519]:
              - link "Galas" [ref=e520] [cursor=pointer]:
                - /url: /explore?category=gala
        - generic [ref=e521]:
          - heading "Pour les orgas" [level=3] [ref=e522]
          - list [ref=e523]:
            - listitem [ref=e524]:
              - link "Devenir organisateur" [ref=e525] [cursor=pointer]:
                - /url: /register?role=organizer
            - listitem [ref=e526]:
              - link "Dashboard" [ref=e527] [cursor=pointer]:
                - /url: /dashboard
            - listitem [ref=e528]:
              - link "Créer un événement" [ref=e529] [cursor=pointer]:
                - /url: /dashboard/events/new
        - generic [ref=e530]:
          - heading "Légal" [level=3] [ref=e531]
          - list [ref=e532]:
            - listitem [ref=e533]: CGU
            - listitem [ref=e534]: Confidentialité
            - listitem [ref=e535]: Contact
      - generic [ref=e536]:
        - paragraph [ref=e537]: © 2025 Univibes. Tous droits réservés.
        - paragraph [ref=e538]: The Hub of Student Life
  - region "Notifications alt+T"
  - alert [ref=e539]
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | 
  3   | /**
  4   |  * WCAG 2.1 AA Automated Accessibility Tests for Univibes
  5   |  * Pages tested: home, explore, event detail, checkout, favorites, profile
  6   |  */
  7   | 
  8   | test.describe('Accessibility - WCAG 2.1 AA', () => {
  9   | 
  10  |   // Test 1: All images have alt text
  11  |   test('images-have-alt-attributes', async ({ page }) => {
  12  |     await page.goto('http://localhost:3000/explore', { timeout: 45000 });
  13  |     const images = await page.locator('img').all();
  14  |     const imagesWithoutAlt = [];
  15  | 
  16  |     for (const img of images) {
  17  |       const alt = await img.getAttribute('alt');
  18  |       if (!alt || alt === '') {
  19  |         const src = await img.getAttribute('src') || 'unknown';
  20  |         imagesWithoutAlt.push(src);
  21  |       }
  22  |     }
  23  | 
  24  |     expect(imagesWithoutAlt).toHaveLength(0), 
  25  |       `Found ${imagesWithoutAlt.length} images without alt text: ${imagesWithoutAlt.join(', ')}`;
  26  |   });
  27  | 
  28  |   // Test 2: All buttons have accessible labels
  29  |   test('buttons-have-accessible-labels', async ({ page }) => {
  30  |     await page.goto('http://localhost:3000', { timeout: 45000 });
  31  |     const count = await page.locator('button').count();
  32  |     const buttonsWithoutLabel = [];
  33  | 
  34  |     for (let i = 0; i < count; i++) {
  35  |       const btn = page.locator('button').nth(i);
  36  |       try {
  37  |         const ariaLabel = await btn.getAttribute('aria-label', { timeout: 3000 });
  38  |         const title = await btn.getAttribute('title', { timeout: 1000 });
  39  |         const text = await btn.innerText({ timeout: 3000 });
  40  | 
  41  |         if (!ariaLabel && !title && text.trim() === '') {
  42  |           buttonsWithoutLabel.push(`button #${i}`);
  43  |         }
  44  |       } catch {
  45  |         // Skip buttons that are slow/hidden
  46  |       }
  47  |     }
  48  | 
> 49  |     expect(buttonsWithoutLabel).toHaveLength(0),
      |                                 ^ Error: expect(received).toHaveLength(expected)
  50  |       `Found ${buttonsWithoutLabel.length} icon buttons without accessible labels: ${buttonsWithoutLabel.join(', ')}`;
  51  |   });
  52  | 
  53  |   // Test 3: Heading hierarchy is correct
  54  |   test('heading-hierarchy', async ({ page }) => {
  55  |     await page.goto('http://localhost:3000', { timeout: 45000 });
  56  |     const headings = page.locator('h1, h2, h3, h4, h5, h6');
  57  |     const count = await headings.count();
  58  |     const issues = [];
  59  | 
  60  |     let lastLevel = 0;
  61  |     for (let i = 0; i < count; i++) {
  62  |       const h = headings.nth(i);
  63  |       const tagName = await h.evaluate(el => el.tagName);
  64  |       const level = parseInt(tagName.charAt(1));
  65  |       if (level > lastLevel + 1 && lastLevel > 0) {
  66  |         issues.push(`Heading skipped from h${lastLevel} to h${level}`);
  67  |       }
  68  |       lastLevel = level;
  69  |     }
  70  | 
  71  |     expect(issues).toHaveLength(0), `Heading hierarchy issues: ${issues.join('; ')}`;
  72  |   });
  73  | 
  74  |   // Test 4: Forms have labels
  75  |   test('form-elements-have-labels', async ({ page }) => {
  76  |     await page.goto('http://localhost:3000/login', { timeout: 15000 });
  77  |     
  78  |     const inputs = await page.locator('input').all();
  79  |     const issues = [];
  80  | 
  81  |     for (const input of inputs) {
  82  |       const type = await input.getAttribute('type');
  83  |       if (type === 'hidden' || type === 'submit' || type === 'button') continue;
  84  | 
  85  |       const id = await input.getAttribute('id');
  86  |       const ariaLabel = await input.getAttribute('aria-label');
  87  |       const ariaLabelledBy = await input.getAttribute('aria-labelledby');
  88  |       const placeholder = await input.getAttribute('placeholder');
  89  | 
  90  |       if (!id && !ariaLabel && !ariaLabelledBy && !placeholder) {
  91  |         issues.push('Input without label or placeholder');
  92  |       }
  93  |     }
  94  | 
  95  |     expect(issues).toHaveLength(0), `Form elements without labels: ${issues.join('; ')}`;
  96  |   });
  97  | 
  98  |   // Test 5: Keyboard navigation works
  99  |   test('keyboard-navigable', async ({ page }) => {
  100 |     await page.goto('http://localhost:3000', { timeout: 15000 });
  101 |     // Tab 3 times to skip Next.js portal and reach actual content
  102 |     await page.keyboard.press('Tab');
  103 |     await page.keyboard.press('Tab');
  104 |     await page.keyboard.press('Tab');
  105 |     const activeElement = await page.evaluate(() => document.activeElement?.tagName?.toLowerCase());
  106 |     
  107 |     // Should focus on a link or button after skipping portal
  108 |     expect(['a', 'button', 'input', 'select', 'textarea']).toContain(activeElement),
  109 |       `First focusable element is <${activeElement}>, expected <a>, <button>, or <input>`;
  110 |   });
  111 | 
  112 |   // Test 6: No color-only contrast issues (basic check)
  113 |   test('basic-contrast-check', async ({ page }) => {
  114 |     await page.goto('http://localhost:3000/explore', { timeout: 15000 });
  115 |     
  116 |     // Check text colors on buttons and links
  117 |     const buttons = await page.locator('button, a').all();
  118 |     for (const btn of buttons) {
  119 |       const bgColor = await btn.evaluate(el => 
  120 |         window.getComputedStyle(el).backgroundColor
  121 |       );
  122 |       const color = await btn.evaluate(el => 
  123 |         window.getComputedStyle(el).color
  124 |       );
  125 |       
  126 |       // Very basic check - ensure we're not on pure white on white or black on black
  127 |       if (bgColor === 'rgb(255, 255, 255)' && color === 'rgb(255, 255, 255)') {
  128 |         expect(true).toBe(false), 'White text on white background detected';
  129 |       }
  130 |     }
  131 |   });
  132 | 
  133 |   // Test 7: Proper ARIA attributes
  134 |   test('valid-aria-attributes', async ({ page }) => {
  135 |     await page.goto('http://localhost:3000', { timeout: 15000 });
  136 |     
  137 |     const invalidAria = await page.evaluate(() => {
  138 |       const allElements = document.querySelectorAll('*');
  139 |       const issues = [];
  140 |       const validPrefixes = [
  141 |         'aria-atomic', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby',
  142 |         'aria-details', 'aria-disabled', 'aria-expanded', 'aria-flowto',
  143 |         'aria-grabbed', 'aria-hidden', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby',
  144 |         'aria-live', 'aria-owns', 'aria-relevant', 'aria-modal'
  145 |       ];
  146 | 
  147 |       allElements.forEach(el => {
  148 |         const attrs = el.getAttributeNames();
  149 |         attrs.forEach(attr => {
```