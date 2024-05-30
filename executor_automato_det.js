int programa(int q, char string){
    if(q == -1 || string.tamanho == 0){
        return q; // caso exista um caracter desconhecido ou acabar a string
    }
    return programa(caminhos(q, string), novaString(string-1)); 
}

char novaString(char string){

}

int caminhos(){

}

int main(){

    // Ler arquivo JSON
    FILE* aut = fopen("arquivo_do_automato.json", "r");

    fclose(aut);


    // Ler arquivo CSV



    int qi;
    char string;

    int estadoFinal = programa(qi, string);

    if (estadoFinal.includes(state)){
        log("\n\n***Accepted***");
    } else {
        log("\n\n___Rejected___");
    }



    // Escrever em um arquivo CSV ou TXT
    FILE* autSaida = fopen("arquivo_de_saida.csv", "w");



    fclose(autSaida);

    return 0;
}