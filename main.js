"use strict";
var testRunner = require("./testrunner.js");
var fs=require('fs');
var data = 0;
var testsJSON = null;
var valid = true;

function validateTestsJSON(callback)
{
	try {
		var obj = JSON.parse(fs.readFileSync('./tests.json', 'utf8'));
		callback(obj);
    }
    catch(err) {
    	return console.log("Invalid file");
    }
}

function validateTestFormat(validJSON)
{
	if(!validJSON)
	{
		return false;
	}
	else
	{
		if(typeof validJSON.name == "string" && typeof validJSON.url == "string" && typeof validJSON.testgroups == "object" && typeof validJSON.port == "number")
		{
			for (var i = validJSON.testgroups.length - 1; i >= 0; i--) 
			{
				if(typeof validJSON.testgroups[i].groupname == "string" && typeof validJSON.testgroups[i].tests == "object")
				{
					for (var j = validJSON.testgroups[i].tests.length - 1; j >= 0; j--)
					{
						if( typeof validJSON.testgroups[i].tests[j].name == "string" && 
							typeof validJSON.testgroups[i].tests[j].uri == "string" && 
							typeof validJSON.testgroups[i].tests[j].input == "object" && 
							typeof validJSON.testgroups[i].tests[j].output == "object") 
						{
							console.log("Correct JSON Format");
						}
						else
						{
							console.log("Invalid JSON Format");
						}
					}
				}
				else
				{
					console.log("Invalid JSON Format");
				}
			}	
			testsJSON = validJSON;
			runTests(testsJSON);
		}
		else
		{
			console.log("Invalid JSON Format");
		}
	}
	
}

function runTests(testsJSON)
{
	for (var i = testsJSON.testgroups.length - 1; i >= 0; i--) 
	{
		for (var j = testsJSON.testgroups[i].tests.length - 1; j >= 0; j--)
		{
			var test = new testRunner();

			test.run(testsJSON.testgroups[i].tests[j].name, testsJSON.url,testsJSON.port,testsJSON.testgroups[i].tests[j].uri,testsJSON.testgroups[i].tests[j].input,testsJSON.testgroups[i].tests[j].output);
		}
	}
}

validateTestsJSON(validateTestFormat);
