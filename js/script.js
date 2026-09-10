// ============================================
// FILASAÚDE
// Sistema educacional de gerenciamento de filas
// ============================================


// ============================================
// 1. BANCO DE DADOS (localStorage)
// ============================================

// Carrega as solicitações salvas no navegador.
// Se não houver nada salvo, começa com um array vazio.

let solicitacoes =
    JSON.parse(localStorage.getItem("filasaude")) || [];


// ============================================
// 2. GERAR PROTOCOLO
// ============================================

// Cria um código único no formato FS-######
// Exemplo: FS-384921

function gerarProtocolo() {
    const numero = Math.floor(100000 + Math.random() * 900000);
    return `FS-${numero}`;
}


// ============================================
// 3. CADASTRAR / SALVAR SOLICITAÇÃO
// ============================================

const formulario = document.getElementById("formSolicitacao");

formulario.addEventListener("submit", function(event) {

    // Impede a página de recarregar ao enviar o formulário
    event.preventDefault();

    // Pega os valores digitados pelo usuário
    const nome          = document.getElementById("nome").value;
    const tipo          = document.getElementById("tipo").value;
    const especialidade = document.getElementById("especialidade").value;
    const prioridade    = document.getElementById("prioridade").value;
    const observacao    = document.getElementById("observacao").value;

    // Gera um novo protocolo único
    const protocolo = gerarProtocolo();

    // Cria o objeto da nova solicitação
    const novaSolicitacao = {
        protocolo:   protocolo,
        nome:        nome,
        tipo:        tipo,
        especialidade: especialidade,
        prioridade:  prioridade,
        observacao:  observacao,
        status:      "Aguardando regulação",
        data:        new Date().toLocaleString("pt-BR")
    };

    // Adiciona a nova solicitação ao array
    solicitacoes.push(novaSolicitacao);

    // ARMAZENA no localStorage (salva no navegador)
    localStorage.setItem("filasaude", JSON.stringify(solicitacoes));

    // Mostra mensagem de sucesso com o protocolo gerado
    const resultado = document.getElementById("resultadoCadastro");
    resultado.classList.remove("hidden");
    resultado.innerHTML = `
        <h3>✅ Solicitação registrada!</h3>
        <p>Sua solicitação foi registrada no sistema.</p>
        <br>
        <strong>Protocolo: ${protocolo}</strong>
        <p>Guarde esse número para consultar a situação posteriormente.</p>
    `;

    // Limpa o formulário
    formulario.reset();

    // Atualiza o Dashboard, Tabela, Gráfico e Hero Card
    atualizarDashboard();
    atualizarTabela();
    atualizarGraficoPizza();
    atualizarHeroCard();
});


// ============================================
// 4. CONSULTAR PROTOCOLO
// ============================================

function consultarProtocolo() {

    const protocolo = document
        .getElementById("protocoloConsulta")
        .value
        .trim()
        .toUpperCase();

    const resultado = document.getElementById("resultadoConsulta");

    // Verifica se o campo está vazio
    if (!protocolo) {
        resultado.innerHTML = `
            <div class="consulta-result">
                <h3>⚠️ Digite um protocolo</h3>
                <p>Informe o número recebido no cadastro.</p>
            </div>
        `;
        return;
    }

    // Procura a solicitação no array
    const solicitacao = solicitacoes.find(
        item => item.protocolo === protocolo
    );

    // Se não encontrou
    if (!solicitacao) {
        resultado.innerHTML = `
            <div class="consulta-result">
                <h3>❌ Protocolo não encontrado</h3>
                <p>Verifique o número digitado.</p>
            </div>
        `;
        return;
    }

    // Se encontrou, mostra os dados
    resultado.innerHTML = `
        <div class="consulta-result">
            <h3>📋 Solicitação encontrada</h3>
            <br>
            <p><strong>Protocolo:</strong> ${solicitacao.protocolo}</p>
            <p><strong>Tipo:</strong> ${solicitacao.tipo}</p>
            <p><strong>Serviço:</strong> ${solicitacao.especialidade}</p>
            <p><strong>Prioridade:</strong> ${solicitacao.prioridade}</p>
            <p><strong>Status:</strong> ${solicitacao.status}</p>
            <p><strong>Data:</strong> ${solicitacao.data}</p>
        </div>
    `;
}


