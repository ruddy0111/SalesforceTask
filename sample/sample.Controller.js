({
    init: function (cmp, event, helper) {
        cmp.set('v.columns', [
            {label: 'Account Name', fieldName: 'Name', type: 'text'},
            {label: 'Industry', fieldName: 'Industry', type: 'text'},
            {label: 'Rating', fieldName: 'Rating', type: 'text'},
            {label: 'Phone', fieldName: 'Phone', type: 'text'},
            {label:"CreatedDate", fieldName:"CreatedDate", type:"datetime"}
	
        ]);
        
        
        var action = cmp.get('c.getAccounts');
        action.setCallback(this, function(response){
            var state = response.getState();
            //console.log(state);
            if(state == 'SUCCESS' || state == 'DRAFT'){
                cmp.set('v.data', response.getReturnValue());
                
            }
        });
        $A.enqueueAction(action);
        
        
        
    }
    , handleClick : function (cmp, event, helper) {
        alert("You clicked: " );
        
        console.log(cmp.find("AccName_id").get('v.value'));
        console.log(cmp.find("AccIndustry_id").get('v.value'));
        console.log(cmp.find("AccRating_id").get('v.value'));
        console.log(cmp.find("AccPhone_id").get('v.value'));
        
        
        var action = cmp.get('c.AccountHandler');
        action.setParams({
            AccName : cmp.find("AccName_id").get('v.value'),
            AccIndustry : cmp.find("AccIndustry_id").get('v.value'),
            AccRating : cmp.find("AccRating_id").get('v.value'),
            AccPhone : cmp.find("AccPhone_id").get('v.value')
        });
        
        console.log("You clicked: " , action.getParams("v.AccName") );
        //console.log('action : ' , action);
        action.setCallback(this, function(response){
            //console.log(response+' 값');
            var state = response.getState();
            console.log(state);
            
            var init = cmp.get("c.init");
            $A.enqueueAction(init);
        });
        $A.enqueueAction(action);
        

    }
})
