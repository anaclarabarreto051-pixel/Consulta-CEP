console.log("Script loaded successfully");
console.log("Form:", document.getElementById("cepForm"));
const API_BASE_URL = "http://127.0.0.1:5000";
const VIA_CEP_BASE_URL = "https://viacep.com.br/ws";
const form = document.getElementById("cepForm");
const rua = document.getElementById("rua");
const cidade = document.getElementById("cidade");
const estado = document.getElementById("estado");
const bairro = document.getElementById("bairro");
form.addEventListener("submit", handleSubmit);
// submit do form
function handleSubmit(event) {
  event.preventDefault();
  const cepInput = document.getElementById("cep");
  const cep = cepInput.value.trim();
  console.log("CEP digitado:", cep);
  if (!cep) {
    alert("digite um CEP válido");
    return;
  }
  // setLoadingState(); 
  buscarNoBackend(cep);
}
//  o front faz a busca no backend
async function buscarNoBackend(cep) {
  setLoadingState();
console.log("Buscando CEP:", cep);
  try {
    // 1️⃣ tenta no backend
    const backendResponse = await fetch(`${API_BASE_URL}/ceps/${cep}`);

    console.log("Resposta do backend:", backendResponse);
    if (backendResponse.ok) {
      const data = await backendResponse.json();
      preencherResultado(data);
      return; // 🔒 PARA TUDO AQUI
    }

    if (viaCepData.erro) {
      setNotFoundState();
      return;
    }

    preencherResultado(viaCepData);
  } catch (error) {
    console.error("Erro ao buscar CEP:", error);
    setErrorState();
  }
}

function preencherResultado(data) {
  rua.innerText = data.rua || data.logradouro || "-";
  bairro.innerText = data.bairro || "-";
  cidade.innerText = data.cidade || data.localidade || "-";
  estado.innerText = data.estado || data.uf || "-";
}

function setLoadingState() {
  rua.innerText = "Carregando...";
  bairro.innerText = "Carregando...";
  cidade.innerText = "Carregando...";
  estado.innerText = "Carregando...";
}

function setNotFoundState() {
  rua.innerText = "Não encontrado";
  bairro.innerText = "Não encontrado";
  cidade.innerText = "Não encontrado";
  estado.innerText = "Não encontrado";
}

function setErrorState() {
  rua.innerText = "Erro";
  bairro.innerText = "Erro";
  cidade.innerText = "Erro";
  estado.innerText = "Erro";
}