// ============================================
// 5. ATUALIZAR DASHBOARD
// ============================================

function atualizarDashboard() {

    // Conta o total de solicitações
    const total = solicitacoes.length;

    // Conta por tipo
    const consultas = solicitacoes.filter(
        item => item.tipo === "Consulta"
    ).length;

    const exames = solicitacoes.filter(
        item => item.tipo === "Exame"
    ).length;

    // Conta prioridades Alta e Urgente
    const urgentes = solicitacoes.filter(
        item => item.prioridade === "Alta" || item.prioridade === "Urgente"
    ).length;

    // Atualiza os números na tela (seção Fila)
    document.getElementById("totalSolicitacoes").textContent = total;
    document.getElementById("totalConsultas").textContent   = consultas;
    document.getElementById("totalExames").textContent      = exames;
    document.getElementById("totalUrgentes").textContent    = urgentes;
}


// ============================================
// 6. ATUALIZAR HERO CARD (painel do topo)
// ============================================

function atualizarHeroCard() {

    const total = solicitacoes.length;

    const consultas = solicitacoes.filter(
        item => item.tipo === "Consulta"
    ).length;

    const exames = solicitacoes.filter(
        item => item.tipo === "Exame"
    ).length;

    const encaminhamentos = solicitacoes.filter(
        item => item.tipo === "Encaminhamento"
    ).length;

    // Atualiza os números no card do topo (hero)
    document.getElementById("heroFilaNumber").textContent = total;
    document.getElementById("heroConsultas").textContent = consultas;
    document.getElementById("heroExames").textContent = exames;
    document.getElementById("heroEncaminhamentos").textContent = encaminhamentos;
}


// ============================================
// 7. ATUALIZAR TABELA
// ============================================

function atualizarTabela() {

    const tabela = document.getElementById("tabelaFila");
    tabela.innerHTML = "";

    // Se não houver solicitações
    if (solicitacoes.length === 0) {
        tabela.innerHTML = `
            <tr>
                <td colspan="5">Nenhuma solicitação registrada.</td>
            </tr>
        `;
        return;
    }

    // Percorre todas as solicitações e cria as linhas da tabela
    solicitacoes.forEach(item => {
        const linha = document.createElement("tr");
        linha.innerHTML = `
            <td>${item.protocolo}</td>
            <td>${item.tipo}</td>
            <td>${item.especialidade}</td>
            <td>${item.prioridade}</td>
            <td>${item.status}</td>
        `;
        tabela.appendChild(linha);
    });
}


// ============================================
// 8. GRÁFICO DE PIZZA (Chart.js)
// ============================================
let graficoPizza = null;

function atualizarGraficoPizza() {

    const consultas = solicitacoes.filter(
        item => item.tipo === "Consulta"
    ).length;

    const exames = solicitacoes.filter(
        item => item.tipo === "Exame"
    ).length;

    const encaminhamentos = solicitacoes.filter(
        item => item.tipo === "Encaminhamento"
    ).length;

    const ctx = document.getElementById("graficoPizza").getContext("2d");

    if (graficoPizza) {
        graficoPizza.destroy();
    }

    graficoPizza = new Chart(ctx, {
        type: "pie",
        data: {
            labels: ["Consultas", "Exames", "Encaminhamentos"],
            datasets: [{
                data: [consultas, exames, encaminhamentos],
                backgroundColor: ["#4CAF50", "#2196F3", "#FF9800"],
                borderColor: "#fff",
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            aspectRatio: 1.9,
            plugins: {
                legend: {
                    position: "bottom",
                    labels: {
                        font: { size: 11 },
                        boxWidth: 5
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const valor = context.raw;
                            const porcentagem = total > 0
                                ? ((valor / total) * 100).toFixed(1) + "%"
                                : "0%";
                            return `${context.label}: ${valor} (${porcentagem})`;
                        }
                    }
                }
            }
        }
    });
}

// ============================================
// 9. INICIALIZAR O SISTEMA
// ============================================

function iniciarSistema() {
    atualizarDashboard();
    atualizarTabela();
    atualizarGraficoPizza();
    atualizarHeroCard();
}

// Executa quando a página carrega
iniciarSistema();