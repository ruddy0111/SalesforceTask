({
    sortData: function (cmp, fieldName, sortDirection) {
    var data = cmp.get("v.data");
        // function to return the value stored in the field
        var key = function(a){
            return a[fieldName]
        }
        var reverse = sortDirection == 'asc' ? 1 : -1;
        // to handel number/currency type fields
        if(fieldName == "Phone"){
            data.sort(function(a,b){
                var a = key(a) ? key(a) : '';
                var b = key(b) ? key(b) : '';
                return reverse * ((a>b) - (b>a));
            });     
    } else{ // to handel text type fields

            data.sort(function(a,b){
                // To handle null values , uppercase records during sorting
                var a = key(a) ? key(a).toLowerCase() : '';
                var b = key(b) ? key(b).toLowerCase() : '';
                return reverse * ((a>b) - (b>a));
            });
        }
        cmp.set("v.data", data);
    }
    
})
