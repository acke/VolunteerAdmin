function onOpen(){
 var ui = SpreadsheetApp.getUi();
 //Add menu button to ui
 ui.createMenu('Volunteer Helper')
 //.addItem('Get available voluteer', 'getVolonteer')
 .addItem('Get available for selected time slot in Panel', 'getSelectedForTimeslotPanel')
 //.addItem('Get available for selected time slot', 'getSelectedForTimeslot')
 .addSeparator()
 .addItem('Mark Volunteer as Booked', 'booked')
 .addToUi();
}

var timeMap = {
  "06-16": ["[tidig morgon]", "[förmiddag]", "[eftermiddag]"],
  "10-16": ["[förmiddag]", "[eftermiddag]"],
  "16-20": ["[eftermiddag]", "[kväll]"],
  "20-02": ["[kväll]","[natt]"],
  "22-02": ["[kväll]","[natt]"],
  "02-06": ["[natt]"]
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

function getSelectedForTimeslotPanel(){
  
  //Get the row and column indices of the selected cell
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getActiveSheet();
  // Returns the active cell
  var cell = sheet.getActiveCell();
  var row = cell.getRowIndex();
  var col = cell.getColumn();
  var time = sheet.getRange(row, 1);
  

  var html =  HtmlService
      .createTemplateFromFile('VolList')
      .evaluate()
      .setTitle('List of Volunteers for the selected kompetence area')
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

function fillSlot(name, surname, number){
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getActiveSheet();
  var cell = sheet.getActiveCell();
  var string = (name + surname + number).replace(/\n/g, " ");
  cell.setValue(string);
  cell.setBackground("orange");
}

function getSelectedForTimeslot(){
  
     var ss = SpreadsheetApp.getActiveSpreadsheet();
     var sheet = ss.getActiveSheet();
     // Returns the active cell
     var cell = sheet.getActiveCell();
     var row = cell.getRowIndex();
     var col = cell.getColumn();
     
     var time = sheet.getRange(row, 1).getValue();
     var day = getDay(sheet.getName());

     //query("Fredag [18/9]", "10-13", "Tolk");
     //query(day, time, getColumnHeader(row, col, sheet));
  
  //TODO: Make this generic for each competence.
     var volunteers = query(day, time, 'Transport');
     //var volunteers = query(day, time, "VÄRD");
     
     return volunteers;
  
     SpreadsheetApp.getUi().alert("Volunteers for " + time + ", " + day + ": \n\n" + message);
}


function booked(){
  SpreadsheetApp.getUi().alert("Not implemented: mark this volunteer as booked, and save volunteer in experienced database.");
}

function tempQueryWrapper(){
  query("Fredag [18/9]", "10-13", "Transport");
  query("Fredag [18/9]", "10-13", "Transport");
}

function query(day, time, type){
  type = null;
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Formulärsvar 1');
  var values = sheet.getDataRange().getValues();
  var headers = values.shift();
  
  var nameIndex;
  var surIndex;
  var phoneIndex;
  var emailIndex;
  var dayIndices = [];
  var typeIndex;
  for (var i = 0; i < headers.length; i++){
    if (headers[i].indexOf('Förnamn') > -1) {
      nameIndex = i;
    } else if (headers[i].indexOf("Efternamn") > -1) {
      surIndex = i;
    } else if (headers[i].indexOf("Telefonnummer") > -1) { 
      phoneIndex = i;
    } else if (headers[i].indexOf("Email") > -1) { 
      emailIndex = i;
    } else if (headers[i].indexOf(day) > -1) {
      for (var j = 0; j < timeMap[time].length; j++){
        if (headers[i].indexOf(timeMap[time][j]) > -1){
          dayIndices.push(i);
        }
      }
    } else if (type && headers[i].indexOf(type) > -1) {
      typeIndex = i;
    }
  }
  //SpreadsheetApp.getUi().alert("Volunteers for the day: " + day + "\n" + "Volunteers for the day: " + values.length + "\n" + " Type index: " + typeIndex);
  var volunteers = [];
  for(var i=0;i<values.length;i++){
    var v = values[i];
    var volunteer = null;
    for (var j = 0; j < dayIndices.length; j++){
      var dayIndex = dayIndices[j];
      if (v[dayIndex] === "ja" && (!type || v[typeIndex] === "ja")){
        if (!volunteer){
          volunteer = {};
          volunteer.Tid = [headers[dayIndex].split("] ")[1]];
          volunteer.Förnamn = values[i][nameIndex];
          volunteer.Efternamn = values[i][surIndex];
          volunteer.Telefon = "" + values[i][phoneIndex];
          volunteer.Email = values[i][emailIndex];
          volunteers.push(volunteer);
        } else {
          volunteer.Tid.push(headers[dayIndex].split("] ")[1]);
        }
      }
    }
  }

  return volunteers;
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
  return dayName.substring(0,1).toUpperCase() + dayName.substring(1, dayName.length).toLowerCase() + " " + formattedDate;
}

