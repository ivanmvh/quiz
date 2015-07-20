
var x={nombre : "ivan", apellido : "martinez"};
console.log(JSON.stringify(x));

console.log(JSONCIRC(x));

function JSONCIRC (o){
console.log("JSONCIRC");
var cache = [];
JSON.stringify(o, function(key, value) {
    console.log("key->+value--->"+key+"->"+value);
    if (typeof value === 'object' && value !== null) {
        if (cache.indexOf(value) !== -1) {
            // Circular reference found, discard key
            return;
        }
        // Store value in our collection
        cache.push(value);
    }
    console.log("value->"+value);
    return value;
});
}


