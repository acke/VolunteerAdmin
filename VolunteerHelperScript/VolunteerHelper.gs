function onOpen(){
 var ui = SpreadsheetApp.getUi();
 //Add menu button to ui
 ui.createMenu('Volunteer Helper')
 .addItem('Get all matching time and competence', 'timeAndType')
 .addItem('Get all matching time', 'onlyTime')
 .addItem('Get all matching competence', 'onlyType')
 .addItem('Get all matching day', 'everyone')
 .addSeparator()
 .addItem('Mark Volunteer as Booked', 'booked')
 .addToUi();
}

function timeAndType(){
  getSelectedForTimeslotPanel(true, true);
};
function onlyTime(){
  getSelectedForTimeslotPanel(true, false);
};
function onlyType(){
  getSelectedForTimeslotPanel(false, true);
};
function everyone(){
  getSelectedForTimeslotPanel(false, false);
};

var whatMap = {
  "PLATSANSVARIG": ["[V�rd/Lokalansvarig]"],
  "LOKALSAMORDNING": ["[V�rd/Lokalansvarig]"],
  "INFORMATION": [],
  "VOLONT�RSAM.": ["[V�rd/Lokalansvarig]"],
  "TRANSPORT": ["[K�rkort]", "[Bil]"],
  "VAKT": [],
  "MAT": ["[Kontrak�k/mat]"],
  "SCHEMA": [],
  "CHAUFF�R": ["[K�rkort]", "[Bil]"],
  "LOKAL (NGBG)": ["[V�rd/Lokalansvarig]"],
  "LOKAL (NY)": ["[V�rd/Lokalansvarig]"],
  "LOKAL": ["[V�rd/Lokalansvarig]"],
  "V�RD ARABISKA": ["[Arabiska]"],
  "ARABISKA": ["[Arabiska]"],
  "V�RD FARSI": ["[Farsi ]"],
  "FARSI": ["[Farsi ]"],
  "V�RD DARI": ["[Dari]"],
  "DARI": ["[Dari]"],
  "V�RD": ["[V�rd/Lokalansvarig]"],
  "MATLAGNING": ["[Kontrak�k/mat]"],
  "CAF�": ["[Kontrak�k/mat]"],
  "FREESHOP": ["[Freeshop/resurs]"],
  "HYGIEN": ["Sjukv�rd"],
  "L�KARE": ["Sjukv�rd"],
  "SJUKSK�TERSKA": ["Sjukv�rd"],
  "R�DGIVNING": ["R�dgivning"],
  "RESURSLISTA": ["[Freeshop/resurs]"]
}

var timeMap = {
  "06-10": ["[tidig morgon]", "[f�rmiddag]"],
  "06-12": ["[tidig morgon]", "[f�rmiddag]"],
  "06-16": ["[tidig morgon]", "[f�rmiddag]", "[eftermiddag]"],
  "08-12": ["[tidig morgon]", "[f�rmiddag]"],
  "10-14": ["[f�rmiddag]", "[eftermiddag]"],
  "10-16": ["[f�rmiddag]", "[eftermiddag]"],
  "12-16": ["[eftermiddag]"],
  "14-18": ["[eftermiddag]", "[kv�ll]"],
  "16-20": ["[eftermiddag]", "[kv�ll]"],
  "18-22": ["[kv�ll]"],
  "20-24": ["[kv�ll]"],
  "20-00": ["[kv�ll]","[natt]"],
  "20-02": ["[kv�ll]","[natt]"],
  "20-04": ["[kv�ll]","[natt]"],
  "22-02": ["[kv�ll]","[natt]"],
  "00-08": ["[kv�ll]","[natt]","[tidig morgon]"],
  "02-06": ["[natt]"]
}

function getSelectedForTimeslotPanel(isTime, isType){
  //Get the row and column indices of the selected cell
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getActiveSheet();
  var cell = sheet.getActiveCell();
  var row = cell.getRowIndex();
  var col = cell.getColumn();
  var type = isType ? getColumnHeader(row, col, sheet) : "Anything";
  var appended = '';
  if (isTime) appended += '<div id="time"></div>';
  if (isType) appended += '<div id="type"></div>';
  var html =  HtmlService
      .createTemplateFromFile('VolList')
      .evaluate()
      .setTitle('List of Volunteers for ' + type)
      .append(appended)
      .setSandboxMode(HtmlService.SandboxMode.IFRAME);
  SpreadsheetApp.getUi() // Or DocumentApp or FormApp.
      .showSidebar(html);
}

