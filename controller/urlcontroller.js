const Url=require('../models/url')
const Analytic=require('../models/analytic')
const shortid = require('shortid');
const geoip = require('geoip-lite');
const redisClient = require('../redis');

async function shortenUrl(req,res){
    try{
    const {longUrl,customAlias,Topic}=req.body
    let Alias=customAlias
    let ShortUrl;
    if(customAlias){
        const res=await Url.findOne({ Alias: customAlias })
        if(res){
            return res.status(400).json({message:'This Alias already exist'})
        }
    }
    if(!customAlias){
        Alias = shortid.generate();
    }
    ShortUrl= `http://localhost:3000/api/shorten/${Alias}`;

    const urlData = {
        LongUrl: longUrl,
        ShortUrl: ShortUrl,
        Alias: Alias,
        Topic: Topic,
       Created_by: req.user.id
      };

      const newUrl = new Url(urlData);
      const savedUrl = await newUrl.save();

    return res.json({
      shortUrl: savedUrl.ShortUrl,
      createdAt: savedUrl.createdOn
    });
}
catch(error){
    console.log(error)
    return res.status(500).json({message:error.message})
}
    
   

}


async function makeReport(req,res){
    try{
    const alias=req.params.alias
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress; // Get IP address
  const geo = geoip.lookup(ip); // Get geolocation

  // Get operating system and device type
  const ua = req.useragent;
  const os = ua.os; // Operating system
  const device = ua.isMobile ? 'Mobile' : 'Desktop'; // Device type
  const browser = ua.browser; 
  const url=await Url.findOne({Alias:alias})// Browser
  if(!url){
    return res.status(404).json({message:'Alias not exist'})
  }

  const filter = {
    user_id: req.user.id,
    OperatingSystem: os,
    DeviceType: device,
    Alias:alias
  };

  const update = {
    $inc: { Count: 1 }, // Increment Count by 1
    $set: {             // Set additional fields
      IP_address: ip,
      GeoLocation: geo,
      Topic:url.Topic
    },
  };

  const options = {
    upsert: true, // Create the document if it doesn't exist
    new: true,    // Return the updated document
    setDefaultsOnInsert: true, // Set default values for new documents
  };
  await redisClient.del(alias);
  await redisClient.del(url.Topic);
  await redisClient.del('all');

  const result = await Analytic.findOneAndUpdate(filter, update, options);
  
  return res.status(302).redirect(url.LongUrl);
}
catch(error){
    console.log(error)
    return res.status(500).json({message:error.message})
}

}

async function analyticByAlias(req,res){
    const alias=req.params.alias
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const cachedData = await redisClient.get(alias);
        if (cachedData) {
            return res.json({data:JSON.parse(cachedData)})  
        }
    const result = await Analytic.aggregate([
        {
            $match: {
                Alias: alias
            }
        },
        {
            $facet: {
                totalSummary: [
                    {
                        $group: {
                            _id: null, // Group all matching documents together
                            totalCount: { $sum: "$Count" }, // Sum of 'Count' field
                            uniqueUserIds: { $addToSet: "$user_id" } // Collect unique user_ids
                        }
                    },
                    {
                        $project: {
                            totalCount: 1, // Include total count
                            uniqueUserCount: { $size: "$uniqueUserIds" } // Count unique user_ids
                        }
                    }
                ],
                byOperatingSystem: [
                    {
                        $group: {
                            _id: "$OperatingSystem", // Group by OperatingSystem
                            totalCount: { $sum: "$Count" }, // Sum of 'Count' field
                            uniqueUserIds: { $addToSet: "$user_id" } // Collect unique user_ids
                        }
                    },
                    {
                        $project: {
                            _id: 1, // OperatingSystem
                            totalCount: 1, // Include total count
                            uniqueUserCount: { $size: "$uniqueUserIds" } // Count unique user_ids
                        }
                    }
                ],
                byDevice: [
                    {
                        $group: {
                            _id: "$DeviceType", // Group by OperatingSystem
                            totalCount: { $sum: "$Count" }, // Sum of 'Count' field
                            uniqueUserIds: { $addToSet: "$user_id" } // Collect unique user_ids
                        }
                    },
                    {
                        $project: {
                            _id: 1, // OperatingSystem
                            totalCount: 1, // Include total count
                            uniqueUserCount: { $size: "$uniqueUserIds" } // Count unique user_ids
                        }
                    }
                ],
                Datewise: [
                    {
                        $match: {

                            createdOn: { $gte: sevenDaysAgo } // Filter for the last 7 days
                        }
                    },
                    {
                        $group: {
                            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdOn" } }, // Group by date (YYYY-MM-DD format)
                            totalCount: { $sum: "$Count" } // Sum the 'Count' field for each date
                        }
                    },
                    {
                        $sort: { _id: 1 } // Sort by createdOn date (ascending)
                    }
                ]
            }
        }
    ]);
    await redisClient.set(alias, JSON.stringify(result));

    return res.json({data:result})


}

