const estradosMap = {};


function loadCSVData() {
    fetch('Tabela.csv')
        .then(response => response.text())
        .then(data => {
            const lines = data.split('\n');
            const headers = lines[0].split(';');
            const colSizes = headers.slice(2);

            let tamanhoLinha = null;

            for (let i = 1; i < lines.length; i++) {
                const line = lines[i];
                if (!line.startsWith(';') && line.trim() !== '') { 
                    const values = line.split(';');
                    tamanhoLinha = values[0].trim(); 
                }

                if (line.startsWith(';')) {
                    const valoresLinha = line.split(';');
                    const tipo = valoresLinha[1].trim(); 

                    for (let j = 2; j < valoresLinha.length; j++) {
                        const tamanhoColuna = colSizes[j - 2].trim(); 
                        const colMap = estradosMap[tamanhoLinha] || {};
                        const estrado = colMap[tamanhoColuna] || {};

                        
                        const valorConvertido = parseFloat(valoresLinha[j].trim().replace(',', '.'));

                        
                        console.log(`Linha: ${tamanhoLinha}, Tipo: ${tipo}, Tamanho Coluna: ${tamanhoColuna}, Valor Original: ${valoresLinha[j]}, Valor Convertido: ${valorConvertido}`);

                        switch (tipo) {
                            case "Pés":
                                estrado.pes = valorConvertido; 
                                break;
                            case "Alumínios2,50":
                                estrado.aluminio_2_50 = valorConvertido; 
                                break;
                            case "Alumínios1,25":
                                estrado.aluminio_1_25 = valorConvertido; 
                                break;
                            case "Tábuas":
                                estrado.tabuas = valorConvertido; 
                                break;
                            default:
                                console.warn(`Tipo desconhecido: ${tipo}`);
                        }
                        colMap[tamanhoColuna] = estrado;
                        estradosMap[tamanhoLinha] = colMap;
                    }
                }
            }
            console.log(estradosMap);
        })
        .catch(error => console.error('Erro ao carregar o CSV:', error));
}


function searchEstrado() {
    const linha = document.getElementById('linha').value.trim(); 
    const coluna = document.getElementById('coluna').value.trim(); 
    const resultDiv = document.getElementById('result');

    if (estradosMap[linha] && estradosMap[linha][coluna]) {
        const estrado = estradosMap[linha][coluna];
        resultDiv.innerHTML = `
            <strong>Valores Correspondentes:</strong><br>
            Pés: ${estrado.pes || 'N/A'}<br>
            Alumínios 2,50: ${estrado.aluminio_2_50 || 'N/A'}<br>
            Alumínios 1,25: ${estrado.aluminio_1_25 || 'N/A'}<br>
            Tábuas: ${estrado.tabuas || 'N/A'}
        `;
    } else {
        resultDiv.innerHTML = `Nenhum estrado encontrado para a combinação: ${linha} x ${coluna}`;
    }
}

// Configurar eventos
document.getElementById('searchButton').addEventListener('click', searchEstrado);
loadCSVData(); // Carregar os dados do CSV quando a página for carregada
