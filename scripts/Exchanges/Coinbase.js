import {Transaction} from "../Transaction.js";


export function saveCoinbaseTransaction(data)
{
    //0 date = 05/06/2017 10:02
    //1 balance
    //2 amount (antall enheter kjøpt av currency = 0.2262
    //3 currency = ETH
    //4 To
    //5 Notes
    //6
    //7
    //Timestamp, Balance, Amount, Currency, To, Notes, Instantly Exchanged,
    //Transfer Total, Transfer Total Currency, Transfer Fee, Transfer Fee Currency,
    //Transfer Payment Method, Transfer ID, Order Price, Order Currency, Order BTC,
    //Order Tracking Code, Order Custom Parameter, Order Paid Out, Recurring Payment ID,
    //Coinbase ID(visit https: // www.coinbase.com / transactions / [ID] in your browser), Bitcoin Hash(visit
    //https: // www.coinbase.com / tx / [HASH] in your browser for more info)
    //05/06/2017 10:02, 0.22623156, 0.22623156, ETH, 592684de2205ad0a29e923da, Bought 0.22623156 ETH for €52.00 EUR.,
    //  false, 52, EUR, 2, EUR, Visa debit ** ** ** ** 0040, 59358e83ae4b985bafce2a36, , , , , , , , 59358e8b79b72ea963dad41f,
    let transactions = [];
    data = data.slice(5);
    for (let index in data)
    {
        let lines = data[index];
        try{
            if (isTransaction(lines))
            {
                let type = getType(lines[5]);
                let date = createDate(lines[0]);

                let currency = lines[3];
                if (type == "SALE")
                {
                    let sellTransaction = new Transaction(currency, Math.abs(lines[2]), date, true, "Coinbase");
                    transactions.push(sellTransaction);
                }
                else
                {
                    let buyTransaction = new Transaction(currency, Math.abs(lines[2]), date, false, "Coinbase");
                    transactions.push(buyTransaction);
                }
            }
        }
        catch (e) {
            continue;
        }

    }

    return transactions;
}

function isTransaction(lines)
{
    return lines[5].toLowerCase().indexOf("bought") >= 0 || lines[7].length > 0;
}

function getType(notes)
{
    if (notes.toLowerCase().indexOf("bought") >= 0)
    {
        return "BUY";
    }
    else
    {
        return "SALE";
    }
}

function createDate(dateString)
{
    if(dateString.match("-"))
    {
        dateString = dateString.substring(5,7)+ "/" + dateString.substring(8,10)  +"/" + dateString.substring(0,4) + " " + dateString.substring(11,19);
    }
    else
    {
        dateString = dateString.substring(3,5)+ "/" + dateString.substring(0,3)  +"/" + dateString.substring(6,16);
    }
    return new Date(dateString);
}


