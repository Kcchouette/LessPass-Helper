function importData() {
  toggle_visibility("importDatas");
  const jsonInput = document.getElementById("lesspass-input").value;
  const linkBase = document.getElementById("lesspass-emplacement").value;
  if (jsonInput) {
    const dataObject = JSON.parse(jsonInput);
    updateLinksAndOutput(dataObject, linkBase);
  }
  toggle_visibility("panel-lesspass-links");
  toggle_visibility("exportDatas");
}

function createData() {
  const jsonOutput = document.getElementById("lesspass-output").value;
  const dataArray = parseJsonOutput(jsonOutput);

  const newEntry = gatherFormData();
  dataArray.push(newEntry);

  const linkBase = document.getElementById("lesspass-emplacement").value;

  updateLinksAndOutput(dataArray, linkBase);

  /* init again */
  resetFormFields();

  addPasswordProfileButton();
}

function gatherFormData() {
  return {
    site: document.getElementById("site").value,
    login: document.getElementById("login").value,
    lowercase: document.getElementById("lowercase").checked,
    uppercase: document.getElementById("uppercase").checked,
    digits: document.getElementById("digits").checked,
    symbols: document.getElementById("symbols").checked,
    length: document.getElementById("length").value,
    counter: document.getElementById("counter").value,
  };
}

function parseJsonOutput(jsonOutput) {
  return jsonOutput ? JSON.parse(jsonOutput) : [];
}

function updateLinksAndOutput(dataArray, linkBase) {
  document.getElementById("lesspass-links").innerHTML = createCards(
    dataArray,
    linkBase,
  );
  document.getElementById("lesspass-output").innerHTML = JSON.stringify(
    dataArray,
    null,
    "\t",
  );
}

function createCards(arr, link) {
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
            <a href="${generateLink(item, link)}" class="has-text-left" target="_blank">
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

const generateLink = (item, link) => {
  const params = new URLSearchParams({
    site: item.site,
    login: item.login,
    lowercase: item.lowercase,
    uppercase: item.uppercase,
    digits: item.digits,
    symbols: item.symbols,
    length: item.length,
    counter: item.counter,
    version: 2,
  });
  return `${link}?${params.toString()}`;
};

function addPasswordProfileButton() {
  toggle_visibility("add-setting");
  toggle_visibility("panel-lesspass-links");
  toggle_visibility("grp-lesspass-output");
}

function toggle_visibility(id) {
  const element = document.getElementById(id);
  element.style.display = element.style.display === "none" ? "" : "none";
}

function resetFormFields() {
  const defaultValues = {
    site: "",
    login: "",
    lowercase: true,
    uppercase: true,
    digits: true,
    symbols: true,
    length: 16,
    counter: 1,
  };

  document.getElementById("site").value = defaultValues.site;
  document.getElementById("login").value = defaultValues.login;
  document.getElementById("lowercase").checked = defaultValues.lowercase;
  document.getElementById("uppercase").checked = defaultValues.uppercase;
  document.getElementById("digits").checked = defaultValues.digits;
  document.getElementById("symbols").checked = defaultValues.symbols;
  document.getElementById("length").value = defaultValues.length;
  document.getElementById("counter").value = defaultValues.counter;
}
