# O'parc sous toutes les coutures

Mongo, c'est rigolo. Les agrégats, ça pique un peu mais si on prend le temps de les écrire progressivement, de les tester à chaque étape, de caler un `$count` pour jauger le résultat, ça se fait :muscle:

Alors conjugons tout ça dans un petit challenge dont le but est de tirer quelques informations intéressantes (on parle d'_insight_ en Data Science, ça fait plus branché) de ces données complètement insipides si on les regarde une par une.

## Le mois de juin 2019

Le mois de juin est une période un peu particulière pour O'parc car c'est le début des vacances mais c'est aussi un mois où la météo du coin est particulièrement capricieuse, et les 2 effets ont tendance à s'annuler. **Sans utiliser d'agrégat**, comptez les visites du mois de Juin 2019 et comparez-les avec les visites du mois de septembre 2019, par exemple. (il existe une méthode pour compter sans agrégat :bulb:)

<details>
<summary>Un peu d'aide</summary>
Pas d'agrégat donc pas de modification des données, la date n'en est donc pas vraiment une, c'est une string qui représente une date. Pour autant, cette string est assez bien formatée : les premiers caractères représentent l'année et les quelques suivants... <strong>le mois</strong>. Reste à trouver un opérateur qui vérifie qu'une string commence par certains caractères. Ça vous rappelle pas quelque chose, ça ? 🤔 Google est votre ami :wink:
</details>

## Le mois de juin 2019, le vrai

Bon, si on ne passe pas par un agrégat, le résultat n'est pas tout à fait exact à cause des fuseaux horaires, on récupère des visiteurs du 31 mai à partir de 22h et on ignore des visiteurs du 30 juin à partir de 22h 😬 Dariusz aime les sciences exactes : pas le choix, on va créer de vraies dates à partir de nos _strings de date_.

<details>
<summary>Un peu d'aide</summary>
Donc, si on découpe notre pipeline, ça va donner :
<ul>
  <li>une projection pour avoir des dates et... c'est tout (le reste des documents, on ne l'utilise pas)</li>
  <li>un filtre sur ces dates pour ne récupérer que juin (et septembre, pour comparer)</li>
  <li>un comptage</li>
</ul>
</details>

## Les catégories, c'est important

Dariusz s'est rendu compte qu'il manquait une info dans son export de données : chaque attraction a une catégorie ("enfants", "famille", "sensations"). Il nous a retrouvé la liste des catégories et de leurs attractions et nous demande maintenant de classer les catégories par popularité (par nombre de visites donc).

- Catégorie _enfants_ : ES6 Tycoon, APIttoresque, Promise cuitée, le Node Express
- Catégorie _famille_ : Sequelizigzag, Eventropico, le Manoir des Vieux Clous, Coup de fourchette
- Catégorie _sensations_ : la Tour de l'Array, les auto-DOMponneuses, l'EJS Palace

<details>
<summary>Un peu d'aide</summary>
Rappelez-vous qu'une projection peut servir à calculer de nouvelles colonnes : il doit bien y avoir un moyen de dire <em>si cette attraction se trouve dans ce tableau, alors sa catégorie est celle-ci, sinon etc</em>. Et là, vous aurez clairement fait le plus dur :wink:
</details>