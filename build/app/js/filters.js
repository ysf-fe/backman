app.filter('exampleFilter',function() {
    return function(val) {
        if(val) {
            return ('****' + (val + '').substr(-4));
        }
    };
});