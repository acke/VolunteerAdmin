function onOpen(){
 var ui = SpreadsheetApp.getUi();
 //Add menu button to ui
 ui.createMenu('Volunteer Helper')
 .addItem('Get available voluteer', 'getVolonteer')
 .addSeparator()
 .addItem('Get available for Transporters', 'getTransporters')
 .addToUi();
  
}

function getVolonteer(){
  //Get the row and column indices of the selected cell
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getActiveSheet();
  // Returns the active cell
  var cell = sheet.getActiveCell();
  var row = cell.getRowIndex();
  var col = cell.getColumn();
  //Get the time, wich always is on the far left
  var time = sheet.getRange(row, 1);
  //Print to browser alert box
   SpreadsheetApp.getUi().alert("Time: " + time.getValue() + "\nHeader: " + getColumnHeader(row, col, sheet));
}

function getTransporters(){
  //Get the row and column indices of the selected cell
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getActiveSheet();
  // Returns the active cell
  var cell = sheet.getActiveCell();
  var row = cell.getRowIndex();
  var col = cell.getColumn();
  var time = sheet.getRange(row, 1);
  
     var ssVol = SpreadsheetApp
        .openById('1YOXKRsaKrCQhKOuJkXnAKyLvIhxu9rhV0OxIEPn6xNI');
      var sheetVol = ssVol.getSheetByName('Formulärsvar 1');
      var valuesVol = sheetVol.getDataRange().getValues();
      var headersVol = valuesVol.shift();

//      var fnIndex = headers.indexOf(“Förnamn”);
//      var lnIndex = headers.indexOf(“Efternamn”);
//      var phone = headersVol.indexOf(“Telefonnummer”);
      
     // for (var i=0; i<values.length; i++) {
      //var firstName = values[i][fnIndex];
      //var lastName = values[i][lnIndex ];
      //var phone = values[i][phone];
      //}
  
  var html =  HtmlService
      .createTemplateFromFile('VolList')
      .evaluate()
      .setSandboxMode(HtmlService.SandboxMode.IFRAME);
  SpreadsheetApp.getUi() // Or DocumentApp or FormApp.
      .showSidebar(html);
  
//  var html = HtmlService.createHtmlOutputFromFile('VolunteerList')
 //     .setSandboxMode(HtmlService.SandboxMode.IFRAME)
 //     .setTitle('My custom sidebar')
 //     .setWidth(300);
  // SpreadsheetApp.getUi() // Or DocumentApp or FormApp.
  //    .showSidebar(html);
  
  //Image/button for transporters
  //make a panel
  
  //Query for Transporters

  //List the Transporters for the timeslot to the left.
  
}


function getVolunteers(formObject) {
  //var volunteer = formObject.volunteer;
  //SpreadsheetApp.getUi().alert(volunteer);
  return "test";
}

//Gets the header, based on whether the row above is empty, this wont work however
//Another method has to be found
function getColumnHeader(row, col, sheet){
  var found = false;
  while(!found){
    if(!sheet.getRange(row-1, col).getValue()){
      found = true;
      var columnHeader = sheet.getRange(row, col).getValue(); 
    }else{
      row--;
    }
  }
  return columnHeader;
}

