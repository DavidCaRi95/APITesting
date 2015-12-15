var http = require('http');

var testRunner = function ()
{
  var self = this;
  self.postData = {};
  self.postOptions = {};

  self.run = function(testName,testUrl,testPort,testUri,testParams,testExpectedResponse)
  {
    self.postData = "data="+JSON.stringify(testParams);
    self.postOptions =
    {
      hostname: testUrl,
      method: 'POST',
      port: testPort,
      path: testUri,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(self.postData)
      }
    };

    self.req = http.request(self.postOptions,function(res)
    {
      var output = '';
      res.on('data', function (chunk)
      {
        output += chunk;
      });

      res.on('end', function()
      {
        try
        {
          response = JSON.parse(output);
        }
        catch(e)
        {
          console.log(testName + " FAILED, BAD JSON RESPONSE: " + output);
          return false;
        }
        for(var key in testExpectedResponse)
        {
          var testExpected = new RegExp(testExpectedResponse[key]);
          console.log(testExpected.test(response[key]));
          if(testExpectedResponse.hasOwnProperty(key))
          {
            if(response.hasOwnProperty(key))
            {
              if(testExpected.test(response[key]))
              {
                console.log(testName + " PASSED");
              }
              else
              {
                console.log(testName + " FAILED, RESPONSE KEY: "+ key + ", RESPONSE EXPECTED VALUE: " + testExpectedResponse[key] + ", RESPONSE VALUE: " + response[key]);
                return false;
              }
            }
            else
            {
              console.log(testName + " FAILED, RESPONSE MISSING KEY: "+ key + ", RESPONSE: " + response);
              return false;
            }
          }
          else
          {
            console.log(testName + " FAILED, BAD EXPECTED RESPONSE: " + testExpectedResponse);
            return false;
          }
        }
        console.log("Passed");
      });
    });

    self.req.on('error', function (err) {
    console.log("ServerError");
    console.log('error: ' + err.message);
    });

    self.req.write(self.postData);
    self.req.end();
  };//End run function

};

module.exports = testRunner;

