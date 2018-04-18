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
    data = data.split("\n");
    data = data.slice(5);
    for (let index in data)
    {
        let lines = data[index].split(",");
        if (isTransaction(lines[5]))
        {
            let type = 
        }
    return transactions;
}

function isTransaction(notes):
    return notes.toLowerCase().indexOf("bought") >= 0 || notes.toLowerCase().indexOf("sold");

function get_type(self, notes):
    if "bought" in notes.toLowerCase():
        return "BUY"
    else:
        return "SALE"

from backend.Exchanges.Exchange import Exchange
from backend.Transaction import *

class Coinbase(Exchange):

    #OBS! Vet ikke hvordan csv ser ut ved salg

    def save_transactions(self, data):

        transactions = []
        for line in data:
            if (len(line) > 0):
                lines = line.split(",")
                #Sjekker om "transaksjonen" er en overføring, isåfall er lengden på notes 0?
                if self.is_transaction(lines[5]):
                    type = self.get_type(lines[5])
                    date = self.create_date(lines[0])
                    currency = lines[3]
                    if (type == "SELL"):
                        sell_transaction = Transaction(currency, abs(float(lines[2])), date, True, "Coinbase")
                        transactions.append(sell_transaction)
                    else:
                        buy_transaction = Transaction(currency, abs(float(lines[2])), date, False, "Coinbase")
                        transactions.append(buy_transaction)
        return transactions


    def get_type(self, notes):
        if "Bought" in notes:
            return "BUY"
        else:
            return "SALE"

    def is_transaction(self,notes):
        return "bought" in notes.lower() or "sold" in notes




