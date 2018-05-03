import {Transaction} from "../Transaction.js";

export function saveKrakenTransaction(data)
{
    let transactions = [];
    data = data.slice(1);
    for (let index in data)
    {
        let lines = data[index];
        for (let i = 0; i < lines.length; i++) //Fjerner ""
        {
            lines[i] = lines[i].split('"').join('');
        }
        let name = fixName(lines[5]);
        if (!isCrypto(name))
        {
            continue;
        }
        let date = createDate(lines[2]);
        let qty = Math.abs(lines[6]);
        let sale = isSale(lines[3], lines[6]);
        let tx = new Transaction(name, qty, date, sale, "Kraken");
        transactions.push(tx);
    }
    return transactions;
}

function createDate(dateString)
{
    dateString = dateString.substring(5,7) + "/" + dateString.substring(8,10) + "/" + dateString.substring(0,4) + " " + dateString.substring(10,dateString.length);
    return new Date(dateString);
}

function fixName(currency){ //Noen valutaer starter på xyz osv
    if (currency.length == 4)
    {
        return currency.substring(1);
    }
    return currency;
}

function isCrypto(currency) {
    let nonCryptos = ["eur", "usd", "gbp"];
    if (nonCryptos.indexOf(currency.toLowerCase()) == -1)
    {
        return true;
    }
    return false;
}

function isSale(type, amount){
    if (type == "deposit")
    {
        return false;
    }
    if (type == "withdrawal")
    {
        return true;
    }
    if (type == "trade")
    {
        if (amount < 0)
        {
            return true;
        }
        else {
            return false;
        }
    }
}