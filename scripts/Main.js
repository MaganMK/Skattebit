import {saveBittrexTransaction} from "./Exchanges/Bittrex.js";
import {saveBinanceTransaction} from "./Exchanges/Binance.js";
import {saveCoinbaseTransaction} from "./Exchanges/Coinbase.js";
import {calculate} from "./Calculator.js";
import {saveGdaxTransaction} from "./Exchanges/Gdax.js";
import {savePoloniexTransaction} from "./Exchanges/Poloniex.js"
import {saveGenericTransaction} from "./Exchanges/Generic.js"
import {saveKrakenTransaction} from "./Exchanges/Kraken.js";

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
comingSoon.style = "background-color: #f7f7f7; border: solid #dbdbdb; opacity: 0.65;";

setGray(selector);
selector.disabled = true;

var loading = document.getElementById("loadingWrapper");
loading.style.visibility = "hidden";

function setGreen(element) {

    element.style = "background-color: #c5ffc4; border: solid #78d877;";
}

function setGray(element) {
    element.style = "background-color: #f7f7f7; border: solid #dbdbdb;";
}

function setYellow(element) {
    element.style = "background-color: #fffb99; border: solid ##e8de3a;";
}

function handleInput(event)
{
    loading.style.visibility = "visible";

    setTimeout(function () {
        fileCount++;



        let exchange = event.target.id;
        let fileInput = document.getElementById(exchange.substring(0,exchange.length-1));
        document.body.style.cursor  = 'wait; !important';
        let file = document.getElementById(exchange);

        if(file.files.length)
        {
            let reader = new FileReader();


            reader.readAsText(file.files[0], "utf-8");


            reader.onload = function(e)
            {

                try {
                    let content = e.target.result;
                    let transactions = getTransactions(exchange, content);
                    sessionStorage.setItem(saveCount++, JSON.stringify(transactions));
                    let txs = getAllTransactions();
                    createTable(txs, exchange);
                } catch (err) //Catcher om filen er encodet i utf16
                {
                    return;
                    /* Dette må løses på en annen måte, nå ender man i en evig loop om man kommer ned hit
                    reader.readAsText(file.files[0], "utf-16");
                    let content = e.target.result;
                    let transactions = getTransactions(exchange, content);
                    sessionStorage.setItem(saveCount++, JSON.stringify(transactions));
                    let txs = getAllTransactions();
                    createTable(txs, exchange);
                    */
                }
            };

        }
        document.body.style.cursor  = 'default';
        loading.style.visibility = "hidden";
        selector.disabled = false;
        if (fileCount == 1){


            setYellow(selector);
        }
    }, 5);


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
    else if(exchange == "generic")
    {
        return saveGenericTransaction(content);
    }
    else if(exchange == "kraken")
    {
        return saveKrakenTransaction(content);
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
document.getElementById("kraken").addEventListener("change", handleInput, false);
document.getElementById("binance").addEventListener("change", handleInput, false);
document.getElementById("coinbase").addEventListener("change", handleInput, false);
document.getElementById("gdax").addEventListener("change", handleInput, false);
document.getElementById("poloniex").addEventListener("change", handleInput, false);
document.getElementById("generic").addEventListener("change", handleInput, false);
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


$('#generic-info').click(function (e) {
    e.preventDefault();
    let info = "Her kan du laste opp en csv-fil du har laget selv. Den kan for eksempel lages i excel, så lenge den lagres som csv." + "<br>";
    info += "Det er viktig at filen er formatert slik at øverste linje inneholder disse felt-overskriftene:" + "<br>";
    info += "<strong>Tidspunkt, Valuta, Mengde, Type, Marked</strong>" + "<br><br>";
    info += "Tidspunkt skrives på formen dd/mm/åååå tt:mm. Valuta skal bestå av 3 bokstaver (eks: BTC). Mengdetall adskilles med '.'. Type skrives som 'kjop' eller 'salg'." + "<br><br>";
    info += "<strong>Eksempel:</strong>" + "<br>";
    info += "Tidspunkt, Valuta, Mengde, Type, Marked" + "<br>";
    info += "21/04/2018 13:55, BTC, 2.3, Kjop, Bittrex" + "<br>";
    info += "22/04/2018 12:00, ETH, 3.1, Salg, Binance";
    bootbox.alert(info);
});

function sleepFor( sleepDuration ){
    var now = new Date().getTime();
    while(new Date().getTime() < now + sleepDuration){ /* do nothing */ }
}
