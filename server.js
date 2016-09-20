const mongo = require('mongodb').MongoClient
const express = require('express')
const validUrl = require('valid-url')
const app = express()
const dbName = 'mongodb://localhost:27017/' + 'shortee'

/**
 * Routing
 */
app.get('/new/*', (req, res) => {
  const url = req.params[0]
  
  const result = ( validUrl.isHttpUri(url) ) ? {
    fullUrl: url,
    shortUrl: `https://how-to-npm-amielucha.c9users.io/` + shorten(url)
  } : {
    fullUrl: null,
    shortUrl: null
  }
  
  res.setHeader('Content-Type', 'application/json')
  res.send(JSON.stringify(result, null, 2))
})

app.get('/*', (req, res) => {
  const hash = req.params[0]
  
  // check if it's in the db
  mongo.connect(dbName, function(err, db) {
    if(err) throw err

    const collection = db.collection( 'urls' )
    collection.find({'shortUrl': hash}).toArray((err, arr)=>{
        if (err) throw err
        
        console.log(arr)
        if (arr.length){
          redirectTo(arr[0].longUrl, res)
        } else {
          res.status(404)
            .end(`Nope, nothing here`)
        }
    })

    db.close()
  })
})

app.listen(8080, () => {
  console.log(`URL Shortener running an listening on port 8080!`)
})


/**
 * Functions
 */
const redirectTo = (url, res) => {
  res.writeHead(301,
    {Location: url}
  )
  res.end()
} 
 
const processDb = (hash, urlLong) => {
  mongo.connect(dbName, function(err, db) {
    if(err) throw err

    const collection = db.collection( 'urls' )
    
    if ( collection.find({'shortUrl': hash}).limit(1).count() > 0 ){
      db.close()
      return 1
    } else {
      collection.insert({ shortUrl: hash, longUrl: urlLong })
      db.close()
      return 0
    }
  })
}

const randomUrl = () => Math.random().toString(36).substr(2, 8)

const shorten = (url) => {
  var newUrl = randomUrl()
  // Process the db if the hash doesn't esist yet 
  return (!processDb(newUrl, url)) ? newUrl : shorten(url)
}
