document.addEventListener('DOMContentLoaded', () => {
    // --- INÍCIO DA SEÇÃO MODIFICADA ---
    // Adiciona um 'escutador' para o evento de 'submit' do formulário de aviões
    const formAvioes = document.getElementById('form-avioes');
    if (formAvioes) {
        formAvioes.addEventListener('submit', (event) => {
            event.preventDefault(); // Impede o recarregamento da página

            // Pega os valores do formulário
            const registro = document.getElementById('registro').value;
            const modelo = document.getElementById('modelo').value;
            const assentosPadrao = document.getElementById('assentos_padrao').value;
            const assentosEspeciais = document.getElementById('assentos_especiais').value;
            const editIndex = document.getElementById('edit-index').value; // Verifica se há um índice de edição

            const tabelaBody = document.querySelector('#tabela-avioes tbody');

            // Verifica se está em modo de edição
            if (editIndex) {
                // Atualiza a linha existente
                const row = tabelaBody.rows[parseInt(editIndex)];
                row.cells[0].innerText = registro;
                row.cells[1].innerText = modelo;
                row.cells[2].innerText = assentosPadrao;
                row.cells[3].innerText = assentosEspeciais;
                alert('Avião atualizado com sucesso!');
            } else {
                // Adiciona uma nova linha (comportamento original)
                const newRow = tabelaBody.insertRow();
                newRow.innerHTML = `
                    <td>${registro}</td>
                    <td>${modelo}</td>
                    <td>${assentosPadrao}</td>
                    <td>${assentosEspeciais}</td>
                    <td>
                        <button class="btn btn-edit" onclick="editarAviao(this)">Editar</button>
                        <button class="btn-delete" onclick="confirmarExclusao(this)">Excluir</button>
                    </td>
                `;
                alert('Avião salvo com sucesso!');
            }

            limparFormulario('form-avioes');
        });
    }
    // --- FIM DA SEÇÃO MODIFICADA ---

    // Adiciona um 'escutador' para o evento de 'submit' do formulário de voos
    const formVoos = document.getElementById('form-voos');
    if (formVoos) {
        formVoos.addEventListener('submit', (event) => {
            event.preventDefault();
            alert('Voo cadastrado com sucesso!');
            limparFormulario('form-voos');
        });
    }
    
    // Lógica para habilitar/desabilitar o botão de relatório de vendas
    const tipoRelatorioSelect = document.getElementById('tipo_relatorio');
    const dataRelatorioInput = document.getElementById('data_relatorio');
    const mesRelatorioInput = document.getElementById('mes_relatorio');
    const gerarRelatorioBtn = document.getElementById('btn-gerar-relatorio');

    function verificarFiltrosRelatorio() {
        if (!gerarRelatorioBtn) return; // Se não estiver na página certa, não faz nada

        const tipo = tipoRelatorioSelect.value;
        const dataInput = dataRelatorioInput.value;
        const mesInput = mesRelatorioInput.value;
        let habilitar = false;

        if (tipo === 'diario') {
            if (dataInput) {
                habilitar = true;
            }
        } else if (tipo === 'mensal') {
            const formatoValido = /^\d{2}-\d{4}$/;
            if (mesInput && formatoValido.test(mesInput)) {
                habilitar = true;
            }
        }
        gerarRelatorioBtn.disabled = !habilitar;
    }
    
    // Adiciona "escutadores" para os campos de filtro
    if (tipoRelatorioSelect) {
        tipoRelatorioSelect.addEventListener('change', verificarFiltrosRelatorio);
    }
    if (dataRelatorioInput) {
        dataRelatorioInput.addEventListener('input', verificarFiltrosRelatorio);
    }
    if (mesRelatorioInput) {
        mesRelatorioInput.addEventListener('input', verificarFiltrosRelatorio);
    }
    
    // Verifica o estado inicial ao carregar a página
    verificarFiltrosRelatorio();
});


// Funções Gerais

// --- FUNÇÃO MODIFICADA ---
function limparFormulario(formId) {
    document.getElementById(formId).reset();
    
    // Assegura que o modo de edição seja resetado
    const editIndexInput = document.getElementById('edit-index');
    if (editIndexInput) {
        editIndexInput.value = '';
    }

    // Assegura que o botão de salvar volte ao texto original
    const btnSalvar = document.getElementById('btn-salvar-aviao');
    if (btnSalvar) {
        btnSalvar.innerText = 'Salvar';
    }
}

function confirmarExclusao(button) {
    if (confirm("Tem certeza que deseja excluir este item? Esta ação não pode ser desfeita.")) {
        const row = button.parentNode.parentNode;
        row.parentNode.removeChild(row);
        alert("Item excluído com sucesso.");
    }
}

