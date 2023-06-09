const express = require('express');
const app = express();
const Data = require('./data.json');
const cors = require('cors');

app.use(cors({
    origin: '*'
}));

function isEvenDay() {
    return new Date().getDay() % 2 == 0;
}

function returnArr(quote) {
    let arr = [];
    let num = 0;

    while (num < quote.quote.length) {
        num += 4;
    }

    let quoteIndex = num - quote.quote.length;
    let index = quote.quote.split(/([Ee])/).length - 1
    while (arr.length < 4) {
        if (quoteIndex === arr.length) {
            arr.push(quote.author)
        } else {
            index *= 2;
            if (index < 0) {
                index *= -2;
            }
            if (index >= Data.quotes.length) {
                index -= Data.quotes.length;
            }
            if (!arr.includes(Data.quotes[index].author) && Data.quotes[index].author != quote.author) {
                arr.push(Data.quotes[index].author)
            } else {
                index -= 1
            }
        }
    }
    return arr;
}

function returnQuoteFromNum(big) {
    let reversedArr;

    if (isEvenDay()) {
        reversedArr = Data.quotes.slice();
    } else {
        reversedArr = Data.quotes.slice().reverse();
    }

    let arr = [];

    for (let i = 4; i < 14; i++) {
        let num = big * (i * 2);
        while (num >= reversedArr.length) {
            num -= reversedArr.length;
        }
        let currentQuote = reversedArr[num];
        arr.push({
            quote: currentQuote,
            options: returnArr(currentQuote)
        })
    }
    
    return arr;
}

app.get('/todayQuote', (req, res) => {
    let date = new Date();
    res.send(returnQuoteFromNum(Math.floor((date.getDay() + 3) * (date.getDate() + date.getMonth()))));
});

app.get('/fullfile', (req, res) => {
    res.send(Data.quotes);
});

app.get('/randomQuote', (req, res) => {
    let quote = Data.quotes[Math.floor(Math.random() * Data.quotes.length) - 1];
    res.send({
        quote: quote,
        options: returnArr(quote)
    });
});

app.listen(3000, () => {
    console.log('Server listening on port 3000');
});