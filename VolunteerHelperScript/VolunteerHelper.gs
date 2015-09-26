function onOpen(){
 var ui = SpreadsheetApp.getUi();
 //Add menu button to ui
 ui.createMenu('Volunteer Helper')
 .addItem('Get available voluteer', 'getVolonteer')
 .addItem('Get available for selected time slot', 'getSelectedForTimeslot')
 .addSeparator()
 .addItem('Mark Volunteer as Booked', 'booked')
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
  SpreadsheetApp.getUi().alert("Time: " + time.getValue() + "\nHeader: " + getColumnHeader(row, col, sheet) + "\n" + getDay(sheet.getName()));
}

function tempQueryWrapper(){
  query("Fredag [18/9]", "10-13", "Tolk");
}

function query(day, time, type){
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Formulärsvar 1');
  var values = sheet.getDataRange().getValues();
  var headers = values.shift();
  
  var nameIndex = headers.indexOf("Förnamn");
  var surIndex = headers.indexOf("Efternamn");
  var phoneIndex = headers.indexOf("Telefonnummer");
  var emailIndex = headers.indexOf("Email");
  var dayIndex = headers.indexOf(day);
  var typeIndex;
  if(type){
    typeIndex = headers.indexOf(type);
  }
  
  var volunteers = [];
  for(var i=0;i<values.length;i++){
    if(typeIndex){
       if(values[i][dayIndex].indexOf(time)>-1 && values[i][typeIndex]){
         volunteer = {};
         volunteer.time = values[i][dayIndex];
         volunteer.name = values[i][nameIndex];
         volunteer.surName = values[i][surIndex];
         volunteer.phone = values[i][phoneIndex];
         volunteer.email = values[i][emailIndex];
         volunteer.competens = values[i][typeIndex];
      
         volunteers.push(volunteer);
       }
    }else{
      if(values[i][dayIndex].indexOf(time)>-1){
         volunteer = {};
         volunteer.time = values[i][dayIndex];
         volunteer.name = values[i][nameIndex];
         volunteer.surName = values[i][surIndex];
         volunteer.phone = values[i][phoneIndex];
         volunteer.email = values[i][emailIndex];
      
         volunteers.push(volunteer);
       }
    }   
  }
  Logger.log(volunteers);
  Logger.log("Nr volunteers: " + volunteers.length);
  SpreadsheetApp.getUi().alert(volunteers);
  
}

function getSelectedForTimeslot(){
  
  //Get the row and column indices of the selected cell
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getActiveSheet();
  // Returns the active cell
  var cell = sheet.getActiveCell();
  var row = cell.getRowIndex();
  var col = cell.getColumn();
  var time = sheet.getRange(row, 1);
  
     /*var ssVol = SpreadsheetApp
        .openById('1YOXKRsaKrCQhKOuJkXnAKyLvIhxu9rhV0OxIEPn6xNI');
      var sheetVol = ssVol.getSheetByName('Formulärsvar 1');
      var valuesVol = sheetVol.getDataRange().getValues();
      var headersVol = valuesVol.shift();*/

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
  
  /*
  var html = HtmlService.createHtmlOutputFromFile('VolunteerList')
     .setSandboxMode(HtmlService.SandboxMode.IFRAME)
     .setTitle('My custom sidebar')
     .setWidth(300);
 SpreadsheetApp.getUi() // Or DocumentApp or FormApp.
    .showSidebar(html);
  */
  
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
    if(sheet.getRange(row, col).getBackground() !== "#ffffff" && sheet.getRange(row, 1).getValue().indexOf('-') < 0){
      found = true;
      var columnHeader = sheet.getRange(row, col).getValue();
    }else{
      row--;
    }
  }
  return columnHeader;
}

function getDay(dayString){
  var dayArray = dayString.split(" ");
  var dayName = dayArray[0];
  var datum = dayArray[1];
  var day = datum.substring(4,6);
  var month = datum.substring(2,4);
  if (day.substring(0,1) == "0") day = day.replace("0", "");
  if (month.substring(0,1) == "0") month = month.replace("0", "");
  var formattedDate = "["+day+"/"+month+ "]";
  return dayName.substring(0,1) + dayName.substring(1, dayName.length).toLowerCase() + " " + formattedDate;
}

function booked(){
  SpreadsheetApp.getUi().alert("Not implemented: mark this volunteer as booked, and save volunteer in experienced database.");
}
