function onOpen(){
 var ui = SpreadsheetApp.getUi();
 //Add menu button to ui
 ui.createMenu('Volunteer Helper')
 .addItem('Get available voluteer', 'getVolonteer')
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
   SpreadsheetApp.getUi().alert("Time: " + time.getValue() + "\nHeader: " + getColumnHeader(row, col, sheet));; 
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
