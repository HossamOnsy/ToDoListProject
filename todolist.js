
var toDoListItem = function (title, owner) {
    this.title = title;
    this.owner = owner;


    this.spann = document.createElement("SPAN")
    this.textInPar = document.createTextNode(title);
    this.spann.appendChild(this.textInPar);
    this.spann.id = "ID_" + "P_" + title;

   

    this.checkBox = document.createElement("input");
    this.checkBox.type = "checkbox";
    this.checkBox.name = "name";
    this.checkBox.value = "value";
    this.checkedOrNot = "false"
    this.checkBox.id = "id";
    this.checkBox.style = "margin:5px;float:right";

    this.deleteBtn = document.createElement("IMG");
    this.deleteBtn.id = title;
    this.deleteBtn.style = "margin-left:10px;width:25px;height:25px;float:right;";
    this.deleteBtn.src =  "delete.png"

    this.div = document.createElement("DIV");
    this.div.style = "margin:5px;display:block;width:250px";
    this.div.appendChild(this.spann);
    this.div.appendChild(this.deleteBtn);
    this.div.appendChild(this.checkBox);

}


var add_Task = document.getElementById("add_Task");
var inp = document.getElementById("inp");
var divDone = document.getElementById("divDone");
var divToDo = document.getElementById("divToDo");
var search_inp = document.getElementById("search_inp");
var search_btn = document.getElementById("search_btn");
var mainPageSection = document.getElementById("MainPageSection");
var addUserSection = document.getElementById("AddUserSection");
var mainPageAnchor = document.getElementById("mainPageAnchor");
var addUserPageAnchor = document.getElementById("addUserPageAnchor");
var add_user = document.getElementById("add_user");
var inpOfNewUser = document.getElementById("inpOfNewUser");
var alreadExistsHeader = document.getElementById("alreadExistsHeader");
var addedSuccessfullyHeader = document.getElementById("addedSuccessfullyHeader");
var usersSelection = document.getElementById("usersSelection");

var toDoList = [];

add_Task.addEventListener("click", addingTask);
search_btn.addEventListener("click", startSearching);
mainPageAnchor.addEventListener("click", showMainPage);
addUserPageAnchor.addEventListener("click", showAddUserPage);
add_user.addEventListener("click", addUser);
usersSelection.addEventListener("change", usersSelectionChanged);


function showMainPage() {
    showfirstHideSecond(mainPageSection,addUserSection);
}

function showAddUserPage() {
    showfirstHideSecond(addUserSection,mainPageSection);
}

function showfirstHideSecond(target1,target2){
    target1.style.display = "block";
    target2.style.display = "none";

}
if(localStorage.length==0){
    usersSelection.innerHTML+="<option value=\"H\">\"H\"</option>";
    usersSelection.selectedIndex = 0;
    toDoList = [];
    var toDo = new toDoListItem("Welcome To List App" ,"H");
    toDo.checkedOrNot=false;
    toDoList.push(toDo);
    localStorage.setItem("H",JSON.stringify(toDoList));
}

function addUser() {
    var notUnique = false
    for (i = 0; i < localStorage.length; i++) {
        if (localStorage.key(i)==inpOfNewUser.value) {
            notUnique = true;
            break
        }
    }

    if (notUnique) {
        showfirstHideSecond(alreadExistsHeader,addedSuccessfullyHeader);
    } else {
        localStorage.setItem(inpOfNewUser.value,inpOfNewUser.value);
        showfirstHideSecond(addedSuccessfullyHeader,alreadExistsHeader);
    }
    getUsersFromLocalStoarge();
    toDoList=[];
    clearDivs();
    getTasksSpecifiedToUser(usersSelection.options[usersSelection.selectedIndex].value);
}

function usersSelectionChanged(){
      
    clearDivs();
    getTasksSpecifiedToUser(usersSelection.options[usersSelection.selectedIndex].value);
}


getUsersFromLocalStoarge();

