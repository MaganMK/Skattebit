

export class Transaction {
  constructor(name, quantity, date, isSale, site) {
    this.name = fixName(name);
    this.quantity = quantity;
    this.isSale = isSale;
    this.date = date;
    this.unitPrice = calculateUnitPrice(this);
    this.totalPrice = this.quantity * this.unitPrice;
    this.site = site;
    console.log("transaksjon: " + quantity + " " + isSale);

    sleepFor(70);

  }

  toString() {
    return this.name + "," + this.date.toString() + "," + this.name + "," + this.quantity + "," + this.unitPrice + "," + this.totalPrice + "," + this.site;
  }

}

function calculateUnitPrice(tx)
{
    let timestamp = tx.date.getTime()/1000;
    let url = "https://min-api.cryptocompare.com/data/pricehistorical?fsym="
    + tx.name + "&tsyms=" + "NOK" + "&ts=" + timestamp;
    let res = $.ajax({
            type: "GET",
            url: url,
            cache: false,
            async: false
        }).responseText;
    let json = JSON.parse(res);
    return json[tx.name]["NOK"];
}

function fixName(name) {
    let fixes = {"ANS": "NEO", "BCC": "BCH"}
    if (name in fixes)
    {
        return fixes[name]
    }
    return name
}

function sleepFor( sleepDuration ){
    var now = new Date().getTime();
    while(new Date().getTime() < now + sleepDuration){ /* do nothing */ }
}
