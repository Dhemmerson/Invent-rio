const githubToken = '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'; // Coloque seu token de acesso pessoal aqui
const repoOwner = 'Dhemmerson'; // Seu nome de usuário no GitHub
const repoName = 'Invent-rio'; // Nome do seu repositório
const filePath = 'mobiliario.json'; // Caminho do arquivo JSON

// Função para carregar os dados do GitHub
async function loadMobiliario() {
    try {
        const response = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`, {
            headers: {
                'Authorization': `token ${githubToken}` // Autenticação
            }
        });

        if (!response.ok) {
            throw new Error(`Erro ao carregar os dados do GitHub: ${response.statusText}`);
        }

        const data = await response.json();
        const content = atob(data.content); // Decodifica o conteúdo base64
        const mobiliario = JSON.parse(content); // Converte para objeto JavaScript

        console.log(mobiliario); // Exibe os dados no console

    } catch (error) {
        console.error(error);
    }
}

// Chama a função para carregar os dados
loadMobiliario();
