function mainCtrl() {
	var vm=this;
	vm.data=DATA;
	vm.searchTerm="";
	vm.search=function(person) {
		var search=vm.searchTerm.toLowerCase();
		return (
			person['Förnamn '].toString().toLowerCase().indexOf(search) > -1 ||
			person['Efternamn'].toString().toLowerCase().indexOf(search) > -1 ||
			person['Telefonnummer'].toString().toLowerCase().indexOf(search) > -1 ||
			person['Email'].toString().toLowerCase().indexOf(search) > -1 ||
			person['Tolk'].toString().toLowerCase().indexOf(search) > -1 ||
			person['Transport'].toString().toLowerCase().indexOf(search) > -1 ||
			person['Sjukvård'].toString().toLowerCase().indexOf(search) > -1 ||
			person['Rådgivning'].toString().toLowerCase().indexOf(search) > -1 ||
			person['Andra kunskaper'].toString().toLowerCase().indexOf(search) > -1 
		)
	}
}

angular
	.module('app', [])
	.controller('mainCtrl', mainCtrl);