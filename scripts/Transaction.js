export class Transaction {
  constructor(name, quantity, date, is_sale, site) {
    //this.name = fix_name(name)
    this.name = name;
    this.quantity = quantity;
    this.isSale = isSale;
    this.date = date;
    this.unitPrice = calculateUnitPrice(this);
    this.totalPrice = this.quantity * this.unitPrice;
    this.site = site;
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
    jQuery.when(
        jQuery.getJSON(url)
    ).done( function(json) {
        return json[tx.name]["NOK"];
    });
}
/*
function fix_name(name) {
    let fixes = {"ANS": "NEO", "BCC": "BCH"}
    if name in fixes.keys():
        return fixes[name]
    return name
}
*/
