
const valueToInsert = { 
    firstname: "Carlos",
    lastname: "Norris",
    nickname: "Chuck"
};

db.users.insert(valueToInsert);


// const query = "WHERE lastname = Norris"; SQL
const query = {
    lastname : "Norris" // on va rechercher les objets qui ont "Norris" comme lastname
};
db.users.deleteOne(query);

//Bon, les noms des champs f1, f2, f3... bof... mais on va y remédier. Enfin, on... surtout vous. La doc est là, ça devrait nous permettre de donner des noms plus explicites aux champs de nos documents. Disons "event", "visitor" et "timestamp".

db.rides.updateMany(
    { },
    { 
        $rename: { 'f1': 'event', 'f2': 'visitor','f3' :'timestamp' } 
    }
);

/* AGGREGATE */

db.rides.aggregate([
    // ne retournera que les documents possédant un champ event
    // si vous avez un doute sur l'homogénéité de votre collection, cela peut permettre d'assurer la cohérence du résultat de votre agrégat
    {
        $match: {
            event: {$exists: true}
        }
    },
    // retournera, pour chaque document, 3 nouveaux champs
    // les 2 premiers sont renommés en stockant la valeur de l'ancienne clé dans la nouvelle
    // le 3e utilise la fonction dateFromString sur le champ f3 pour le transformer en ISODate, un format de date facile à manipuler
    { 
        $project: {
            event: "$event", // le $event fait référence au résultat de l'action précédente
            visitor: "$visitor",
            time: {
                $dateFromString: { // je convertis un string en date
                    dateString: "$timestamp"
                }
            }
        }
    }
]);

/*
EN SQL

SELECT event,visitor, timestamp::timestamptz as time
FROM rides
WHERE event is not null;

*/


/* Il faut voir ici deux choses :

1- Aggregate est une suite d'actions à effectuer dans un ordre précis
2- Chaque action hérite du résultat de la précédente

*/

// attractions visitées par chaque visiteur
db.rides.aggregate([
    // regroupe les documents par visiteur
    // et assemble les attractions visitées dans un array nommé events
    {
        $group: {
            _id: "$visitor",
            events: {
                $push: "$event"
            }
        }
    }
]).pretty();


db.rides.aggregate([
    // regroupe par attraction
    // et "compte" les documents liés à chaque attraction en additionnant 1 pour chaque document
    {
        $group: {
            _id: "$event",
            count: {
                $sum: 1
            }
        }
    },
    // "branché" après le $group ci-dessus, cette fonction ne retournera que les documents dont le champ count contient une valeur supérieure à 423000
    {
        $match: {
            count: {
                $gt: 50680
            }
        }
    },
    // trie de façon décroissante sur le champ count
    {
        $sort: {
            count: -1
        }
    }
]);


// Aggregat complet

// attention, cet exemple part de la version non renommé de la collection
db.rides.aggregate(
    [
        {
            $match: {
                f1: {$exists: true} // on demande que le champ "f1" existe dans les documents retournés
            }
        },
        { 
            $project: {
                event: "$f1", // on renomme le champ "f1" en "event"dans les documents retournés
                visitor: "$f2" // on renomme le champ "f2" en "visitor"dans les documents retournés
            }
        },
        {
            $group: {
                _id: "$event", // on groupe par le champ "event" qui sera retourné via le champ "_id"
                count: {
                    $sum: 1 // on précise un champ "count" dans les documents retournés qui sera la somme des événements trouvés dans les résultats précédents
                }
            }
        },
        {
            $match: { // on souhaite n'avoir que les résultats dont le champ "count" est supérieur à 42300
                count: {
                    $gt: 42300
                }
            }
        },
        {
            $sort: {
                count: -1
            }
        }
    ]
);

/*

Format SQL :

SELECT f1 AS _id, COUNT(*) AS "count"
FROM rides
WHERE f1 is not null 
GROUP BY f1
HAVING COUNT(*) > 42300
ORDER BY "count" DESC;
 
*/