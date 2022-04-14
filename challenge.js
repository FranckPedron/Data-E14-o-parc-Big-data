db.rides.createIndex({ timestamp: "text"})
db.rides.find({ $text: { $search: "\"2019-06\"" } }).count()
// 45763
db.rides.find({ $text: { $search: "\"2019-09\"" } }).count()
// 49052
db.rides.aggregate([    
    {
        $project: {
            timestamp: {
                $dateFromString: {
                    dateString: "$timestamp"
                }
            }
        }
    },
    {
        $match: {
            timestamp: {
                $gte: ISODate("2019-06-01T00:00:00.000Z"),
                $lt: ISODate("2019-07-01T00:00:00.000Z")
            }
        }
    },
    {       
            $count: "Visiteurs du mois de juin: "        
    }
]);
// 45825

db.rides.aggregate([    
    {
        $project: {
            timestamp: {
                $dateFromString: {
                    dateString: "$timestamp"
                }
            }
        }
    },
    {
        $match: {
            timestamp: {
                $gte: ISODate("2019-09-01T00:00:00.000Z"),
                $lt: ISODate("2019-10-01T00:00:00.000Z")
            }
        }
    },
    {       
            $count: "Visiteurs du mois de septembre: "        
    }
]);
// 49087

db.rides.aggregate(
    [
        {
            $project: {
                category: {
                    $switch: {
                        branches: [
                            {
                                case: {
                                    $in: [
                                        "$event",
                                        ["ES6 Tycoon", "APIttoresque", "Promise cuitée", "le Node Express"]
                                    ]
                                },
                                then: "enfants"
                            },
                            {
                                case: {
                                    $in: [
                                        "$event",
                                        ["Sequelizigzag", "Eventropico", "le Manoir des Vieux Clous", "Coup de fourchette"]
                                    ]
                                },
                                then: "famille"
                            },
                            {
                                case: {
                                    $in: [
                                        "$event",
                                        ["la Tour de l'Array", "les auto-DOMponneuses", "l'EJS Palace"]
                                    ]
                                },
                                then: "sensations"
                            }
                        ],
                        default: "Pas de catégorie"
                    }
                }
            }
        },
        {
            $group: {
                _id: "$category",
                visitor: {
                    $sum:1
                }
            }
        }
    ]
);