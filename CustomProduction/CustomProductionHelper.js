({
    inIt: function(component, event) {
        component.set("v.isOpen", true); 
    },
    handleEditLoadHelper: function(component, event) {
        console.log("헤더 시점");
        var action = component.get("c.getRecordId");
        action.setParams({
            recordId : component.get("v.recordId") 
        });
        action.setCallback(this, function(response){
            var state = response.getState();
            if(state === "SUCCESS"){
                component.set("v.CustomProductions", true);
                var data = response.getReturnValue();
                console.log("data: ", data);
                component.set("v.CustomProductions", data);
                
            } else {
                component.set("v.CustomProductions", false);
            }
        });
        $A.enqueueAction(action);
        
    },
    //Spinner
    // function automatic called by aura:waiting event  
    showSpinner: function(component, event) {
        // make Spinner attribute true for displaying loading spinner
        console.log("showSpinner"); 
        component.set("v.spinner", true); 
    },
    
    // function automatic called by aura:doneWaiting event 
    hideSpinner : function(component,event){
        // make Spinner attribute to false for hiding loading spinner    
        component.set("v.spinner", false);
        console.log("hideSpinner");
    }
    // End Spinner
     
})
