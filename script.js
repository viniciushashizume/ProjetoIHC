// Funções Gerais
function limparFormulario(formId) {
    document.getElementById(formId).reset();
}

function confirmarExclusao(button) {
    if (confirm("Tem certeza que deseja excluir este item? Esta ação não pode ser desfeita.")) {
        // Lógica de exclusão aqui
        // Neste protótipo, apenas remove a linha da tabela
        const row = button.parentNode.parentNode;
        row.parentNode.removeChild(row);
        alert("Item excluído com sucesso.");
    }
}

// Lógica Específica - Cadastro de Voos
function sugerirDestino(origem) {
    const destinoInput = document.getElementById('destino');
    if (origem.toLowerCase().includes('são paulo')) {
        destinoInput.value = 'Rio de Janeiro (GIG)';
    } else if (origem.toLowerCase().includes('rio de janeiro')) {
        destinoInput.value = 'São Paulo (GRU)';
    }
}

// Lógica Específica - Compra de Passagens
function mostrarAssentos(voo) {
    const secaoAssentos = document.getElementById('selecao-assentos');
    if (voo) {
        secaoAssentos.style.display = 'block';
        gerarMapaAssentos();
    } else {
        secaoAssentos.style.display = 'none';
    }
}

function gerarMapaAssentos() {
    const mapa = document.querySelector('.mapa-assentos');
    mapa.innerHTML = ''; // Limpa assentos anteriores
    const totalAssentos = 60; // 10 fileiras de 6
    const ocupados = [3, 4, 15, 25, 26, 40]; // Assentos já ocupados
    const especiais = [1, 2, 3, 4, 5, 6]; // Primeira fileira é especial

    for (let i = 1; i <= totalAssentos; i++) {
        const assento = document.createElement('div');
        assento.classList.add('assento');
        assento.dataset.numero = i;
        assento.innerText = i;

        if (ocupados.includes(i)) {
            assento.classList.add('ocupado');
        } else {
            assento.classList.add('disponivel');
            if(especiais.includes(i)) {
                assento.classList.add('especial');
                assento.dataset.valor = 350.00;
            } else {
                 assento.dataset.valor = 250.00;
            }
            assento.addEventListener('click', () => selecionarAssento(assento));
        }
        mapa.appendChild(assento);
    }
}

function selecionarAssento(assento) {
    assento.classList.toggle('selecionado');
    atualizarResumoCompra();
}

function atualizarResumoCompra() {
    const selecionados = document.querySelectorAll('.assento.selecionado');
    const infoSpan = document.getElementById('assentos-info');
    const totalSpan = document.getElementById('total-pagar');
    
    let numeros = [];
    let total = 0;

    selecionados.forEach(assento => {
        numeros.push(assento.dataset.numero);
        total += parseFloat(assento.dataset.valor);
    });

    if(numeros.length > 0) {
        infoSpan.innerText = numeros.join(', ');
    } else {
        infoSpan.innerText = 'Nenhum';
    }
    
    totalSpan.innerText = total.toFixed(2);
}

function finalizarCompra() {
    const selecionados = document.querySelectorAll('.assento.selecionado');
    if (selecionados.length === 0) {
        alert('Por favor, selecione ao menos um assento.');
        return;
    }
    const total = document.getElementById('total-pagar').innerText;
    alert(`Compra finalizada com sucesso! Valor total: R$ ${total}.`);
    // Aqui a lógica real enviaria os dados para o servidor
    // e depois atualizaria a interface.
    location.reload(); // Recarrega a página para simular a conclusão.
}


// Lógica Específica - Relatório de Ocupação
function gerarRelatorioOcupacao(voo) {
    const container = document.getElementById('relatorio-ocupacao-container');
    if (voo) {
        container.style.display = 'block';
        document.getElementById('voo-id-relatorio').innerText = voo === 'voo1' ? 'G3-1234' : 'AD-5678';
        // Valores simulados
        const total = 170;
        const padraoOcupados = voo === 'voo1' ? 50 : 80;
        const especiaisOcupados = voo === 'voo1' ? 10 : 15;
        const totalOcupados = padraoOcupados + especiaisOcupados;
        const percentual = (totalOcupados / total) * 100;

        document.getElementById('capacidade-total').innerText = total;
        document.getElementById('padrao-ocupados').innerText = `${padraoOcupados} / 150`;
        document.getElementById('especiais-ocupados').innerText = `${especiaisOcupados} / 20`;
        const progressBarFill = document.getElementById('progress-bar-fill');
        progressBarFill.style.width = `${percentual.toFixed(2)}%`;
        progressBarFill.innerText = `${percentual.toFixed(0)}%`;

    } else {
        container.style.display = 'none';
    }
}

// Lógica Específica - Relatório de Vendas
function alternarFiltroData(tipo) {
    document.getElementById('filtro-dia').style.display = (tipo === 'diario') ? 'block' : 'none';
    document.getElementById('filtro-mes').style.display = (tipo === 'mensal') ? 'block' : 'none';
}

function gerarRelatorioVendas() {
    const tipo = document.getElementById('tipo_relatorio').value;
    let periodo = '';
    let valor = 0;

    if (tipo === 'diario') {
        const data = document.getElementById('data_relatorio').value;
        if (!data) {
            alert('Por favor, selecione um dia.');
            return;
        }
        periodo = new Date(data + 'T00:00:00').toLocaleDateString('pt-BR');
        valor = Math.random() * 10000 + 5000; // Valor simulado
    } else {
         const mes = document.getElementById('mes_relatorio').value;
         if (!mes) {
            alert('Por favor, selecione um mês.');
            return;
         }
         const [ano, mesNum] = mes.split('-');
         periodo = `${mesNum}/${ano}`;
         valor = Math.random() * 500000 + 100000; // Valor simulado
    }

    document.getElementById('periodo-relatorio').innerText = periodo;
    document.getElementById('valor-total-vendas').innerText = `R$ ${valor.toFixed(2).replace('.', ',')}`;
    document.getElementById('resultado-relatorio-vendas').style.display = 'block';
}