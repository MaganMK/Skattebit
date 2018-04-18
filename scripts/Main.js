

import {saveBittrexTransaction} from "./Exchanges/Bittrex.js";

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
            console.log(content);
            let currentTransactions = saveBittrexTransaction(content);
            console.log(currentTransactions);
            allTransactions.concat(currentTransactions);
        };
        reader.readAsBinaryString(file.files[0]);
    }

}

function startCalculation()
{
    console.log(allTransactions)
}

document.getElementById("bittrex").addEventListener("change", handleInput, false);
document.getElementById("submit-btn").addEventListener("click", startCalculation, false);