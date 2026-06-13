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

const div =
document.getElementById("records");

div.innerHTML="";

records.reverse().forEach(r=>{

div.innerHTML += `
<div class="record">
<b>${r.type}</b><br>
${r.value} mg/dL<br>
${r.date}
</div>
`;

});
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

alert(
"Tu navegador no soporta voz"
);

return;
}

const recognition =
new SpeechRecognition();

recognition.lang="es-MX";

recognition.start();

recognition.onresult = function(event){

const text =
event.results[0][0].transcript;

alert(
"Escuchado: " + text
);

};
}

render();

if('serviceWorker' in navigator){
navigator.serviceWorker.register(
'sw.js'
);
}
