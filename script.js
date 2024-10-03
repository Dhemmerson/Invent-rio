// Função para autenticação e envio para Google Sheets
function onGAPILoad() {
  gapi.load('client:auth2', initClient);
}

function initClient() {
  gapi.client.init({
    apiKey: 'SUA_CHAVE_DE_API',
    clientId: 'SEU_CLIENT_ID.apps.googleusercontent.com',
    discoveryDocs: ["https://sheets.googleapis.com/$discovery/rest?version=v4"],
    scope: "https://www.googleapis.com/auth/spreadsheets"
  }).then(() => {
    console.log('API carregada e cliente autenticado.');
  });
}

document.getElementById('inventario-form').addEventListener('submit', function(e) {
  e.preventDefault();
  
  const etiqueta = document.getElementById('etiqueta').value;
  const item = document.getElementById('item').value;
  const cor = document.getElementById('cor').value;
  const imagem = document.getElementById('imagem').files[0];
  const observacao = document.getElementById('observacao').value;
  const local = document.getElementById('local').value;

  const formData = [etiqueta, item, cor, imagem.name, observacao, local];
  
  gapi.client.sheets.spreadsheets.values.append({
    spreadsheetId: 'SEU_SPREADSHEET_ID',
    range: 'Sheet1!A1:F1',  
    valueInputOption: 'RAW',
    insertDataOption: 'INSERT_ROWS',
    resource: {
      values: [formData]
    }
  }).then(response => {
    console.log('Dados enviados com sucesso:', response);
    alert('Item adicionado ao inventário!');
  }).catch(error => {
    console.error('Erro ao enviar dados:', error);
  });
});

// Função de busca de itens
document.getElementById('buscar').addEventListener('input', function() {
  const query = this.value.toLowerCase();
  const resultados = document.getElementById('resultados-busca');
  resultados.innerHTML = ''; // Limpar os resultados anteriores

  gapi.client.sheets.spreadsheets.values.get({
    spreadsheetId: 'SEU_SPREADSHEET_ID',
    range: 'Sheet1!A1:F'
  }).then(response => {
    const dados = response.result.values || [];
    const filtrados = dados.filter(item => item.some(campo => campo.toLowerCase().includes(query)));
    
    filtrados.forEach(item => {
      const div = document.createElement('div');
      div.textContent = `Etiqueta: ${item[0]}, Item: ${item[1]}, Local: ${item[5]}`;
      resultados.appendChild(div);
    });
  }).catch(error => {
    console.error('Erro ao buscar dados:', error);
  });
});
