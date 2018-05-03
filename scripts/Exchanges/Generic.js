import {Transaction} from "../Transaction.js";

//Må inneholde Tidspunkt (dd/mm/yyyy evt hh:mm:ss)	Valuta	Mengde	Type	Marked
export function saveGenericTransaction(data)
{
    let transactions = [];
    let firstLine =  data[0];

    data = data.slice(1);

    let pointers = {};
    for (let i in firstLine) {
        let val = firstLine[i].toLowerCase();
        val = val.split(' ').join('');
        pointers[val] = i;
    }

    for (let index in data)
    {
        let lines = data[index];

        for (let i in lines)
        {
            if (i != pointers["tidspunkt"])
            {
                lines[i] = lines[i].split(' ').join('');
            }
            else
            {
                if (lines[i][0] == " ")
                {
                    lines[i] = lines[i].substring(1);
                }
            }
        }
        let name = lines[pointers["valuta"]];
        let qty = lines[pointers["mengde"]];
        let type = lines[pointers["type"]].toLowerCase();
        let market = "Egendefinert";
        let date = createDate(lines[pointers["tidspunkt"]]);
        let tx;
        if (type == "kjop" || type == "kjopt" || type == "buy" || type == "bought")
        {
            tx = new Transaction(name, parseFloat(qty), date, false, market);
        }
        else if (type == "salg" || type == "solgt" || type == "sale" || type == "sold")
        {
            tx = new Transaction(name, parseFloat(qty), date, true, market);
        }
        transactions.push(tx);
    }
    return transactions;
}

function createDate(dateString)
{
    dateString = dateString.substring(3,5) + "/" + dateString.substring(0,2) + "/" + dateString.substring(6,dateString.length);
    return new Date(dateString);
}

function sleepFor( sleepDuration ){
    var now = new Date().getTime();
    while(new Date().getTime() < now + sleepDuration){ /* do nothing */ }
}
