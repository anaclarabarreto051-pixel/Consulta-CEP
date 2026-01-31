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
function handleSubmit(event) {
  event.preventDefault();
  const cepInput = document.getElementById("cep");
  const cep = cepInput.value.trim();
  if (!cep) {
    alert("Por favor, digite um CEP válido.");
    return;
  }
  setLoadingState();
  buscarNoBackendCep(cep);
}
function buscarNoBackendCep(cep) {
  const url = (`https://viacep.com.br/ws/${cep}/json/`)
  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error("Não encontrado no banco");
      }
      return response.json();
    })
    .then(data => {
      preencherResultado(data);
    })
    .catch(() => {
      buscarNoViaCep(cep);
    });
}

// ==============================
// VIA CEP
// ==============================
function buscarNoViaCep(cep) {
  fetch(`https://viacep.com.br/ws/${cep}/json/`)
    .then(response => response.json())
    .then(data => {
      if (data.erro) {
        setNotFoundState();
        return;
      }

      salvarNoBackend({
        cep: cep,
        rua: data.logradouro,
        bairro: data.bairro,
        cidade: data.localidade,
        estado: data.uf,
      });
    })
    .catch(() => {
      setErrorState();
    });
}

// ==============================
// POST
// ==============================
function salvarNoBackend(dados) {
  fetch(`${API_BASE_URL}/enderecos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dados),
  })
    .then(response => {
      if (!response.ok) throw new Error("Erro ao salvar no backend");
      return response.json().catch(() => dados);
    })
    .then(saved => {
      preencherResultado(saved);
    })
    .catch(() => {
      setErrorState();
    });
}

// ==============================
// UI
// ==============================
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