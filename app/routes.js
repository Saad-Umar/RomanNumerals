var express = require('express');

module.exports = function(app) {

    app.get('/convert/:number', function (req,res) {
            if (!req.params.number) {
                return res.status(400).send('Invalid parameters');
            } else {
                var fixedNumerals = ["I","X","C","M","IV","XL","CD","V","L","D","IX","XC","CM"];
                var numberArray = req.params.number.split('');
                var romanString = "";
                for (var i = 0; i < numberArray.length; i++) {
                    var repetitiveNumeral = "";
                    var offset = (numberArray.length - 1) - i;
                    if (numberArray[i]==0) {
                        continue;
                    } else if (numberArray[i] == 1) {
                        offset += 0;
                    } else if (numberArray[i] == 4) {
                        offset += 4;
                    } else if (numberArray[i] == 5)  {
                        offset +=  7;
                    } else if (numberArray[i] == 9) {
                        offset += 10;
                    } else {
                        var numberOfRepetition = numberArray[i]%5 - 1;
                        if (numberArray[i] < 5) {
                            offset = 0;
                        } else {
                            offset = 7;
                            numberOfRepetition = numberArray[i]%5;
                        }
                        for (var i=0;i<numberOfRepetition;i++) {
                            repetitiveNumeral += "I";

                        }
                    }
                    romanString += fixedNumerals[offset] + repetitiveNumeral;
                }
                return res.status(200).send(romanString);
            }
        }

     );

};