function importData() {
	toggle_visibility("importDatas");
	var json = document.getElementById("lesspass-input").value;
	var link = document.getElementById("lesspass-emplacement").value;
	if (json){
		var obj = JSON.parse(json);
		document.getElementById("lesspass-links").innerHTML = parser(obj, link);
		document.getElementById("lesspass-output").innerHTML = JSON.stringify(obj, null, "\t");
	}
	toggle_visibility("panel-lesspass-links");
	toggle_visibility("exportDatas");
}

function createData() {
	var json = document.getElementById("lesspass-output").value;
	var obj = JSON.parse(json);
	var site = document.getElementById("site").value;
	var login = document.getElementById("login").value;
	var uppercase = document.getElementById("uppercase").checked;
	var lowercase = document.getElementById("lowercase").checked;
	var numbers = document.getElementById("numbers").checked;
	var symbols = document.getElementById("symbols").checked;
	var length = document.getElementById("length").value;
	var counter = document.getElementById("counter").value;

	var nObject = {site:site, login:login, uppercase:uppercase, lowercase:lowercase, numbers:numbers, symbols:symbols, length:length, counter:counter};
	obj.push(nObject);
	var link = document.getElementById("lesspass-emplacement").value;
	document.getElementById("lesspass-links").innerHTML = parser(obj, link);
	document.getElementById("lesspass-output").innerHTML = JSON.stringify(obj, null, "\t");

	addPasswordProfileButton();
}

function parser(arr, link) {
	var data = '';
	for(i = 0; i < arr.length; ++i) {
		data += '<article><h3>' + arr[i].site + '</h3>';
		data += '<a href="' + link + 'index.html#/?site=' + arr[i].site + '&login=' + arr[i].login + '&uppercase=' + arr[i].uppercase + '&lowercase=' + arr[i].lowercase + '&numbers=' + arr[i].numbers + '&symbols=' + arr[i].symbols + '&length=' + arr[i].length + '&counter=' + arr[i].counter + '&version=2" target="_blank">LessPass Link</a>';
		data += '<ul>';
		data += '<li>login: ' + arr[i].login + '</li>';
		data += '</ul>';
		data += '</article>';
	}
	return data;
}


function addPasswordProfileButton() {
	toggle_visibility('add-setting');
	toggle_visibility("panel-lesspass-links");
	toggle_visibility("grp-lesspass-output");
}


function toggle_visibility(id) {
	var e = document.getElementById(id);
	if(e.style.display == 'none')
		e.style.display = '';
	else
		e.style.display = 'none';
}