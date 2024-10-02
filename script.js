const githubToken = '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'; // Coloque seu token de acesso pessoal aqui
const repoOwner = 'Dhemmerson'; // Seu nome de usuário no GitHub
const repoName = 'Dhemmerson/Invent-rio'; // Nome do seu repositório
const fileName = 'mobiliario.json'; // Nome do arquivo JSON

document.addEventListener('DOMContentLoaded', () => {
    loadMobiliario(); // Carrega os dados ao iniciar
});

const form = document.getElementById('inventarioForm');
form.addEventListener('submit', function(event) {
    event.preventDefault();

    const numeroEtiqueta = document.getElementById('numeroEtiqueta').value;
    const mobiliario = document.getElementById('mobiliario').value;
    const local = document.getElementById('local').value;
    const cor = document.getElementById('cor').value;
    const imagemInput = document.getElementById('imagem');
    const observacoes = document.getElementById('observacoes').value;
    const dataInclusao = new Date().toLocaleDateString();

    if (imagemInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const imagem = e.target.result; // Converte a imagem para Base64
            const item = { numeroEtiqueta, mobiliario, local, cor, imagem, observacoes, dataInclusao };
            addMobiliario(item);
            saveToGithub();  // Salvar no GitHub
            form.reset();
            document.getElementById('corPicker').value = '#ffffff';
        };
        reader.readAsDataURL(imagemInput.files[0]);
    }
});

function addMobiliario(item) {
    const mobiliarioTable = document.getElementById('mobiliarioTable').getElementsByTagName('tbody')[0];
    const newRow = mobiliarioTable.insertRow();
    newRow.innerHTML = `
        <td>${item.numeroEtiqueta}</td>
        <td>${item.mobiliario}</td>
        <td>${item.local}</td>
        <td style="background-color: ${item.cor}">${item.cor}</td>
        <td><img src="${item.imagem}" alt="Imagem de ${item.mobiliario}"></td>
        <td>${item.observacoes}</td>
        <td>${item.dataInclusao}</td>
        <td>
            <button onclick="editItem(this)">Editar</button>
            <button onclick="deleteItem(this)">Excluir</button>
        </td>
    `;
}

function editItem(button) {
    const row = button.parentNode.parentNode;
    const numeroEtiqueta = row.cells[0].innerText;
    const mobiliario = row.cells[1].innerText;
    const local = row.cells[2].innerText;
    const cor = row.cells[3].innerText;
    const observacoes = row.cells[5].innerText;

    document.getElementById('numeroEtiqueta').value = numeroEtiqueta;
    document.getElementById('mobiliario').value = mobiliario;
    document.getElementById('local').value = local;
    document.getElementById('corPicker').value = cor;
    document.getElementById('cor').value = cor;
    document.getElementById('observacoes').value = observacoes;

    row.remove();
    saveToGithub();  // Salvar alterações no GitHub após edição
}

function deleteItem(button) {
    const row = button.parentNode.parentNode;
    row.remove();
    saveToGithub();  // Salvar alterações no GitHub após exclusão
}

function searchMobiliario() {
    const input = document.getElementById('search').value.toLowerCase();
    const rows = document.getElementById('mobiliarioTable').getElementsByTagName('tr');

    for (let i = 0; i < rows.length; i++) {
        const cells = rows[i].getElementsByTagName('td');
        let found = false;

        for (let j = 0; j < cells.length; j++) {
            if (cells[j].innerText.toLowerCase().includes(input)) {
                found = true;
                break;
            }
        }

        rows[i].style.display = found ? '' : 'none';
    }
}

function updateColorText() {
    const colorPicker = document.getElementById('corPicker');
    const colorText = document.getElementById('cor');
    colorText.value = colorPicker.value; // Atualiza o campo de texto com a cor escolhida
}

function updateColorPicker() {
    const colorText = document.getElementById('cor');
    const colorPicker = document.getElementById('corPicker');
    colorPicker.value = colorText.value; // Atualiza o seletor de cor com o valor do campo de texto
}

async function loadMobiliario() {
    try {
        const response = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/contents/${fileName}`);
        if (!response.ok) throw new Error(`Erro ao carregar o arquivo: ${response.statusText}`);

        const data = await response.json();
        const content = atob(data.content);
        const items = JSON.parse(content);

        items.forEach(item => {
            addMobiliario(item);
        });
    } catch (error) {
        console.error('Erro ao carregar os dados do GitHub:', error);
    }
}

async function saveToGithub() {
    try {
        const items = [];
        const mobiliarioTable = document.getElementById('mobiliarioTable').getElementsByTagName('tbody')[0];

        for (let i = 0; i < mobiliarioTable.rows.length; i++) {
            const row = mobiliarioTable.rows[i];
            const item = {
                numeroEtiqueta: row.cells[0].innerText,
                mobiliario: row.cells[1].innerText,
                local: row.cells[2].innerText,
                cor: row.cells[3].innerText,
                imagem: row.cells[4].getElementsByTagName('img')[0].src,
                observacoes: row.cells[5].innerText,
                dataInclusao: row.cells[6].innerText,
            };
            items.push(item);
        }

        const jsonContent = JSON.stringify(items, null, 2);
        const base64Content = btoa(jsonContent);
        const sha = await getFileSha();

        const response = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/contents/${fileName}`, {
            method: 'PUT',
            headers: {
                'Authorization': `token ${githubToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: 'Atualização do arquivo mobiliario.json',
                content: base64Content,
                sha: sha
            })
        });

        if (!response.ok) {
            throw new Error(`Erro ao salvar os dados no GitHub: ${response.statusText}`);
        }

        console.log('Dados salvos com sucesso no GitHub!');
    } catch (error) {
        console.error('Erro ao salvar os dados:', error);
    }
}

async function getFileSha() {
    const response = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/contents/${fileName}`);
    if (!response.ok) {
        throw new Error(`Erro ao obter o SHA do arquivo: ${response.statusText}`);
    }
    const data = await response.json();
    return data.sha;
}
