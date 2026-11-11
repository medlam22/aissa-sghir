# Site académique — Pr. Aïssa Sghir

Site centré sur les travaux pédagogiques et la recherche, inspiré du modèle visuel fourni : bleu universitaire, touches turquoise, cartes de ressources et portrait réel.

## Pages

- `index.html` : accueil, portrait, accès par niveau et sélection de documents.
- `pedagogie.html` : Licence, Master, Doctorat ; 8 modules et 15 PDF. Recherche textuelle et filtres par niveau.
- `recherche.html` : axes de recherche, 11 publications avec DOI, filtres par année et recherche, encadrements doctoraux.

## Contenu

`data.js` contient le catalogue et les notices bibliographiques établies depuis les documents fournis. Les références utilisent les années et revues présentes dans les PDF, y compris les corrections des noms de fichiers. Les deux articles du Kuwait Journal of Science paraissent dans le volume 53 (2026).

Les documents pédagogiques se trouvent dans `documents/`, le portrait dans `assets/`. Les PDF restent intacts, avec leur pagination et leurs attributions. Les énoncés et corrigés présents dans un même fichier sont présentés ensemble. La formation doctorale n’est intégrée qu’une fois malgré son doublon dans les sources.

Le dossier de travail `complement/` est exclu de Git et du déploiement. Il contient aussi des attestations et pièces administratives. Les PDF éditeurs des articles et les manuscrits de thèse ne sont pas copiés dans les fichiers publics ; les publications renvoient à leurs DOI. Le manuscrit Benasquar ne renseigne pas de date de soutenance ; la fiche conserve le statut « en préparation ».

## Prévisualiser

Avec Node.js installé :

```text
node build.cjs
node server.cjs
```

Puis ouvrir http://localhost:3000. On peut également ouvrir directement les pages HTML depuis le dossier du projet.

## Déploiement GitHub / Vercel

Aucune dépendance à installer. `vercel.json` définit la compilation `node build.cjs` et le dossier public `dist`. Le script copie uniquement les trois pages, les styles, les scripts, l’icône, le portrait et les documents pédagogiques.

Après commit et push sur la branche main du dépôt medlam22/aissa-sghir, le projet Vercel associé doit reconstruire le site. Si Vercel possède une surcharge manuelle des paramètres de compilation, utiliser `node build.cjs` et le dossier de sortie `dist`.

`publier.cmd` permet de créer le commit et de pousser les fichiers depuis la session Windows de l’utilisateur. Il ne force jamais un push et s’arrête en cas d’erreur. Les authentifications GitHub se font dans le navigateur si nécessaire.

Les polices Google Fonts disposent de polices locales de remplacement.
