const estradosMap = {};

// Função para carregar dados do CSV
function loadCSVData() {
    fetch('Tabela.csv') // Altere para o nome correto do seu CSV
        .then(response => response.text())
        .then(data => {
            const lines = data.split('\n');
            const headers = lines[0].split(';');
            const colSizes = headers.slice(2);

            let tamanhoLinha = null;

            for (let i = 1; i < lines.length; i++) {
                const line = lines[i];
                if (!line.startsWith(';') && line.trim() !== '') { // Verifica se a linha não é vazia
                    const values = line.split(';');
                    tamanhoLinha = values[0].trim(); // Remove espaços
                }

                if (line.startsWith(';')) {
                    const valoresLinha = line.split(';');
                    const tipo = valoresLinha[1].trim(); // Remove espaços extras entre palavras

                    for (let j = 2; j < valoresLinha.length; j++) {
                        const tamanhoColuna = colSizes[j - 2].trim(); // Remove espaços
                        const colMap = estradosMap[tamanhoLinha] || {};
                        const estrado = colMap[tamanhoColuna] || {};

                        // Converte o valor para número, removendo espaços e trocando vírgula por ponto
                        const valorConvertido = parseFloat(valoresLinha[j].trim().replace(',', '.'));

                        // Log para depuração
                        console.log(`Linha: ${tamanhoLinha}, Tipo: ${tipo}, Tamanho Coluna: ${tamanhoColuna}, Valor Original: ${valoresLinha[j]}, Valor Convertido: ${valorConvertido}`);

                        switch (tipo) {
                            case "Pés":
                                estrado.pes = valorConvertido; // Armazena como número
                                break;
                            case "Alumínios2,50":
                                estrado.aluminio_2_50 = valorConvertido; // Armazena como número
                                break;
                            case "Alumínios1,25":
                                estrado.aluminio_1_25 = valorConvertido; // Armazena como número
                                break;
                            case "Tábuas":
                                estrado.tabuas = valorConvertido; // Armazena como número
                                break;
                            default:
                                console.warn(`Tipo desconhecido: ${tipo}`); // Log para tipos desconhecidos
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

// Função para buscar os dados do estrado
function searchEstrado() {
    const linha = document.getElementById('linha').value.trim(); // Remove espaços
    const coluna = document.getElementById('coluna').value.trim(); // Remove espaços
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
