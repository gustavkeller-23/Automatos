
let Caminhos = [];
let timer;

// escrever dados no arquivo csv + como pegar tempo...

const automaton = LerJSON(); // Ler JSON
const qi = automaton.initial; // Initial State
const qf = automaton.final;   // Final State

let arqTeste = [];      // matriz c/ valore de teste
let matrizDelta = [];   // Matriz principal de caminhos
LerTestes();


function LerJSON(){
  const fs = require('fs');
  const info = fs.readFileSync('arquivo_do_automato.json', 'utf8');

  return JSON.parse(info);
}

function LerTestes(){

  const fs = require("fs");
  const readline = require("readline");
  const path = "arquivo_de_testes.csv";
  const readStream = fs.createReadStream(path);
    
  const output = [];

  const readInterface = readline.createInterface({
    input: readStream
  });
    
  readInterface.on("line", (line) => {
    const row = line.split("\n");
    output.push(row);
  });
    
  readInterface.on("close", () => {
    arqTeste = output;
    main();
  });
    
  readInterface.on("error", (err) => {
    console.error("Error reading the CSV file:", err);
  });
}


function main(){

  construirCaminhos();
  ajustarTestes();

  for(let i = 0; i < arqTeste.length; i++){
    let string = arqTeste[i][0];
    let resultado;
    let estadoFinal;
    let interval;
    timer = 0;
    Caminhos = [];

    interval = setInterval(incrementaTimer, 10);

    Caminhos[0] = qi;

    estadoFinal = programa(Caminhos, string);

    if (ehFinal(estadoFinal)){
      console.log("\n\n***Accepted***");
      resultado = 1;
    } else {
      console.log("\n\n___Rejected___");
      resultado = 0;
    }

    clearInterval(interval);

    //EscreverResultados(arqTeste[i][0], arqTeste[i][1], resultado, timer);
  }
}

function incrementaTimer(){
  timer = timer + 1;
}

// ------------------- Definir caminhos do Automato ------------------------ //

function construirCaminhos(){
  let matrizTemp = [];
  for(let i =0; i < automaton.transitions.length; i++)
    matrizTemp.push(automaton.transitions[i].from, automaton.transitions[i].read, automaton.transitions[i].to);

  matrizDelta = organizarMatriz(matrizTemp, 3);
}
function organizarMatriz(array, ajusteSize) {
  const ajuste = [];
  for (let i = 0; i < array.length; i += ajusteSize) {
      ajuste.push(array.slice(i, i + ajusteSize));
  }
  return ajuste;
}

// ------------------------------------------------------------------------- //
// --------------------- Definir matriz dos Testes ------------------------- //

function ajustarTestes(){
  let testeTemp = [];

  for(let i = 0; i < arqTeste.length; i++){
    const textTemp = String(arqTeste[i][0]); 
    const text = textTemp.split(';');
    let text1 = String(text[0]);
    let text2 = parseInt(text[1]);
    testeTemp.push(text1, text2);
  }

  arqTeste = organizarTestes(testeTemp, 2);
}
function organizarTestes(array, ajusteSize) {
  const ajuste = [];
  for (let i = 0; i < array.length; i += ajusteSize) {
      ajuste.push(array.slice(i, i + ajusteSize));
  }
  return ajuste;
}

// ------------------------------------------------------------------------- //


function ehFinal(estado){
  for(let s = 0; s < estado.length; s++){
    for(let f = 0; f < qf.length; f++){
      if(estado[s] === qf[f])
        return 1;  
    }
  }
  return 0;
}

function programa(q, string){
  if(string.length === 0){
    return q; 
  }
  return programa(caminhos(string[0], Caminhos.length), string.substring(1));
}

function caminhos(letra, qtdEstados){
  if(letra !== ' '){
    for(let i = 0; i < matrizDelta.length; i++){
      for(let j = 0; j < qtdEstados; j++){
        if(matrizDelta[i][0] === Caminhos[j]){
          if(matrizDelta[i][1] === letra){
            Caminhos.push(matrizDelta[i][2]);
          }
        } 
      }
    }

    for(let i = 0; i < qtdEstados; i++)
      Caminhos[i] = -1;
  }

  return Caminhos;
}

function EscreverResultados(palavraInput, resultadoEsperado, resultadoFinal, tempo){

  const fs = require("fs");
  const { stringify } = require("csv-stringify");
  const db = require("./db");
  const filename = "arquivo_de_saida.csv";
  const writableStream = fs.createWriteStream(filename);


  const stringifier = stringify({ header: false, columns: null });
  db.each(`select * from migration`, (error, row) => {
    if (error) {
      return console.log(error.message);
    }
    stringifier.write(row);
  });
  stringifier.pipe(writableStream);
  console.log("Finished writing data");
}