async function Allanalytic(req,res){
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const cachedData = await redisClient.get('all');
        if (cachedData) {
            return res.json({data:JSON.parse(cachedData)})  
        }
    const result = await Analytic.aggregate([
        {
            $facet: {
                totalSummary: [
                    {
                        $group: {
                            _id: null, // Group all matching documents together
                            totalCount: { $sum: "$Count" }, // Sum of 'Count' field
                            uniqueUserIds: { $addToSet: "$user_id" },
                            totalUrl:{$addToSet:"$Alias"} // Collect unique user_ids
                        }
                    },
                    {
                        $project: {
                            totalCount: 1, // Include total count
                            uniqueUserCount: { $size: "$uniqueUserIds" },
                            totalUrl:{ $size: "$totalUrl" } // Count unique user_ids
                        }
                    }
                ],
                byOperatingSystem: [
                    {
                        $group: {
                            _id: "$OperatingSystem", // Group by OperatingSystem
                            totalCount: { $sum: "$Count" }, // Sum of 'Count' field
                            uniqueUserIds: { $addToSet: "$user_id" } // Collect unique user_ids
                        }
                    },
                    {
                        $project: {
                            _id: 1, // OperatingSystem
                            totalCount: 1, // Include total count
                            uniqueUserCount: { $size: "$uniqueUserIds" } // Count unique user_ids
                        }
                    }
                ],
                byDevice: [
                    {
                        $group: {
                            _id: "$DeviceType", // Group by OperatingSystem
                            totalCount: { $sum: "$Count" }, // Sum of 'Count' field
                            uniqueUserIds: { $addToSet: "$user_id" } // Collect unique user_ids
                        }
                    },
                    {
                        $project: {
                            _id: 1, // OperatingSystem
                            totalCount: 1, // Include total count
                            uniqueUserCount: { $size: "$uniqueUserIds" } // Count unique user_ids
                        }
                    }
                ],
                Datewise: [
                    {
                        $match: {

                            createdOn: { $gte: sevenDaysAgo } // Filter for the last 7 days
                        }
                    },
                    {
                        $group: {
                            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdOn" } }, // Group by date (YYYY-MM-DD format)
                            totalCount: { $sum: "$Count" } // Sum the 'Count' field for each date
                        }
                    },
                    {
                        $sort: { _id: 1 } // Sort by createdOn date (ascending)
                    }
                ]
            }
        }
    ]);
    await redisClient.set('all', JSON.stringify(result));

return res.json({data:result})    

}

async function analyticByTopic(req,res){
    const topic=req.params.topic
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const cachedData = await redisClient.get(topic);
        if (cachedData) {
            return res.json({data:JSON.parse(cachedData)})  
        }
    const result = await Analytic.aggregate([
        {
            $match: {
                Topic: topic
            }
        },
        {
            $facet: {
                totalSummary: [
                    {
                        $group: {
                            _id: null, // Group all matching documents together
                            totalCount: { $sum: "$Count" }, // Sum of 'Count' field
                            uniqueUserIds: { $addToSet: "$user_id" } // Collect unique user_ids
                        }
                    },
                    {
                        $project: {
                            totalCount: 1, // Include total count
                            uniqueUserCount: { $size: "$uniqueUserIds" } // Count unique user_ids
                        }
                    }
                ],
                byOperatingSystem: [
                    {
                        $group: {
                            _id: "$OperatingSystem", // Group by OperatingSystem
                            totalCount: { $sum: "$Count" }, // Sum of 'Count' field
                            uniqueUserIds: { $addToSet: "$user_id" } // Collect unique user_ids
                        }
                    },
                    {
                        $project: {
                            _id: 1, // OperatingSystem
                            totalCount: 1, // Include total count
                            uniqueUserCount: { $size: "$uniqueUserIds" } // Count unique user_ids
                        }
                    }
                ],
                byDevice: [
                    {
                        $group: {
                            _id: "$DeviceType", // Group by OperatingSystem
                            totalCount: { $sum: "$Count" }, // Sum of 'Count' field
                            uniqueUserIds: { $addToSet: "$user_id" } // Collect unique user_ids
                        }
                    },
                    {
                        $project: {
                            _id: 1, // OperatingSystem
                            totalCount: 1, // Include total count
                            uniqueUserCount: { $size: "$uniqueUserIds" } // Count unique user_ids
                        }
                    }
                ],
                Datewise: [
                    {
                        $match: {

                            createdOn: { $gte: sevenDaysAgo } // Filter for the last 7 days
                        }
                    },
                    {
                        $group: {
                            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdOn" } }, // Group by date (YYYY-MM-DD format)
                            totalCount: { $sum: "$Count" } // Sum the 'Count' field for each date
                        }
                    },
                    {
                        $sort: { _id: 1 } // Sort by createdOn date (ascending)
                    }
                ]
            }
        }
    ]);
    
    await redisClient.set(topic, JSON.stringify(result));
    return res.json({data:result})
}






module.exports={shortenUrl,makeReport,analyticByAlias,Allanalytic,analyticByTopic}
