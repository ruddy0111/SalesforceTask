({
    init: function (cmp, event, helper) {
        cmp.set("v.options",[
            {label : "Recently Viewed", value:"recentlyContacts"},
            {label : "All Contacts", value:"allContacts"},
            {label : "Birthdays This Month", value:"birthdaysThisMonth"},
            {label : "My Contacts", value:"myContacts"},
            {label : "New Last Week", value:"newLastWeek"},
            {label : "New This Week", value:"newThisWeek"}
        ]);
        var actions = [
            { label: 'Edit', name: 'edit' },
            { label: 'Delete', name: 'delete' },
        ]
            cmp.set("v.columns", [
            {label:"Name", sortable:"true", fieldName:"linkName", type:"url",typeAttributes: {
            label: {
            fieldName: 'Name'
            },
            target: '_blank'
            }
            },
            {label:"Account Name", sortable:"true", fieldName:"AccountlinkName", type:"url", typeAttributes: {
            label: {
            fieldName: 'AccountName'
            }, 
            target: '_blank'
            }
            },
            {label:"Title", sortable:"true", fieldName:"Title", type:"text"},
            {label:"Phone", fieldName:"Phone", type:"phone"},
            {label:"Email", fieldName:"Email", type:"email"},
            {label:"Contact Owner Alias", fieldName:"Owner.Alias", type:"text", sortable : "true"},
            {type : "action", typeAttributes: {rowActions: actions}}
        ]);
        
        var action = cmp.get("c.getContacts");
        action.setCallback(this, function(response){
            var state = response.getState()
            if (state === "SUCCESS") {
                var data = response.getReturnValue();
                data.forEach(function(task){
                    try{
                        task.linkName = '/' + task.Id;
                        
                        
                        if(task.AccountName!=null){
                            task.AccountName = task.Account.Name;
                            task.AccountlinkName = '/' + task.AccountId;
                        }
                        task["Owner.Alias"] = task.Owner.Alias;
                    }catch(e){}
                });
                console.log(data);
                cmp.set("v.countItem",data.length);
                cmp.set("v.data", data);
            }
        });
        $A.enqueueAction(action);
    }
    
    ,updateColumnSorting: function (cmp, event, helper) {
        var fieldName = event.getParam('fieldName');
        var sortDirection = event.getParam('sortDirection');
        // assign the latest attribute with the sorted column fieldName and sorted direction
        cmp.set("v.sortedBy", fieldName);
        cmp.set("v.sortedDirection", sortDirection);
        
        if(fieldName === "linkName"){
            fieldName = "Name";
        } else if (fieldName === "AccountlinkName"){
            fieldName = "AccountName";
        }
        cmp.set("v.sortDirection", sortDirection);
        helper.sortData(cmp, fieldName, sortDirection);
    }
    ,handleSuccess : function(cmp, event, helper) {
        var record = event.getParam("response");
        var apiName = record.apiName;
        var myRecordId = record.id; // ID of updated or created record
        console.log(record.id); 
        cmp.find('notifLib').showToast({
            "variant": "success",
            "title": "Contact Created",
            "message": "Record ID: " + event.getParam("id")
        });
        
        location.href = 'https://cunning-unicorn-rz76vm-dev-ed.lightning.force.com/lightning/r/Contact/'+ myRecordId + '/view';
    }
    
    , handleRowAction : function(cmp, event, helper) {
        var selRows = event.getParam('selectedRows');
        cmp.set("v.conDelId", selRows);
        console.log(cmp.get('v.conDelId'));
    }
    , handleRowActions : function (cmp, event, helper) {
        var action = event.getParam('action');
        var row = event.getParam('row');
        cmp.set('v.recordId', row.Id);
        //alert('recordId : ' + cmp.get('v.recordId') );
        //console.log("row.Id is",row.Id);
        switch (action.name) {
            case 'edit':
                var editRecordEvent = $A.get("e.force:editRecord");
                editRecordEvent.setParams({
                    "recordId": row.Id
                });
                
                editRecordEvent.fire();
                break;
            case 'delete':
                var delRecord = row.Id;
                //console.log(delRecord,"나오나");               
                var action = cmp.get("c.deleteOneRecord");
                //console.log("deleteOneRecord: ", action);
                action.setParams({
                    idlist : delRecord
                });
                action.setCallback(this, function(res){               
                    $A.get("e.force:refreshView").fire();
                    cmp.find('notifLib').showToast({
                        "variant": "success",
                        "title": "Contacts Deleted",
                        "message": "Selected Contacts are deleted"
                    });
                });
                $A.enqueueAction(action);
                break;
        }
        
    },
    handleToastEvent : function(component, event, helper) {
        var toastMessageParams = event.getParams();
        var message = toastMessageParams.message;
        
        if (message.includes('Contact') && message.includes('was saved')) {
            // do something here such as reload your component.
        
        
        }
        console.log('asd>>>>>>' + event.getParams().message );
        $A.get('e.force:refreshView').fire();
    }
    , handleClickDel : function (cmp, event, helper) {
        //alert("You clicked Delete" );        
        var delIdList = cmp.get("v.conDelId");
        if(delIdList.length==0){
            cmp.find('notifLib').showToast({
                "title": "No Contacts Selected",
                "message": "Select Contacts to Delete"
            });
        }else{
            var action = cmp.get("c.deleteRecord");
            //console.log("deleteRecord: ", action);
            action.setParams({listId : delIdList});
            action.setCallback(this, function(res){
                
                $A.get("e.force:refreshView").fire();
                cmp.find('notifLib').showToast({
                    "variant": "success",
                    "title": "Contacts Deleted",
                    "message": "Selected Contacts are deleted"
                });
            });
            $A.enqueueAction(action);
        }
        
        
    }
    , searchTable : function(cmp, event, helper) {
        var searchToValue = cmp.get("v.searchValue");
        var action = cmp.get("c.searchController");
        action.setParams({
            searchKey : searchToValue
        });
        action.setCallback(this, function(response){
            var state = response.getState();
            if (state === "SUCCESS") {
                var data = response.getReturnValue();
                if(data==0){
                    cmp.find('notifLib').showToast({
                        "variant": "warning",
                        "title": "No Seach Result",
                        "message": "Try again"
                    });
                }else{
                    data.forEach(function(task){
                        try{
                            task.linkName = '/' + task.Id;
                            task.AccountName = task.Account.Name;
                            task.AccountlinkName = '/' + task.AccountId;                                
                            task["Owner.Alias"] = task.Owner.Alias;
                        }catch(e){}
                        
                    });
                    console.log(data);
                    cmp.set("v.data", data);
                }
            }
            
        });
        $A.enqueueAction(action);
        
    }
    ,createRecord : function (component, event, helper) {
        var createRecordEvent = $A.get("e.force:createRecord");
        createRecordEvent.setParams({
            "entityApiName": "Contact"
        });
        createRecordEvent.fire();
    }
    ,editRecord : function(component, event, helper) {
        
    }
    ,closedbtn: function(cmp, event, helper){
        
        cmp.set("v.isModalOpen", false);
        
    }
    ,showListView: function(cmp, event, helper){
        var listViewOption = event.getParam('value');
        //alert(listViewOption+ " is listViewOption");
        var action;
        switch(listViewOption){
            case "recentlyContacts" :
                action = cmp.get("c.recentlyViewController");
                break;
            case "allContacts" :
                action = cmp.get("c.listAllViewController");
                break;
            case "birthdaysThisMonth" :
                action = cmp.get("c.listViewBirthController");
                break;
            case "myContacts" :
                action = cmp.get("c.listViewMyContactsController");
                break;
            case "newLastWeek" :
                action = cmp.get("c.listViewLastWeekController");
                break;
            case "newThisWeek" :
                action = cmp.get("c.listViewThisWeekController");
                break;
                
        }           
        action.setCallback(this, function(response){
            var state = response.getState();
            if (state === "SUCCESS") {
                var data = response.getReturnValue();
                data.forEach(function(task){
                    try{
                        task.linkName = '/' + task.Id;
                        task.AccountName = task.Account.Name;
                        task.AccountlinkName = '/' + task.AccountId;                                
                        task["Owner.Alias"] = task.Owner.Alias;
                    }catch(e){}
                });
                cmp.set("v.countItem",data.length);
                cmp.set("v.data", data);
                
            }
            
        });
        $A.enqueueAction(action);       
    }
    ,showUpdateTime: function(cmp, event, helper){


        
    }
    
});
