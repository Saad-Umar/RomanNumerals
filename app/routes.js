var express = require('express');

module.exports = function(app) {
    var numberToRoman = {"1":"I","4":"IV","5":"V","9":"IX","10":"X","40":"XL","50":"L","90":"XC","100":"C","400":"CD","500":"D","900":"CM","1000":"M","4000":"MMMM"};
    app.get('/')
    app.get('/convert/:number', function (req,res) {
            if (!req.params.number) {
                return res.status(400).send('Invalid parameters');
            } else {
                var numberArray = req.params.number.split('');
                var romanString = "";
                for (var i = 0; i < numberArray.length; i++) {
                    //var repetitiveNumeral = "0";
                    if (numberArray[i]==0) {
                        continue;
                    } else if (numberArray[i]==1||numberArray[i]==4||numberArray[i]==5||numberArray[i]==9) {
                       var fixedNumeral = numberArray[i];
                        for (var j = 0; j < numberArray.length - 1 - i;j++) {
                             fixedNumeral += "0";
                    }
                    romanString += numberToRoman[fixedNumeral];
            
                    } else if (numberArray[i]<5) {
                       var repetitiveNumeral = 1;
                        for (var j = 0; j < numberArray.length - 1 - i;j++) {
                             repetitiveNumeral += "0";
                    }
                    for (var j = 0; j < numberArray[i];j++) {
                        romanString += numberToRoman[repetitiveNumeral];
                    }
                    
                    } else {
                       var repetitiveNumeral = 5;
                        for (var j = 0; j < numberArray.length - 1 - i;j++) {
                             repetitiveNumeral += "0";
                        }
                       romanString += numberToRoman[repetitiveNumeral];
                      
                       for (var j = 0; j < numberArray[i] - 5;j++) {
                             repetitiveNumeral = 1;
                              for (var k = 0; k < numberArray[i] - 5;k++) {
                             repetitiveNumeral += "0";
                            
                        }
                       romanString += numberToRoman[repetitiveNumeral];
                    }
                    
                    }
            
                }
                return res.status(200).send(romanString);
            }
        }

     );

};