function getSelectedForTimeslot(isTime, isType){
     Logger.log(isTime + " " + isType);
     var ss = SpreadsheetApp.getActiveSpreadsheet();
     var sheet = ss.getActiveSheet();
     // Returns the active cell
     var cell = sheet.getActiveCell();
     var row = cell.getRowIndex();
     var col = cell.getColumn();
     
     var day = getDay(sheet.getName());
     var time = isTime ? sheet.getRange(row, 1).getValue().split(" ")[0] : null;
     var type = isType ? getColumnHeader(row, col, sheet) : null;
  
     var volunteers = query(day, time, type);
     return volunteers;
}

function query(day, time, type){
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Formul�rsvar 1');
  var values = sheet.getDataRange().getValues();
  var headers = values.shift();
  
  var nameIndex;
  var surIndex;
  var phoneIndex;
  var emailIndex;
  var dayIndices = [];
  var typeIndices = [];
  var filter = type || "";
  for (var i = 0; i < headers.length; i++){
    if (headers[i].indexOf('F�rnamn') > -1) {
      nameIndex = i;
    } else if (headers[i].indexOf("Efternamn") > -1) {
      surIndex = i;
    } else if (headers[i].indexOf("Telefonnummer") > -1) { 
      phoneIndex = i;
    } else if (headers[i].indexOf("Email") > -1) { 
      emailIndex = i;
    } else if (headers[i].indexOf(day) > -1) {
      if (time) {
        for (var j = 0; j < timeMap[time].length; j++){
          if (headers[i].indexOf(timeMap[time][j]) > -1){
            dayIndices.push(i);
          }
        }
      } else {
        dayIndices.push(i);
      }
    } else if (type && whatMap[type].length > 0) {
      for (var j = 0; j < whatMap[type].length; j++){
        if (headers[i].indexOf(whatMap[type][j]) > -1){
          filter += " " +whatMap[type][j];
          typeIndices.push(i);
        }
      }
    }
  }
  //SpreadsheetApp.getUi().alert("Volunteers for the day: " + day + "\n" + "Volunteers for the day: " + values.length + "\n" + " Type index: " + typeIndex);
  var volunteers = [];
  for(var i=0;i<values.length;i++){
    var v = values[i];
    var volunteer = null;
    for (var j = 0; j < dayIndices.length; j++){
      var dayIndex = dayIndices[j];
      if (!volunteer){
        if (v[dayIndex].toLowerCase() === "ja"){
          if (!type || typeIndices.length < 1){
            filter = time != null ? "(Inget filter - alla som kan p� vald tid)" : "(Inget filter - alla som kan p� vald dag)";
            
            volunteer = {};
            volunteer.Tid = [headers[dayIndex].split("] ")[1]];
            volunteer.F�rnamn = values[i][nameIndex];
            volunteer.Efternamn = values[i][surIndex];
            volunteer.Telefon = "" + values[i][phoneIndex];
            volunteer.Email = values[i][emailIndex];
            volunteers.push(volunteer);
          }
          else {
            for (var k = 0; k < typeIndices.length; k++){
              var typeIndex = typeIndices[k];
              if ((headers[typeIndex].toLowerCase() === "sjukv�rd" && v[typeIndex].length > 0 ) || (headers[typeIndex].toLowerCase() === "r�dgivning" && v[typeIndex].length > 0 ) || v[typeIndex].toLowerCase() === "ja"){
                if (!volunteer){
                  volunteer = {};
                  volunteer.Tid = [headers[dayIndex].split("] ")[1]];
                  volunteer.F�rnamn = values[i][nameIndex];
                  volunteer.Efternamn = values[i][surIndex];
                  volunteer.Telefon = "" + values[i][phoneIndex];
                  volunteer["E-mail"] = values[i][emailIndex];
                  if (v[typeIndex].toLowerCase() !== "ja"){
                    volunteer.SPECIFIKT = v[typeIndex];
                  }
                  else {
                    volunteer.SPECIFIKT = [headers[typeIndex].split(" ")[1]];
                  }
                  volunteers.push(volunteer);
                }
                else if (v[typeIndex].toLowerCase() === "ja"){
                  volunteer.SPECIFIKT.push(headers[typeIndex].split(" ")[1]);
                }
              }
            }
          }
        }
      }
      else {
        volunteer.Tid.push(headers[dayIndex].split("] ")[1]);
      }
    }
  }
  if (type && typeIndices.length > 0){
    filter += time != null ? " (vald tid)" : " (alla med vald kompetens)";
    volunteers.sort(function(a,b){
      return b.SPECIFIKT.length - a.SPECIFIKT.length;
    });
  }
  return {
    filter: filter,
    volunteers: volunteers
  };
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

function fillSlot(name, surname, number){
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getActiveSheet();
  var cell = sheet.getActiveCell();
  var string = (name + surname + number).replace(/\n/g, " ");
  cell.setValue(string);
  cell.setBackground("orange");
}
function booked(){
  SpreadsheetApp.getUi().alert("Not implemented: mark this volunteer as booked, and save volunteer in experienced database.");
}
