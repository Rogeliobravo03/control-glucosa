let currentType="";

function getRecords(){
return JSON.parse(
localStorage.getItem("glucose")
|| "[]"
);
}

function saveRecords(records){
localStorage.setItem(
"glucose",
JSON.stringify(records)
);
}

function saveType(type){

const value = prompt(
"Ingresa glucosa mg/dL"
);

if(!value) return;

const records = getRecords();

records.push({
date:new Date().toLocaleString(),
type:type,
value:value
});

saveRecords(records);

render();
}

function render(){

    const records = getRecords();

    const div = document.getElementById("records");

    div.innerHTML = "";

    [...records].reverse().forEach((r, reverseIndex) => {

        const realIndex = records.length - 1 - reverseIndex;

        div.innerHTML += `
        <div class="record">

            <b>${r.type}</b><br>
            ${r.value} mg/dL<br>
            ${r.date}

            <div style="margin-top:10px;">
                <button onclick="editRecord(${realIndex})">
                    ✏️ Editar
                </button>

                <button onclick="deleteRecord(${realIndex})">
                    🗑️ Eliminar
                </button>
            </div>

        </div>
        `;
    });
}
function deleteRecord(index){

    const records = getRecords();

    const trash = getTrash();

    trash.push(records[index]);

    saveTrash(trash);

    records.splice(index,1);

    saveRecords(records);

    render();

    alert("Registro enviado a papelera");
}

function exportCSV(){

const records = getRecords();

let csv =
"Fecha,Tipo,Glucosa\n";

records.forEach(r=>{

csv +=
`${r.date},${r.type},${r.value}\n`;

});

const blob =
new Blob([csv],{
type:"text/csv"
});

const a =
document.createElement("a");

a.href =
URL.createObjectURL(blob);

a.download =
"glucosa.csv";

a.click();
}

function voiceCapture(){

    const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;

    if(!SpeechRecognition){
        alert("Reconocimiento de voz no soportado en este dispositivo.");
        return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "es-MX";
    recognition.start();

    recognition.onresult = function(event){

        const text =
            event.results[0][0].transcript.toLowerCase();

        console.log(text);

        let value = text.match(/\d+/);

        if(!value){
            alert("No pude detectar la glucosa.");
            return;
        }

        value = parseInt(value[0]);

        let type = "";

        if(text.includes("antes desayuno"))
            type = "Antes desayuno";

        else if(text.includes("después desayuno") || text.includes("despues desayuno"))
            type = "Después desayuno";

        else if(text.includes("antes comida"))
            type = "Antes comida";

        else if(text.includes("después comida") || text.includes("despues comida"))
            type = "Después comida";

        else if(text.includes("antes cena"))
            type = "Antes cena";

        else if(text.includes("después cena") || text.includes("despues cena"))
            type = "Después cena";

        if(type === ""){
            alert(
                "Di algo como: Antes desayuno 95"
            );
            return;
        }

        const records = getRecords();

        records.push({
            date: new Date().toLocaleString(),
            type: type,
            value: value
        });

        saveRecords(records);

        render();

        alert(
            `Guardado: ${type} - ${value} mg/dL`
        );
    };

    recognition.onerror = function(e){
        alert(
            "Error reconocimiento voz: " + e.error
        );
    };
}
function exportExcel(){

    const records =
    getRecords();

    const ws =
    XLSX.utils.json_to_sheet(records);

    const wb =
    XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
        wb,
        ws,
        "Glucosa"
    );

    XLSX.writeFile(
        wb,
        "Control_Glucosa.xlsx"
    );
}
function editRecord(index){

    const records = getRecords();

    const current = records[index];

    const newValue = prompt(
        "Editar glucosa",
        current.value
    );

    if(newValue === null){
        return;
    }

    records[index].value = newValue;

    saveRecords(records);

    render();
}

function getTrash(){
    return JSON.parse(
        localStorage.getItem("glucoseTrash")
        || "[]"
    );
}

function saveTrash(trash){
    localStorage.setItem(
        "glucoseTrash",
        JSON.stringify(trash)
    );
}
function restoreRecord(index){

    const trash = getTrash();

    const records = getRecords();

    records.push(trash[index]);

    saveRecords(records);

    trash.splice(index,1);

    saveTrash(trash);

    renderTrash();
}

function emptyTrash(){

    if(
        confirm(
            "Eliminar definitivamente todos los registros?"
        )
    ){

        localStorage.removeItem(
            "glucoseTrash"
        );

        renderTrash();
    }
}

function renderTrash(){

    const trash =
    getTrash();

    const div =
    document.getElementById("trash");

    div.innerHTML = "<h2>Papelera</h2>";

    trash.forEach((r,index)=>{

        div.innerHTML += `
        <div class="record">

            ${r.type}<br>
            ${r.value} mg/dL

            <br><br>

            <button
                onclick="restoreRecord(${index})">
                Restaurar
            </button>

        </div>
        `;
    });
}

render();

if('serviceWorker' in navigator){
navigator.serviceWorker.register(
'sw.js'
);
}
