

import {saveBittrexTransaction} from "./Exchanges/Bittrex.js";
import {saveBinanceTransaction} from "./Exchanges/Binance.js";
import {saveCoinbaseTransaction} from "./Exchanges/Coinbase.js";
import {calculate} from "./Calculator.js";

let allTransactions = [];

function handleInput(event)
{
    let exchange = event.target.id;
    let fileInput = document.getElementById(exchange.substring(0,exchange.length-1));
    fileInput.style.backgroundColor = "#c6e9ff";
    fileInput.style.borderColor = "#79ccff";
    document.body.style.cursor  = 'wait';
    let file = document.getElementById(exchange);

    if(file.files.length)
    {
        let reader = new FileReader();

        reader.onload= function(e)
        {
            let content = e.target.result;
            let result = getTransactions(exchange, content);
            console.log(result);
        };

        reader.readAsBinaryString(file.files[0]);

    }
    document.body.style.cursor  = 'default';

}

function getTransactions(exchange, content)
{
    if(exchange == "bittrex")
    {
        return saveBittrexTransaction(content);
    }
    else if(exchange == "binance")
    {
        return saveBinanceTransaction(content);
    }
    else if(exchange == "coinbase")
    {
        return saveCoinbaseTransaction(content);
    }
}

function startCalculation()
{
    console.log(allTransactions)
}

document.getElementById("bittrex").addEventListener("change", handleInput, false);
document.getElementById("submit-btn").addEventListener("click", startCalculation, false);