function getUsersFromLocalStoarge(){
    usersSelection.innerHTML=""
    for (i = 0; i < localStorage.length; i++) {
        
        var temp = localStorage.key(i);
        usersSelection.innerHTML+="<option value=\""+temp+"\">"+temp+"</option>";
    }
    usersSelection.selectedIndex=0;

    // <option value="volvo">Volvo</option>
}

if(localStorage.length<1){
    getTasksSpecifiedToUser("H");
}
    else{
        getTasksSpecifiedToUser(usersSelection.options[usersSelection.selectedIndex].value);
    }
function getTasksSpecifiedToUser(owner){
    
    var retrievedObject = localStorage.getItem(owner);
    retrievedParsedObject = JSON.parse(retrievedObject);
    console.log('retrievedParsedObject: ', retrievedParsedObject);
    toDoList=[];
    if (retrievedParsedObject != null)
        retrievedParsedObject.forEach(element => {
    
            addElementToListInBlock(element.title, owner.value, element.checkedOrNot);
    
        });
}

function deleteCalled(e) {

    var ppDiv = e.target.parentNode.parentNode;
    var pDiv = e.target.parentNode;
    ppDiv.removeChild(pDiv);

    toDoList = toDoList.filter(function (value) {
        return value.title !== pDiv.firstElementChild.textContent;
    });

    localStorage.setItem(usersSelection.options[usersSelection.selectedIndex].value, JSON.stringify(toDoList));

}



function checkBoxChecked(e) {

    var ppDiv = e.target.parentNode.parentNode;
    var pDiv = e.target.parentNode;

    if (ppDiv.id == "divDone") {
        divToDo.appendChild(pDiv);
        pDiv.firstElementChild.style.textDecoration = "";
        alterElementChecked(pDiv, false);
    } else {
        divDone.appendChild(pDiv);
        pDiv.firstElementChild.style.textDecoration = "line-through";
        alterElementChecked(pDiv, true);
    }

}

function alterElementChecked(pDiv, flag) {

    for (var i = 0; i < toDoList.length; i++) {
        if (toDoList[i].title === pDiv.firstElementChild.textContent) {
            toDoList[i].checkedOrNot = flag;

            localStorage.setItem(usersSelection.options[usersSelection.selectedIndex].value , JSON.stringify(toDoList));
            break;
        }
    }

}

function addingTask() {

    addElementToListInBlock(inp.value, usersSelection.options[usersSelection.selectedIndex].value, false, false);
}

function startSearching(e) {

    if (search_inp.value == "") {
        clearDivs();
       
        toDoList.forEach(function (element) {
            addElementToListInBlock(element.title, usersSelection.options[usersSelection.selectedIndex].value, element.checkedOrNot, true)
        });
    } else {
        clearDivs();
        toDoList.forEach(function (element) {
            var s = element.title;
            if (s.toLowerCase().includes(search_inp.value))
                addElementToListInBlock(element.title, usersSelection.options[usersSelection.selectedIndex].value, element.checkedOrNot, true)
        });
    }

}

function clearDivs() {

    divDone.innerHTML = ""
    divToDo.innerHTML = ""
}

function addElementToListInBlock(title, owner, checkedOrNot, searching) {
    if (title !== "") {

        var listItem = new toDoListItem(
            title,
            owner
        );

           
        listItem.deleteBtn.addEventListener("click", deleteCalled);
        listItem.checkBox.addEventListener("change", checkBoxChecked);
      
        if (checkedOrNot) {
            listItem.checkBox.checked = true;
            listItem.spann.style.textDecoration = "line-through";
            listItem.checkedOrNot = true;
            divDone.appendChild(listItem.div);
        } else {
            listItem.checkedOrNot = false;
            divToDo.appendChild(listItem.div);
        }
        if (!searching)
            toDoList.push(listItem);


        if(owner!==undefined)
        localStorage.setItem(owner , JSON.stringify(toDoList));
    }
    inp.value = "";

}