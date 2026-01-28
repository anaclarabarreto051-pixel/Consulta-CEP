console.log("Script loaded successfully");
const form = document.getElementById("cepForm");
const rua = document.getElementById("rua");
const cidade = document.getElementById("cidade");
const estado = document.getElementById("estado");
const bairro = document.getElementById("bairro");
form.addEventListener("submit", function(event) {
event.preventDefault();
rua.innerText = "carregando...";
cidade.innerText = "carregando...";
estado.innerText = "carregando...";
bairro.innerText = "carregando...";   
const cepInput = document.getElementById("cep");
const cep = cepInput.value;
const url = `https://viacep.com.br/ws/${cep}/json/`;
fetch(url)
  .then(response => response.json())
  .then(data => {
	// populate fields from API response (fallback if not found)
	rua.innerText = data.logradouro || "Não encontrado";
	cidade.innerText = data.localidade || "Não encontrado";
	estado.innerText = data.uf || "Não encontrado";
	bairro.innerText = data.bairro || "Não encontrado";
  })
  .catch(error => {
	console.error("Fetch error:", error);
  });
  });