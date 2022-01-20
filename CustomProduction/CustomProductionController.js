({
    doInit : function(component, event, helper) {
        helper.inIt(component, event);
        /*
        var createRecordEvent = $A.get("e.force:createRecord");
        createRecordEvent.setParams({
            "entityApiName": "CustomProduction__c"
        });
        createRecordEvent.fire();
        */
    },
    handleEditLoad : function(component, event, helper){
        helper.handleEditLoadHelper(component, event);
        console.log("handleEditLoad");
    },
    closeModel: function(component, event, helper) {
        component.set("v.isOpen", false);
        var homeEvent = $A.get("e.force:navigateToObjectHome");
        homeEvent.setParams({
            "scope": "CustomProduction__c"
        });
        homeEvent.fire();
    },
    handleSubmit: function(component, event, helper) {
        helper.showSpinner(component, event);
        component.set("v.buttonDisable", true);
        
        //var fields = event.getParam('fields');
        //fields.Id = component.get("v.recordId");
        //console.log(fields.id+"fields id");
        //component.find('recordEditForm').submit(fields);
        
        /*
        if(component.get("v.handleSuccessed")===true){
            
        }
        
        event.preventDefault();
        var fields = event.getParam('fields');
        //console.log('test ', fields);
        var recordName = fields.Name;
        console.log(recordName,"recordName");
        
        var action = cmp.get("c.getRecordName");
        console.log("getRecordName: ", action);
        action.setParams({
            getRecordName : recordName
        });
        action.setCallback(this, function(response){
            if(response.getReturnValue()===getRecordName){
                
            }
            var state = response.getState()
            if (state === "SUCCESS") {
                fields.Id = component.get("v.recordId");
                console.log(fields.id+"fields id");
                component.find('recordEditForm').submit(fields);
                if(component.get("v.handleSuccessed")===true){
                    component.set("v.buttonDisable", true);
                }
                
            }
        });
        $A.enqueueAction(action);
        */
        
    },
    handleSuccess : function(component,event,helper) {      
        
        helper.hideSpinner(component, event);
        console.log('handleSuccess :::');
        //$A.get('e.force:refreshView').fire();
        
        // Return to the contact page and
        // display the new case under the case related list
        
        var record = event.getParam("response");
        var apiName = record.apiName;
        var myRecordId = record.id; // ID of updated or created record
        
        var navService = component.find("navService");        
        var pageReference = {
            "type": 'standard__recordPage',         
            "attributes": {              
                "recordId": myRecordId,
                "actionName": "view",               
                "objectApiName":apiName              
            }        
        };
        
        component.set("v.pageReference", pageReference);
        
        var pageReference = component.get("v.pageReference");
        navService.navigate(pageReference); 
        //console.log("navService", navService);
        
    }, 
    handleError : function(component,event,helper) {
        helper.hideSpinner(component, event);

        var errors = event.getParams();
        console.log("response", JSON.stringify(errors));
        component.set("v.buttonDisable", false);
    },
    saveAndNew: function(component,event,helper) {      
        component.set("v.handleSuccessed", false);
        helper.inIt(component, event);
    }
    
})
