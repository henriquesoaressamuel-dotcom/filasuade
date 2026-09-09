// ============================================
// FILASAÚDE
// Sistema educacional de gerenciamento de filas
// ============================================


// Banco de dados temporário
// Os dados ficam armazenados no navegador.

let solicitacoes =
    JSON.parse(localStorage.getItem("filasaude")) || [];


// ============================================
// GERAR PROTOCOLO
// ============================================

function gerarProtocolo() {

    const numero =
        Math.floor(100000 + Math.random() * 900000);

    return `FS-${numero}`;
}


// ============================================
// FORMULÁRIO
// ============================================

const formulario =
    document.getElementById("formSolicitacao");


formulario.addEventListener("submit", function(event) {

    event.preventDefault();


    const nome =
        document.getElementById("nome").value;

    const tipo =
        document.getElementById("tipo").value;

    const especialidade =
        document.getElementById("especialidade").value;

    const prioridade =
        document.getElementById("prioridade").value;

    const observacao =
        document.getElementById("observacao").value;


    const protocolo =
        gerarProtocolo();


    const novaSolicitacao = {

        protocolo: protocolo,

        nome: nome,

        tipo: tipo,

        especialidade: especialidade,

        prioridade: prioridade,

        observacao: observacao,

        status: "Aguardando regulação",

        data: new Date().toLocaleString("pt-BR")

    };


    solicitacoes.push(novaSolicitacao);


    localStorage.setItem(
        "filasaude",
        JSON.stringify(solicitacoes)
    );


    const resultado =
        document.getElementById("resultadoCadastro");


    resultado.classList.remove("hidden");


    resultado.innerHTML = `

        <h3>✅ Solicitação registrada!</h3>

        <p>
            Sua solicitação foi registrada no sistema.
        </p>

        <br>

        <strong>
            Protocolo:
            ${protocolo}
        </strong>

        <p>
            Guarde esse número para consultar
            a situação posteriormente.
        </p>

    `;


    formulario.reset();


    atualizarDashboard();

});


// ============================================
// CONSULTAR PROTOCOLO
// ============================================

function consultarProtocolo() {

    const protocolo =
        document
        .getElementById("protocoloConsulta")
        .value
        .trim()
        .toUpperCase();


    const resultado =
        document.getElementById("resultadoConsulta");


    if (!protocolo) {

        resultado.innerHTML = `

            <div class="consulta-result">

                <h3>⚠️ Digite um protocolo</h3>

                <p>
                    Informe o número recebido no cadastro.
                </p>

            </div>

        `;

        return;

    }


    const solicitacao =
        solicitacoes.find(
            item => item.protocolo === protocolo
        );


    if (!solicitacao) {

        resultado.innerHTML = `

            <div class="consulta-result">

                <h3>❌ Protocolo não encontrado</h3>

                <p>
                    Verifique o número digitado.
                </p>

            </div>

        `;

        return;

    }


    resultado.innerHTML = `

        <div class="consulta-result">

            <h3>📋 Solicitação encontrada</h3>

            <br>

            <p>
                <strong>Protocolo:</strong>
                ${solicitacao.protocolo}
            </p>

            <p>
                <strong>Tipo:</strong>
                ${solicitacao.tipo}
            </p>

            <p>
                <strong>Serviço:</strong>
                ${solicitacao.especialidade}
            </p>

            <p>
                <strong>Prioridade:</strong>
                ${solicitacao.prioridade}
            </p>

            <p>
                <strong>Status:</strong>
                ${solicitacao.status}
            </p>

            <p>
                <strong>Data:</strong>
                ${solicitacao.data}
            </p>

        </div>

    `;

}


// ============================================
// ATUALIZAR DASHBOARD
// ============================================

function atualizarDashboard() {

    const total =
        solicitacoes.length;


    const consultas =
        solicitacoes.filter(
            item => item.tipo === "Consulta"
        ).length;


    const exames =
        solicitacoes.filter(
            item => item.tipo === "Exame"
        ).length;


    const urgentes =
        solicitacoes.filter(
            item =>
                item.prioridade === "Alta" ||
                item.prioridade === "Urgente"
        ).length;


    document.getElementById(
        "totalSolicitacoes"
    ).textContent = total;


    document.getElementById(
        "totalConsultas"
    ).textContent = consultas;


    document.getElementById(
        "totalExames"
    ).textContent = exames;


    document.getElementById(
        "totalUrgentes"
    ).textContent = urgentes;

}


// ============================================
// ATUALIZAR TABELA
// ============================================

function atualizarTabela() {

    const tabela =
        document.getElementById("tabelaFila");


    tabela.innerHTML = "";


    if (solicitacoes.length === 0) {

        tabela.innerHTML = `

            <tr>

                <td colspan="5">

                    Nenhuma solicitação registrada.

                </td>

            </tr>

        `;

        return;

    }


    solicitacoes.forEach(item => {

        const linha =
            document.createElement("tr");


        linha.innerHTML = `

            <td>
                ${item.protocolo}
            </td>

            <td>
                ${item.tipo}
            </td>

            <td>
                ${item.especialidade}
            </td>

            <td>
                ${item.prioridade}
            </td>

            <td>
                ${item.status}
            </td>

        `;


        tabela.appendChild(linha);

    });

}


// ============================================
// INICIALIZAÇÃO
// ============================================

function iniciarSistema() {

    atualizarDashboard();

    atualizarTabela();

}