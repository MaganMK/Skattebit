

import {saveBittrexTransaction} from "./Exchanges/Bittrex.js";
import {saveBinanceTransaction} from "./Exchanges/Binance.js";
import {saveCoinbaseTransaction} from "./Exchanges/Coinbase.js";
import {calculate} from "./Calculator.js";

let saveCount = 0;

var txDiv = document.getElementById("tx-table-div");


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
            let transactions = getTransactions(exchange, content);
            sessionStorage.setItem(saveCount++, JSON.stringify(transactions));
            let txs = getAllTransactions();
            createTable(txs, exchange);
        };

        reader.readAsBinaryString(file.files[0]);

    }

    document.body.style.cursor  = 'default';

}

function getAllTransactions() {
    let txs = [];
    for (let i = 0; i < saveCount; i++) {
        txs = (JSON.parse(sessionStorage.getItem(i)));
    }
    console.log(txs);
    return txs;
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
    let result = 0;
    let dropdown = document.getElementById("year-selector");
    let year = dropdown.options[dropdown.selectedIndex].value;
    for (let i = 0; i<saveCount; i++)
    {
        let currentTransaction = JSON.parse(sessionStorage.getItem(i));
        console.log(currentTransaction);
        result += calculate(year,currentTransaction);
    }

    result = result.split(",");
    result[0] = Math.round(result[0]);
    result[1] = Math.round(result[1]);
    result[2] = Math.round(result[2]);

    let green = "#c5ffc4";
    let greenBorder = "#78d877";
    let red = "#ff8c93";
    let redBorder = "#ed444f";
    let box1Color = result[0] >= 0 ? green : red;
    let box1Border = result[0] >= 0 ? greenBorder : redBorder;
    let box2Color = result[1] >= 0 ? green : red;
    let box2Border = result[1] >= 0 ? greenBorder : redBorder;

    box1.style.backgroundColor = box1Color;
    box1.style.border = "solid " + box1Border;

    box2.style.backgroundColor = box2Color;
    box2.style.border = "solid " + box2Border;

    box3.style.backgroundColor = green;
    box3.style.border = "solid " + greenBorder;



    document.getElementById("balance-header").innerText = "Balanse 31.12." + year;
    
    document.getElementById("filled").innerText = "\n\n\n" + result[0] + " kr";
    document.getElementById("unfilled").innerText = "\n\n\n" + result[1] + " kr";
    document.getElementById("balance").innerText = "\n\n\n" + result[2] + " kr";
    document.body.style.cursor  = 'default';
}

document.getElementById("bittrex").addEventListener("change", handleInput, false);
document.getElementById("binance").addEventListener("change", handleInput, false);
document.getElementById("coinbase").addEventListener("change", handleInput, false);
document.getElementById("submit-btn").addEventListener("click", startCalculation, false);

function getTransactionStrings(txs) {
    let res = [];
    for (let i in txs)
    {
        console.log(txs[i]);
        res.push(txs[i].toString());
    }
    return res;
}

function createTable(txs, exchange)
{
    var fileInput = document.getElementById(exchange.substring(0,exchange.length-1));
    let transactions = getTransactionStrings(txs);
    console.log(transactions);
    let table = document.getElementById("transaction-table");
    let header = ["#", "Valuta", "Tidspunkt", "Kjøp/Salg", "Kvantitet", "Enhetspris", "Totalpris", "Exchange"];
    let row1 = table.insertRow(0);
    row1.style = "font-weight: bold;";
    for (let i = 0; i < header.length; i++) {
        let cell = row1.insertCell(i);
        cell.innerText = header[i];
    }
    txDiv.style.display = "block";
    let txCount = document.getElementById("tx-count");
    let count = transactions.length;
    txCount.innerText = "Registrerte transaksjoner: " + count;
    for(let i in transactions)
    {
        //lines[4] gir enhetspris
        let lines = transactions[i].split(",");
        var row = table.insertRow(++i);
        if (lines[4] == 0) {
            row.className = "table-danger";
        }
        for(let i = 0; i < lines.length; i++)
        {
            let cell = row.insertCell(i);
            cell.innerText = lines[i];
        }
        let cell = row.insertCell(0);
        cell.innerText = i;
    }

    fileInput.style.backgroundColor = "#e0ffd8";
    fileInput.style.borderColor = "#008927";
    document.body.style.cursor  = 'default';
}