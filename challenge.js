db.rides.createIndex({ timestamp: "text"})
db.rides.find({ $text: { $search: "\"2019-06\"" } }).count()
// 45763
db.rides.find({ $text: { $search: "\"2019-09\"" } }).count()
// 49052
db.rides.aggregate([
    {
        $match: {
            $text: {$search: "\"2019-06\""}
        }
    },
    {
        $project: {
            $text: {
                $dateFromString: {
                    dateString: timestamp
                }
            }
        }
    },
    {
        $group : {
            count: {
                $sum: 1
            }
        }
    }
])