// --- NOVA FUNÇÃO ADICIONADA ---
// Função para preencher o formulário para edição de um avião
function editarAviao(button) {
    const row = button.parentNode.parentNode;
    // rowIndex retorna o índice na tabela completa (incluindo thead), subtraímos 1 para o índice correto no tbody
    const rowIndex = row.rowIndex - 1; 

    // Pega os dados da linha da tabela
    const registro = row.cells[0].innerText;
    const modelo = row.cells[1].innerText;
    const assentosPadrao = row.cells[2].innerText;
    const assentosEspeciais = row.cells[3].innerText;

    // Preenche o formulário com os dados do avião a ser editado
    document.getElementById('registro').value = registro;
    document.getElementById('modelo').value = modelo;
    document.getElementById('assentos_padrao').value = assentosPadrao;
    document.getElementById('assentos_especiais').value = assentosEspeciais;
    document.getElementById('edit-index').value = rowIndex; // Guarda o índice da linha que está sendo editada

    // Altera o texto do botão principal para "Atualizar"
    document.getElementById('btn-salvar-aviao').innerText = 'Atualizar';

    // Rola a página para o topo para que o usuário veja o formulário preenchido
    window.scrollTo(0, 0);
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
    mapa.innerHTML = '';
    const totalAssentos = 60;
    const ocupados = [3, 4, 15, 25, 26, 40];
    const especiais = [1, 2, 3, 4, 5, 6];

    for (let i = 1; i <= totalAssentos; i++) {
        const assento = document.createElement('div');
        assento.classList.add('assento');
        assento.dataset.numero = i;
        assento.innerText = i;

        if (ocupados.includes(i)) {
            assento.classList.add('ocupado');
        } else {
            assento.classList.add('disponivel');
            if (especiais.includes(i)) {
                assento.classList.add('especial');
                assento.dataset.valor = "350.00";
            } else {
                assento.dataset.valor = "250.00";
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
        const valorAssento = parseFloat(assento.dataset.valor);
        
        if (!isNaN(valorAssento)) {
            total += valorAssento;
        }
    });

    if (numeros.length > 0) {
        infoSpan.innerText = numeros.join(', ');
    } else {
        infoSpan.innerText = 'Nenhum';
    }
    
    totalSpan.innerText = total.toFixed(2).replace('.', ',');
}

function finalizarCompra() {
    const selecionados = document.querySelectorAll('.assento.selecionado');
    if (selecionados.length === 0) {
        alert('Por favor, selecione ao menos um assento.');
        return;
    }
    const total = document.getElementById('total-pagar').innerText;
    alert(`Compra finalizada com sucesso! Valor total: R$ ${total}.`);
    location.reload();
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
        
        const taxaTexto = document.getElementById('taxa-ocupacao-texto');
        const progressBarFill = document.getElementById('progress-bar-fill');
        
        if (taxaTexto && progressBarFill) {
            taxaTexto.innerText = `(${percentual.toFixed(0)}%)`;
            progressBarFill.style.width = `${percentual.toFixed(2)}%`;
            progressBarFill.innerText = '';
        }
    } else {
        container.style.display = 'none';
    }
}


// Lógica Específica - Relatório de Vendas
function alternarFiltroData(tipo) {
    document.getElementById('filtro-dia').style.display = (tipo === 'diario') ? 'block' : 'none';
    document.getElementById('filtro-mes').style.display = (tipo === 'mensal') ? 'block' : 'none';
    
    // Chama a função de verificação para atualizar o estado do botão ao trocar o tipo de relatório
    // É necessário um pequeno delay para garantir que o DOM atualizou o display dos filtros
    setTimeout(document.getElementById('btn-gerar-relatorio').__proto__.dispatchEvent.bind(new Event('input')), 100);
}

function gerarRelatorioVendas() {
    const tipo = document.getElementById('tipo_relatorio').value;
    let periodo = '';
    let valor = 0;

    if (tipo === 'diario') {
        const data = document.getElementById('data_relatorio').value;
        if (!data) { // Verificação redundante por segurança, mas a lógica do botão já previne
            alert('Por favor, selecione um dia.');
            return;
        }
        periodo = new Date(data + 'T00:00:00').toLocaleDateString('pt-BR');
        valor = Math.random() * 10000 + 5000;
    } else {
        const mesInput = document.getElementById('mes_relatorio').value;
        const formatoValido = /^\d{2}-\d{4}$/;

        if (!mesInput || !formatoValido.test(mesInput)) {
            alert('Por favor, digite o mês e o ano no formato mm-aaaa.');
            return;
        }
        const [mesNum, ano] = mesInput.split('-');
        if (parseInt(mesNum, 10) < 1 || parseInt(mesNum, 10) > 12) {
            alert('Mês inválido. Por favor, insira um mês entre 01 e 12.');
            return;
        }
        periodo = `${mesNum}/${ano}`;
        valor = Math.random() * 500000 + 100000;
    }

    document.getElementById('periodo-relatorio').innerText = periodo;
    document.getElementById('valor-total-vendas').innerText = `R$ ${valor.toFixed(2).replace('.', ',')}`;
    document.getElementById('resultado-relatorio-vendas').style.display = 'block';
}