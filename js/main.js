function importData() {
  toggle_visibility("importDatas");
  const json = document.getElementById("lesspass-input").value;
  const link = document.getElementById("lesspass-emplacement").value;
  if (json) {
    const obj = JSON.parse(json);
    document.getElementById("lesspass-links").innerHTML = cardCreation(
      obj,
      link,
    );
    document.getElementById("lesspass-output").innerHTML = JSON.stringify(
      obj,
      null,
      "\t",
    );
  }
  toggle_visibility("panel-lesspass-links");
  toggle_visibility("exportDatas");
}

function createData() {
  const json = document.getElementById("lesspass-output").value;
  let obj;
  if (json) {
    obj = JSON.parse(json);
  } else {
    obj = new Array();
  }

  const site = document.getElementById("site").value;
  const login = document.getElementById("login").value;
  const lowercase = document.getElementById("lowercase").checked;
  const uppercase = document.getElementById("uppercase").checked;
  const digits = document.getElementById("digits").checked;
  const symbols = document.getElementById("symbols").checked;
  const length = document.getElementById("length").value;
  const counter = document.getElementById("counter").value;

  const nObject = {
    site: site,
    login: login,
    lowercase: lowercase,
    uppercase: uppercase,
    digits: digits,
    symbols: symbols,
    length: length,
    counter: counter,
  };
  obj.push(nObject);
  const link = document.getElementById("lesspass-emplacement").value;
  document.getElementById("lesspass-links").innerHTML = cardCreation(obj, link);
  document.getElementById("lesspass-output").innerHTML = JSON.stringify(
    obj,
    null,
    "\t",
  );

  /* init again */
  document.getElementById("site").value = "";
  document.getElementById("login").value = "";
  document.getElementById("lowercase").checked = true;
  document.getElementById("uppercase").checked = true;
  document.getElementById("digits").checked = true;
  document.getElementById("symbols").checked = true;
  document.getElementById("length").value = 16;
  document.getElementById("counter").value = 1;

  addPasswordProfileButton();
}

function cardCreation(arr, link) {
  let data = "";

  arr.forEach((item, index) => {
    // Start a new row every three items
    if (index % 3 === 0) {
      data += '<div class="panel-block columns">';
    }

    data += `
      <div class="column is-one-third">
        <div class="card">
          <header class="card-header">
            <p class="card-header-title is-uppercase is-clipped">${item.site}</p>
          </header>
          <div class="card-content">
            <div class="content">
              <div class="field is-horizontal">
                <div class="field-label is-small">
                  <label class="label has-text-grey-light">Login:</label>
                </div>
                <div class="field-body">
                  <div class="control">
                    <input class="input is-small" type="text" value="${item.login}" readonly>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <footer class="card-footer">
            <div class="card-footer-item">
              <a href="${link}/?passwordProfileEncoded=${lesspassProfileToLesspassBase64(
                item.login,
                item.site,
                item.uppercase,
                item.lowercase,
                item.digits,
                item.symbols,
                item.length,
                item.counter,
              )}" class="has-text-left" target="_blank">
                  LessPass Link <span class="icon">&#10093;</span>
              </a>
            </div>
          </footer>
        </div>
      </div>
      `;
    // Close the row after three items or at the end of the array
    if ((index + 1) % 3 === 0 || index + 1 === arr.length) {
      data += "</div>";
    }
  });

  return data;
}

function lesspassProfileToLesspassBase64(
  login,
  site,
  uppercase,
  lowercase,
  digits,
  symbols,
  length,
  counter,
) {
  const obj = {
    login: login,
    site: site,
    uppercase: uppercase,
    lowercase: lowercase,
    digits: digits,
    symbols: symbols,
    length: length,
    counter: counter,
    version: 2,
  };
  return encodeURIComponent(btoa(JSON.stringify(obj)));
}

function addPasswordProfileButton() {
  toggle_visibility("add-setting");
  toggle_visibility("panel-lesspass-links");
  toggle_visibility("grp-lesspass-output");
}

function toggle_visibility(id) {
  let e = document.getElementById(id);
  if (e.style.display == "none") e.style.display = "";
  else e.style.display = "none";
}
