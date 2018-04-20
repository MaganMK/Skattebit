import {saveBittrexTransaction} from "./Exchanges/Bittrex.js";
import {saveBinanceTransaction} from "./Exchanges/Binance.js";
import {saveCoinbaseTransaction} from "./Exchanges/Coinbase.js";
import {calculate} from "./Calculator.js";
import {saveGdaxTransaction} from "./Exchanges/Gdax.js";
import {savePoloniexTransaction} from "./Exchanges/Poloniex.js"

let saveCount = 0;
let fileCount = 0;

var txDiv = document.getElementById("tx-table-div");
var selector = document.getElementById("year-selector");
var calcBtn = document.getElementById("submit-btn");
calcBtn.disabled = true;
txDiv.style.display = "none";

var comingSoon = document.getElementById("komme");
var comingSoonFile = document.getElementById("kommer");
comingSoonFile.disabled = true;
comingSoon.style = "background-color: #f7f7f7; border: solid #dbdbdb;";

setGray(selector);
selector.disabled = true;

function setGreen(element) {

    element.style = "background-color: #c5ffc4; border: solid #78d877;";
}

function setGray(element) {
    element.style = "background-color: #f7f7f7; border: solid #dbdbdb;";
}

function setYellow(element) {
    element.style = "background-color: #fff87f; border: solid ##e8de3a;";
}

function handleInput(event)
{
    fileCount++;
    let exchange = event.target.id;
    let fileInput = document.getElementById(exchange.substring(0,exchange.length-1));
    setGreen(fileInput);
    document.body.style.cursor  = 'wait; !important';
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
    selector.disabled = false;
    if (fileCount == 1){
        setYellow(selector);
    }

}

function getAllTransactions() {
    let txs = [];
    for (let i = 0; i < saveCount; i++) {
        txs.push.apply(txs, JSON.parse(sessionStorage.getItem(i)));
    }
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
    else if(exchange == "gdax")
    {

        return saveGdaxTransaction(content);
    }
    else if(exchange == "poloniex")
    {
        return savePoloniexTransaction(content);
    }
}



function startCalculation()
{
    let result = [];
    let dropdown = document.getElementById("year-selector");
    let year = dropdown.options[dropdown.selectedIndex].value;
    let txs = getAllTransactions();

    result = calculate(year, txs);
    result[0] = Math.round(result[0]);
    result[1] = Math.round(result[1]);
    result[2] = Math.round(result[2]);
    let tot_income = result[0] + result[1];

    let green = "#c5ffc4";
    let greenBorder = "#78d877";
    let red = "#ff8c93";
    let redBorder = "#ed444f";
    let box1Color = result[0] >= 0 ? green : red;
    let box1Border = result[0] >= 0 ? greenBorder : redBorder;
    let box2Color = result[1] >= 0 ? green : red;
    let box2Border = result[1] >= 0 ? greenBorder : redBorder;
    let box4Color = tot_income >= 0 ? green : red;
    let box4Border = tot_income >= 0 ? greenBorder : redBorder;

    box1.style.backgroundColor = box1Color;
    box1.style.border = "solid " + box1Border;

    box2.style.backgroundColor = box2Color;
    box2.style.border = "solid " + box2Border;

    box3.style.backgroundColor = green;
    box3.style.border = "solid " + greenBorder;

    box4.style.backgroundColor = box4Color;
    box4.style.border = "solid " + box4Border;

    let chosen = new Date("12/31/" + year);
    let now = new Date();
    let nowString = "Balanse " + addZero(now.getDate()) + "/" + addZero(now.getMonth() + 1) + "/" + year;
    let dateText = (chosen.getTime() > now.getTime() ? nowString : "Balanse 31/12/" + year);
    document.getElementById("balance-header").innerText = dateText;

    
    document.getElementById("filled").innerText = "\n\n\n" + result[0] + " kr";
    document.getElementById("unfilled").innerText = "\n\n\n" + result[1] + " kr";
    document.getElementById("income").innerText = "\n\n\n" + tot_income + " kr";
    document.getElementById("balance").innerText = "\n\n\n" + result[2] + " kr";
    document.body.style.cursor  = 'default';
}

document.getElementById("bittrex").addEventListener("change", handleInput, false);
document.getElementById("binance").addEventListener("change", handleInput, false);
document.getElementById("coinbase").addEventListener("change", handleInput, false);
document.getElementById("gdax").addEventListener("change", handleInput, false);
document.getElementById("poloniex").addEventListener("change", handleInput, false);
document.getElementById("submit-btn").addEventListener("click", startCalculation, false);

function getTransactionStrings(txs) {
    let res = [];
    for (let i in txs)
    {
        res.push(txs[i].representation);
    }
    return res;
}

function createTable(txs, exchange)
{
    var fileInput = document.getElementById(exchange.substring(0,exchange.length-1));
    //Sorterer for mer oversikt i tabell, mulig det krever litt for mye tid
    txs.sort(function(txa, txb)
    {
        return new Date(txa.date).getTime() - new Date(txb.date).getTime();
    });
    let table = document.getElementById("transaction-table");
    let transactions = getTransactionStrings(txs);
    $("#transaction-table tr").remove();
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

    setGreen(fileInput);
    document.body.style.cursor  = 'default';
}

selector.addEventListener("change", function() {
    let val = selector.options[selector.selectedIndex].value;
    let validYears = ["2015", "2016", "2017", "2018"];
    if (validYears.indexOf(val) >= 0) {
        setGreen(selector);
        setGreen(calcBtn)
        calcBtn.disabled = false;
    }
});

function addZero(number)
{
  return number < 10 ? "0" + number : number;
}
