const { nanoid } = require("nanoid");
const URLMap = require("../models/urlmap");

exports.getHomePage = (req, res, next) => {
  res.render(
      'home',
      {
          docTitle: 'Shortlink',
          path: '/',
          hasErrorMsg: false,
          hasMessage: false,
          Msg: null,
          validationErrors: []
      }
  );

}

exports.encode = async (req, res, next) => {
  let shortId = nanoid(8);
  let shortUrl = '';

  const longUrl = req.body.longUrl as string;

  if(longUrl.includes('https')){
    shortUrl = 'https://short.est/' + shortId;
  }else{
    shortUrl = 'http://short.est/' + shortId;
  }

  //collection for storing URL mappings
  const map = new URLMap({
    short: shortUrl,
    long: longUrl,
  });

  try{
    await map.save();
  }catch(err){
    if(!err.code){
      err.code = 500;
    }
    return next(err);
  }finally{
    res.status(201).json({ encodedUrl: shortUrl, message: 'url successfully shortened' });
  }
};

// Create a route for redirecting short URLs
exports.decode = (req, res) => {
  const shortUrl = req.params.shortUrl;
  const map = URLMap.findOne({short: shortUrl});

  if(!map){
    const error = new Error("url pairing not found!");
    throw error;
  }
  const longUrl = map.long;
  if (longUrl) {
    res.redirect(longUrl);
  } else {
    res.status(404).json({ error: "URL not found" });
  }
};
