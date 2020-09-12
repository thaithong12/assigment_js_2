/**
 * Define Class
 */
class Student {
    constructor(id, name, email) {
      this.id = id ;
      this.name = name ;
      this.email = email ;
    }
  }

/**
 * Create list data 
 */
var arrStudent;
let dataHtmlOrigin;
let isNew ;  
/**
 * Start Code
 */

 
window.onload = function onInit() {
    var no_data = document.getElementById("data");
    dataHtmlOrigin = document.getElementById("data-clone");
    openUserManual();
    isNew = true;
    var storedNames = JSON.parse(localStorage.getItem("students"));
    if (storedNames && storedNames.length  > 0 ) {
        arrStudent = storedNames;
        reloadTable();
    } else {
        arrStudent = [];
        no_data.innerHTML = "<tr class='text-center'><td style='border-bottom: 1px solid #dee2e6;' colspan='5'>No data</td></tr>";
    }
}

 function submitForm() {
    var formData = document.forms["submit_student"];
    var student_id = formData[0].value;
    var student_name = formData[1].value;
    var student_email = formData[2].value;
    const objStu = new Student(student_id,student_name, student_email);

    if (isNew && (validateDataBlank(objStu) == 1 || validateDataExist(objStu)  == 1)) {
        return;
    } else {
        if (validateDataBlank(objStu) == 1) {
            return;
        } else {
            const data = arrStudent.find(item => item.id == objStu.id);
            if (data != null || typeof data != 'undefined') {
                data.name = objStu.name;
                data.email = objStu.email;
                isNew = true;
                reloadTable();
                reloadLocalStore();
                return;
            } else {
                arrStudent.push(objStu);

                var tempHtml = dataHtmlOrigin.cloneNode( true );
                tempHtml.classList.add("mystyle");

                // clone html
                var mssv = tempHtml.getElementsByClassName("mssv")[0];
                var name = tempHtml.getElementsByClassName("name")[0];
                var email = tempHtml.getElementsByClassName("email")[0];

                // set text
                mssv.textContent = student_id;
                name.textContent = student_name;
                email.textContent = student_email;

                // set attr
                var no_data = document.getElementById("data");
                if (arrStudent && arrStudent.length == 1) {
                    no_data.removeChild(no_data.childNodes[0]);
                    no_data.appendChild(tempHtml)
                } 
                if (arrStudent.length > 1) {
                    no_data.appendChild(tempHtml);
                }
                addRowHandlers();
                // reloadTable();
                reloadLocalStore();
            }
           
        }
    }
 }

function validateDataBlank(data) {
    if (data.id == '' || data.name == '' || data.email == '') {
        alert("Pls Input");
        return 1;
    }
 }

 function validateDataExist(data) {
     if (arrStudent && arrStudent.length > 0 ) {
        const listCheck = arrStudent.filter(item => item.id == data.id);
        if (listCheck && listCheck.length > 0) {
            alert("Record Exists Because Id is Exist")
            return 1;
        }
        return 0;
     }
 }

let caseExecute = '';

async function addRowHandlers() {
    var table = document.getElementById("table_data");
    var rows = table.getElementsByTagName("tr");
    for (i = 0; i < rows.length; i++) {
        var currentRow = table.rows[i];
        var cells = currentRow.getElementsByTagName('td');
        currentRow.title = "Click Item For Update";
        // currentRow.onclick = createClickHandler(currentRow);
        for (j = 0 ; j < cells.length; j ++) {
            const currentCell = currentRow.cells[j];
            if(j == 3 && currentCell.textContent == 'Delete') {
                caseExecute = 'delete';
                currentCell.onclick = await createClickHandler(currentRow);         
            } else {
                caseExecute = 'update';
                currentCell.onclick = await createClickHandler(currentRow);
            }
        }
    }
}

var createClickHandler = function(row) {
    if (caseExecute == 'update') {
        return function() { 
            var cell_0 = row.getElementsByTagName("td")[0];
            var cell_1 = row.getElementsByTagName("td")[1];
            var cell_2 = row.getElementsByTagName("td")[2];

            var id = cell_0.innerHTML;
            var name = cell_1.innerHTML;
            var email = cell_2.innerHTML;

            var formData = document.forms["submit_student"];
            formData[0].value = id
            formData[1].value = name
            formData[2].value = email

            formData[0].readOnly = true;
            isNew = false;
        };
    } else {
        return function() { 
            var cell_0 = row.getElementsByTagName("td")[0];
            var id = cell_0.innerHTML;
            var r = confirm("Do you want delete Record "  + id + "?");
            if (r == true) {
                if (arrStudent && arrStudent.length > 0) {
                    arrStudent = arrStudent.filter(item => item.id !== id);
                    reloadTable();
                    reloadLocalStore();
                    console.log(arrStudent);
                }
            }
        };
    }
};


function reloadTable() {
    var no_data = document.getElementById("data");
    if (arrStudent && arrStudent.length > 0 ) {
        while (no_data.lastElementChild) {
            no_data.removeChild(no_data.lastElementChild);
        }
        var tempHtml;
        arrStudent.forEach(item => {
            tempHtml = dataHtmlOrigin.cloneNode( true );
            tempHtml.classList.add("mystyle");
            // clone html
            // var index = tempHtml.getElementsByClassName("index")[0];
            var mssv = tempHtml.getElementsByClassName("mssv")[0];
            var name = tempHtml.getElementsByClassName("name")[0];
            var email = tempHtml.getElementsByClassName("email")[0];

            // set text
            // index.textContent = arrStudent.length;
            mssv.textContent = item.id;
            name.textContent = item.name;
            email.textContent = item.email;

            no_data.appendChild(tempHtml);
        })
    } else {
        no_data.innerHTML = "<tr class='text-center'><td style='border-bottom: 1px solid #dee2e6;' colspan='5'>No data</td></tr>";
    }
    addRowHandlers();
}


function openUserManual() {
    var x = document.getElementById("snackbar");
    x.className = "show";
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
}


function reloadLocalStore() {
    localStorage.clear();
    localStorage.setItem("students", JSON.stringify(arrStudent));
}

 /**
  * End Code
  */
