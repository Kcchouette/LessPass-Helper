function importData() {
	toggle_visibility("importDatas");
	const json = document.getElementById("lesspass-input").value;
	const link = document.getElementById("lesspass-emplacement").value;
	if (json){
		const obj = JSON.parse(json);
		document.getElementById("lesspass-links").innerHTML = cardCreation(obj, link);
		document.getElementById("lesspass-output").innerHTML = JSON.stringify(obj, null, "\t");
	}
	toggle_visibility("panel-lesspass-links");
	toggle_visibility("exportDatas");
}

function createData() {
	const json = document.getElementById("lesspass-output").value;
	let obj;
	if (json) {
		obj = JSON.parse(json);
	}
	else {
		obj = new Array();
	}

	const site = document.getElementById("site").value;
	const login = document.getElementById("login").value;
	const lowercase = document.getElementById("lowercase").checked;
	const uppercase = document.getElementById("uppercase").checked;
	const numbers = document.getElementById("numbers").checked;
	const symbols = document.getElementById("symbols").checked;
	const length = document.getElementById("length").value;
	const counter = document.getElementById("counter").value;

	const nObject = {
		site: site, 
		login: login, 
		lowercase: lowercase, 
		uppercase: uppercase, 
		numbers: numbers, 
		symbols: symbols, 
		length: length, 
		counter: counter
	};
	obj.push(nObject);
	const link = document.getElementById("lesspass-emplacement").value;
	document.getElementById("lesspass-links").innerHTML = cardCreation(obj, link);
	document.getElementById("lesspass-output").innerHTML = JSON.stringify(obj, null, "\t");

	/* init again */
	document.getElementById("site").value = '';
	document.getElementById("login").value = '';
	document.getElementById("lowercase").checked = true;
	document.getElementById("uppercase").checked = true;
	document.getElementById("numbers").checked = true;
	document.getElementById("symbols").checked = true;
	document.getElementById("length").value = 16;
	document.getElementById("counter").value = 1;

	addPasswordProfileButton();
}

function cardCreation(arr, link) {
	let data = '';
	for(i = 0; i < arr.length; ++i) {
		if(i%3==0) {
			data += '<div class="panel-block columns">';
		}
		data += '<div class="column is-one-third"><div class="card"><header class="card-header"><p class="card-header-title is-uppercase is-clipped">' + arr[i].site + '</p></header>';
		data += '<div class="card-content"><div class="content">';
		data += '<div class="field is-horizontal">';
		data += '<div class="field-label is-small"><label class="label has-text-grey-light">Login:</label></div>';
		data += '<div class="field-body"><div class="control"><input class="input is-small" type="text" value="' + arr[i].login + '" readonly></div></div>';
		data += '</div></div></div>';
		data += '<footer class="card-footer"><div class="card-footer-item"><a href="'
			+ link + 'index.html#/'
			+ '?site=' + encodeURIComponent(arr[i].site) 
			+ '&login=' + encodeURIComponent(arr[i].login) 
			+ '&lowercase=' + arr[i].lowercase 
			+ '&uppercase=' + arr[i].uppercase 
			+ '&numbers=' + arr[i].numbers 
			+ '&symbols=' + arr[i].symbols 
			+ '&length=' + arr[i].length 
			+ '&counter=' + arr[i].counter 
			+ '&version=2" class="has-text-left" target="_blank">LessPass Link <span class="icon">&#10093;</span>'
			+ '</a></div></footer>';
		data += '</div></div>';

		if((i+1)%3==0 || (i+1) == arr.length) {
			data += '</div>';
		}
	}
	return data;
}

function addPasswordProfileButton() {
	toggle_visibility('add-setting');
	toggle_visibility("panel-lesspass-links");
	toggle_visibility("grp-lesspass-output");
}

function toggle_visibility(id) {
	let e = document.getElementById(id);
	if(e.style.display == 'none')
		e.style.display = '';
	else
		e.style.display = 'none';
}
