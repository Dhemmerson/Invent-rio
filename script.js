const githubToken = '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'; // Substitua pelo seu token de acesso pessoal
const repoOwner = 'Dhemmerson'; // Seu nome de usuário no GitHub
const repoName = 'Invent-rio'; // Nome do seu repositório
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
    } else {
        const item = { numeroEtiqueta, mobiliario, local, cor, imagem: '', observacoes, dataInclusao };
        addMobiliario(item);
        saveToGithub();  // Salvar no GitHub
        form.reset();
        document.getElementById('corPicker').value = '#ffffff';
    }
});

// As funções addMobiliario, editItem, deleteItem, searchMobiliario, updateColorText, updateColorPicker, loadMobiliario, saveToGithub, getFileSha permanecem as mesmas
