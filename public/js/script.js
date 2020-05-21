let itemsToDelete = []

$('input[type="checkbox"]').click((event)=>{
    checkBoxID = (event.currentTarget.defaultValue);
    if(event.currentTarget.checked == true){
        itemsToDelete.push(checkBoxID);
    }else if(event.currentTarget.checked == false){
        itemsToDelete = removeArrayItem(itemsToDelete, checkBoxID);
    }else{
        console.log("Checkbox error. Not true or false. " + checkBoxID)
    }
    console.log(itemsToDelete);
})

$('#trash').click((event)=>{
    const pageName = ($('#trash')[0].value);
    $.ajax({
        url:'/list/deleteitem',
        type: 'DELETE',
        data: {itemsToDelete, pageName},
        proccessData: false,
        success: function(result){
            console.log(result);
        }
    })

})


//Remove item from an array by value.
function removeArrayItem(array, toRemove){
    copyOfArray = array;
    array = []
    copyOfArray.forEach(element => {
        if(element != toRemove){
            array.push(element)
        }else{
            //item not added to array
        }
    });
    return array;
}