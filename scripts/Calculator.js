export function calculate(year, transactions)
{
    let groups = groupTransactions(transactions);
    let sortedGroups = sortByDate(groups);

    let yearBalance = getYearBalance(sortedGroups, year);
    let incomeResults = calculateIncome(sortedGroups, year);
    let allResults = incomeResults.concat(yearBalance);

    return allResults;
}

function groupTransactions(txs)
{
    let groups = {};
    for (let i in txs)
    {
        let tx = txs[i];
        if (!(tx.name in groups))
        {
            groups[tx.name] = {"sales": [], "buys": []};
        }
        if (tx.isSale)
        {
            groups[tx.name]["sales"].push(tx);
        }
        else
        {
            groups[tx.name]["buys"].push(tx);
        }
    }
    return groups;
}

function sortByDate(groups)
{
    for (let key in groups)
    {
        let sales = groups[key]["sales"];
        let buys = groups[key]["buys"];

        sales.sort(function(txa, txb) {
            return new Date(txa.date).getTime() - new Date(txb.date).getTime();
        });
        buys.sort(function(txa, txb) {
            return new Date(txa.date).getTime() - new Date(txb.date).getTime();
        });
        groups[key]["sales"] = sales;
        groups[key]["buys"] = buys;
    }
    return groups;
}

function calculateIncome(mainGroups, year)
{
    let groups = jQuery.extend({}, mainGroups);
    let filled = 0;
    let unfilled = 0;
    for (let key in groups)
    {
        for (let saleKey in groups[key]["sales"])
        {
            let currentSale = groups[key]["sales"][saleKey];
            let profit = 0;
            for (let buyKey in groups[key]["buys"])
            {
                let currentBuy = groups[key]["buys"][buyKey];
                if (currentSale.quantity > 0)
                {
                    if (new Date(currentBuy.date).getTime() <= new Date(currentSale.date).getTime())
                    {
                        if (currentBuy.quantity >= currentSale.quantity)
                        {
                            profit += currentSale.unitPrice * currentSale.quantity - currentBuy.unitPrice * currentSale.quantity;
                            currentBuy.quantity -= currentSale.quantity;
                            currentSale.quantity = 0;
                        }
                        else
                        {
                            profit += currentSale.unitPrice * currentBuy.quantity - currentBuy.unitPrice * currentBuy.quantity;
                            currentSale.quantity -= currentBuy.quantity;
                            currentBuy.quantity = 0;
                        }
                    }
                }
            }
            if (new Date(currentSale.date).getFullYear() == year)
            {
                filled += profit;
                unfilled += currentSale.quantity * currentSale.unitPrice;
                currentSale.quantity = 0
            }
        }
    }
    return [filled, unfilled];
}

function getYearBalance(groups, year)
{
    let dateString = "12/31/" + year + " 23:59";
    let yearDate = new Date(dateString);
    let balance = 0;
    for (let key in groups)
    {
        let qty = 0.0;
        let sales = groups[key]["sales"];
        let buys = groups[key]["buys"];
        for (let i in buys)
        {
            if (new Date(buys[i].date).getTime() <= new Date(yearDate).getTime())
            {
                qty += parseFloat(buys[i].quantity);
            }
        }
        for (let i in sales)
        {
            if (new Date(sales[i].date).getTime() <= new Date(yearDate).getTime())
            {
                qty -= parseFloat(sales[i].quantity);
            }
        }
        let currencyBalance = calculateUnitPrice(yearDate, key) * qty;
        if (currencyBalance > 0)
        {
            balance += currencyBalance;
        }
    }
    return balance;
}


function calculateUnitPrice(date, currency)
{
    let timestamp = date.getTime()/1000;
    let url = "https://min-api.cryptocompare.com/data/pricehistorical?fsym="
    + currency + "&tsyms=" + "NOK" + "&ts=" + timestamp;
    let res = $.ajax({
            type: "GET",
            url: url,
            cache: false,
            async: false
        }).responseText;
    let json = JSON.parse(res);
    sleepFor(70);
    return json[currency]["NOK"];
}

function sleepFor( sleepDuration ){
    var now = new Date().getTime();
    while(new Date().getTime() < now + sleepDuration){ /* do nothing */ }
}