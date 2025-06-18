document.addEventListener('DOMContentLoaded', () => {
    const contentDiv = document.getElementById('content');
    const homeLink = document.getElementById('home-link');
    const aviaoLink = document.getElementById('aviao-link');
    const vooLink = document.getElementById('voo-link');
    const reservaLink = document.getElementById('reserva-link');
    const comprarLink = document.getElementById('comprar-link');
    const ocupacaoLink = document.getElementById('ocupacao-link');
    const vendasLink = document.getElementById('vendas-link');

    // --- Simulação de Banco de Dados (Arrays para armazenar os dados) ---
    let avioes = [
        { registro: 'BRA001', modelo: 'Boeing 737', assentosPadrao: 150, assentosEspeciais: 10 },
        { registro: 'BRA002', modelo: 'Airbus A320', assentosPadrao: 120, assentosEspeciais: 8 }
    ];

    let voos = [
        { numero: 'JJ1234', data: '2025-07-10', horario: '10:00', origem: 'GRU', destino: 'GIG', valorNormal: 250.00, valorEspecial: 400.00, aviaoRegistro: 'BRA001' },
        { numero: 'LA5678', data: '2025-07-11', horario: '14:30', origem: 'GIG', destino: 'BSB', valorNormal: 300.00, valorEspecial: 450.00, aviaoRegistro: 'BRA002' }
    ];

    let reservas = [
        // Exemplo de reserva: { vooNumero: 'JJ1234', data: '2025-07-10', assento: 'A1', tipoAssento: 'padrao', valorPago: 250.00 }
    ];

    // Para simular ocupação dos assentos
    let assentosOcupadosPorVoo = {}; // Ex: { 'JJ1234-2025-07-10': ['A1', 'A2', 'B3'] }

    // --- Funções para Renderizar Telas ---

    function renderHomePage() {
        contentDiv.innerHTML = `
            <h2>Bem-vindo!</h2>
            <p>Este é o sistema de gestão de compras de passagens aéreas.</p>
            <p>Utilize o menu acima para navegar pelas funcionalidades:</p>
            <ul>
                <li><strong>Manter Aviões:</strong> Cadastre, edite e exclua informações sobre os aviões.</li>
                <li><strong>Manter Voos:</strong> Gerencie os detalhes dos voos, como número, data, horário e valores.</li>
                <li><strong>Manter Reservas:</strong> Visualize e gerencie as reservas de assentos.</li>
                <li><strong>Comprar Passagem:</strong> Interface para clientes selecionarem voos e assentos.</li>
                <li><strong>Relatório de Ocupação:</strong> Veja a capacidade e ocupação dos voos.</li>
                <li><strong>Relatório de Vendas:</strong> Acompanhe o valor total das passagens vendidas.</li>
            </ul>
        `;
    }

    function renderManterAvioes() {
        contentDiv.innerHTML = `
            <h2>Manter Aviões</h2>
            <form id="form-aviao">
                <h3>Cadastrar/Atualizar Avião</h3>
                <div class="form-group">
                    <label for="aviao-registro">Número de Registro:</label>
                    <input type="text" id="aviao-registro" required>
                </div>
                <div class="form-group">
                    <label for="aviao-modelo">Modelo:</label>
                    <input type="text" id="aviao-modelo" required>
                </div>
                <div class="form-group">
                    <label for="aviao-assentos-padrao">Assentos Padrão:</label>
                    <input type="number" id="aviao-assentos-padrao" min="0" required>
                </div>
                <div class="form-group">
                    <label for="aviao-assentos-especiais">Assentos Especiais:</label>
                    <input type="number" id="aviao-assentos-especiais" min="0" required>
                </div>
                <button type="submit">Salvar Avião</button>
                <button type="button" id="btn-limpar-aviao">Limpar Formulário</button>
            </form>

            <h3>Aviões Cadastrados</h3>
            <table id="tabela-avioes">
                <thead>
                    <tr>
                        <th>Registro</th>
                        <th>Modelo</th>
                        <th>Assentos Padrão</th>
                        <th>Assentos Especiais</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    </tbody>
            </table>
        `;
        setupAviaoForm();
        listAvioes();
    }

    function setupAviaoForm() {
        const form = document.getElementById('form-aviao');
        const registroInput = document.getElementById('aviao-registro');
        const modeloInput = document.getElementById('aviao-modelo');
        const assentosPadraoInput = document.getElementById('aviao-assentos-padrao');
        const assentosEspeciaisInput = document.getElementById('aviao-assentos-especiais');
        const btnLimpar = document.getElementById('btn-limpar-aviao');

        form.onsubmit = (e) => {
            e.preventDefault();
            const registro = registroInput.value.trim().toUpperCase();
            const modelo = modeloInput.value.trim();
            const assentosPadrao = parseInt(assentosPadraoInput.value);
            const assentosEspeciais = parseInt(assentosEspeciaisInput.value);

            if (!registro || !modelo || isNaN(assentosPadrao) || isNaN(assentosEspeciais)) {
                alert('Por favor, preencha todos os campos corretamente.');
                return;
            }

            const existingIndex = avioes.findIndex(a => a.registro === registro);
            if (existingIndex > -1) {
                // Alterar
                avioes[existingIndex] = { registro, modelo, assentosPadrao, assentosEspeciais };
                alert('Avião atualizado com sucesso!');
            } else {
                // Incluir
                avioes.push({ registro, modelo, assentosPadrao, assentosEspeciais });
                alert('Avião cadastrado com sucesso!');
            }
            form.reset();
            listAvioes();
        };

        btnLimpar.onclick = () => form.reset();
    }

    function listAvioes() {
        const tbody = document.querySelector('#tabela-avioes tbody');
        tbody.innerHTML = '';
        avioes.forEach(aviao => {
            const row = tbody.insertRow();
            row.insertCell().textContent = aviao.registro;
            row.insertCell().textContent = aviao.modelo;
            row.insertCell().textContent = aviao.assentosPadrao;
            row.insertCell().textContent = aviao.assentosEspeciais;
            const actionsCell = row.insertCell();
            const editButton = document.createElement('button');
            editButton.textContent = 'Editar';
            editButton.onclick = () => loadAviaoToForm(aviao);
            actionsCell.appendChild(editButton);

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Excluir';
            deleteButton.className = 'delete';
            deleteButton.onclick = () => deleteAviao(aviao.registro);
            actionsCell.appendChild(deleteButton);
        });
    }

    function loadAviaoToForm(aviao) {
        document.getElementById('aviao-registro').value = aviao.registro;
        document.getElementById('aviao-modelo').value = aviao.modelo;
        document.getElementById('aviao-assentos-padrao').value = aviao.assentosPadrao;
        document.getElementById('aviao-assentos-especiais').value = aviao.assentosEspeciais;
        document.getElementById('aviao-registro').readOnly = true; // Não permite alterar o registro ao editar
    }

    function deleteAviao(registro) {
        if (confirm(`Tem certeza que deseja excluir o avião ${registro}?`)) {
            avioes = avioes.filter(a => a.registro !== registro);
            alert('Avião excluído com sucesso!');
            listAvioes();
            document.getElementById('aviao-registro').readOnly = false; // Habilita o campo novamente
            document.getElementById('form-aviao').reset();
        }
    }

    function renderManterVoos() {
        contentDiv.innerHTML = `
            <h2>Manter Voos</h2>
            <form id="form-voo">
                <h3>Cadastrar/Atualizar Voo</h3>
                <div class="form-group">
                    <label for="voo-numero">Número do Voo:</label>
                    <input type="text" id="voo-numero" required>
                </div>
                <div class="form-group">
                    <label for="voo-data">Data da Viagem:</label>
                    <input type="date" id="voo-data" required>
                </div>
                <div class="form-group">
                    <label for="voo-horario">Horário da Viagem:</label>
                    <input type="time" id="voo-horario" required>
                </div>
                <div class="form-group">
                    <label for="voo-origem">Local de Origem:</label>
                    <input type="text" id="voo-origem" required>
                </div>
                <div class="form-group">
                    <label for="voo-destino">Local de Destino:</label>
                    <input type="text" id="voo-destino" required>
                </div>
                <div class="form-group">
                    <label for="voo-valor-normal">Valor Passagem Normal:</label>
                    <input type="number" id="voo-valor-normal" min="0" step="0.01" required>
                </div>
                <div class="form-group">
                    <label for="voo-valor-especial">Valor Passagem Especial:</label>
                    <input type="number" id="voo-valor-especial" min="0" step="0.01" required>
                </div>
                <div class="form-group">
                    <label for="voo-aviao">Avião (Registro):</label>
                    <select id="voo-aviao" required>
                        <option value="">Selecione um avião</option>
                        ${avioes.map(a => `<option value="${a.registro}">${a.registro} - ${a.modelo}</option>`).join('')}
                    </select>
                </div>
                <button type="submit">Salvar Voo</button>
                <button type="button" id="btn-limpar-voo">Limpar Formulário</button>
            </form>

            <h3>Voos Cadastrados</h3>
            <table id="tabela-voos">
                <thead>
                    <tr>
                        <th>Número</th>
                        <th>Data</th>
                        <th>Horário</th>
                        <th>Origem</th>
                        <th>Destino</th>
                        <th>Valor Normal</th>
                        <th>Valor Especial</th>
                        <th>Avião</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    </tbody>
            </table>
        `;
        setupVooForm();
        listVoos();
    }

    function setupVooForm() {
        const form = document.getElementById('form-voo');
        const numeroInput = document.getElementById('voo-numero');
        const dataInput = document.getElementById('voo-data');
        const horarioInput = document.getElementById('voo-horario');
        const origemInput = document.getElementById('voo-origem');
        const destinoInput = document.getElementById('voo-destino');
        const valorNormalInput = document.getElementById('voo-valor-normal');
        const valorEspecialInput = document.getElementById('voo-valor-especial');
        const aviaoSelect = document.getElementById('voo-aviao');
        const btnLimpar = document.getElementById('btn-limpar-voo');

        form.onsubmit = (e) => {
            e.preventDefault();
            const numero = numeroInput.value.trim().toUpperCase();
            const data = dataInput.value;
            const horario = horarioInput.value;
            const origem = origemInput.value.trim();
            const destino = destinoInput.value.trim();
            const valorNormal = parseFloat(valorNormalInput.value);
            const valorEspecial = parseFloat(valorEspecialInput.value);
            const aviaoRegistro = aviaoSelect.value;

            if (!numero || !data || !horario || !origem || !destino || isNaN(valorNormal) || isNaN(valorEspecial) || !aviaoRegistro) {
                alert('Por favor, preencha todos os campos corretamente.');
                return;
            }

            // Regra: voo de mesmo prefixo poderá ocorrer somente em dias diferentes
            const existingIndex = voos.findIndex(v => v.numero === numero && v.data === data);
            if (existingIndex > -1) {
                // Alterar
                voos[existingIndex] = { numero, data, horario, origem, destino, valorNormal, valorEspecial, aviaoRegistro };
                alert('Voo atualizado com sucesso!');
            } else {
                // Incluir
                // Verificar se o mesmo número de voo existe para a mesma data (se for inclusão)
                const vooExistenteComMesmoNumeroEDia = voos.some(v => v.numero === numero && v.data === data);
                if (vooExistenteComMesmoNumeroEDia) {
                    alert('Já existe um voo com o mesmo número para esta data. Por favor, escolha outra data ou número de voo.');
                    return;
                }
                voos.push({ numero, data, horario, origem, destino, valorNormal, valorEspecial, aviaoRegistro });
                alert('Voo cadastrado com sucesso!');
            }
            form.reset();
            listVoos();
            numeroInput.readOnly = false; // Habilita o campo novamente
            dataInput.readOnly = false;
        };

        btnLimpar.onclick = () => {
            form.reset();
            numeroInput.readOnly = false;
            dataInput.readOnly = false;
        };
    }

    function listVoos() {
        const tbody = document.querySelector('#tabela-voos tbody');
        tbody.innerHTML = '';
        voos.forEach(voo => {
            const row = tbody.insertRow();
            row.insertCell().textContent = voo.numero;
            row.insertCell().textContent = voo.data;
            row.insertCell().textContent = voo.horario;
            row.insertCell().textContent = voo.origem;
            row.insertCell().textContent = voo.destino;
            row.insertCell().textContent = voo.valorNormal.toFixed(2);
            row.insertCell().textContent = voo.valorEspecial.toFixed(2);
            row.insertCell().textContent = voo.aviaoRegistro;
            const actionsCell = row.insertCell();
            const editButton = document.createElement('button');
            editButton.textContent = 'Editar';
            editButton.onclick = () => loadVooToForm(voo);
            actionsCell.appendChild(editButton);

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Excluir';
            deleteButton.className = 'delete';
            deleteButton.onclick = () => deleteVoo(voo.numero, voo.data);
            actionsCell.appendChild(deleteButton);
        });
    }

    function loadVooToForm(voo) {
        document.getElementById('voo-numero').value = voo.numero;
        document.getElementById('voo-data').value = voo.data;
        document.getElementById('voo-horario').value = voo.horario;
        document.getElementById('voo-origem').value = voo.origem;
        document.getElementById('voo-destino').value = voo.destino;
        document.getElementById('voo-valor-normal').value = voo.valorNormal;
        document.getElementById('voo-valor-especial').value = voo.valorEspecial;
        document.getElementById('voo-aviao').value = voo.aviaoRegistro;
        document.getElementById('voo-numero').readOnly = true; // Não permite alterar número do voo e data ao editar
        document.getElementById('voo-data').readOnly = true;
    }

    function deleteVoo(numero, data) {
        if (confirm(`Tem certeza que deseja excluir o voo ${numero} na data ${data}?`)) {
            voos = voos.filter(v => !(v.numero === numero && v.data === data));
            // Remover reservas e assentos ocupados relacionados a este voo
            reservas = reservas.filter(r => !(r.vooNumero === numero && r.data === data));
            const key = `${numero}-${data}`;
            delete assentosOcupadosPorVoo[key];

            alert('Voo excluído com sucesso!');
            listVoos();
            document.getElementById('voo-numero').readOnly = false;
            document.getElementById('voo-data').readOnly = false;
            document.getElementById('form-voo').reset();
        }
    }

    function renderManterReservas() {
        contentDiv.innerHTML = `
            <h2>Manter Reservas</h2>
            <p>Nesta tela, você pode visualizar as reservas existentes. A inclusão, alteração e exclusão de reservas são feitas principalmente através da tela de "Comprar Passagem".</p>
            <h3>Reservas Realizadas</h3>
            <table id="tabela-reservas">
                <thead>
                    <tr>
                        <th>Número do Voo</th>
                        <th>Data</th>
                        <th>Assento</th>
                        <th>Tipo Assento</th>
                        <th>Valor Pago</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    </tbody>
            </table>
        `;
        listReservas();
    }

    function listReservas() {
        const tbody = document.querySelector('#tabela-reservas tbody');
        tbody.innerHTML = '';
        if (reservas.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6">Nenhuma reserva encontrada.</td></tr>';
            return;
        }
        reservas.forEach(reserva => {
            const row = tbody.insertRow();
            row.insertCell().textContent = reserva.vooNumero;
            row.insertCell().textContent = reserva.data;
            row.insertCell().textContent = reserva.assento;
            row.insertCell().textContent = reserva.tipoAssento === 'padrao' ? 'Padrão' : 'Especial';
            row.insertCell().textContent = reserva.valorPago.toFixed(2);
            const actionsCell = row.insertCell();
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Cancelar Reserva';
            deleteButton.className = 'delete';
            deleteButton.onclick = () => deleteReserva(reserva);
            actionsCell.appendChild(deleteButton);
        });
    }

    function deleteReserva(reservaToDelete) {
        if (confirm(`Tem certeza que deseja cancelar a reserva do assento ${reservaToDelete.assento} no voo ${reservaToDelete.vooNumero} em ${reservaToDelete.data}?`)) {
            reservas = reservas.filter(r => !(r.vooNumero === reservaToDelete.vooNumero && r.data === reservaToDelete.data && r.assento === reservaToDelete.assento));

            // Remover o assento dos assentos ocupados
            const key = `${reservaToDelete.vooNumero}-${reservaToDelete.data}`;
            if (assentosOcupadosPorVoo[key]) {
                assentosOcupadosPorVoo[key] = assentosOcupadosPorVoo[key].filter(a => a !== reservaToDelete.assento);
            }
            alert('Reserva cancelada com sucesso!');
            listReservas();
        }
    }

    function renderComprarPassagem() {
        contentDiv.innerHTML = `
            <h2>Comprar Passagem</h2>
            <form id="form-comprar-passagem">
                <div class="form-group">
                    <label for="comprar-data">Data da Viagem:</label>
                    <input type="date" id="comprar-data" required>
                </div>
                <div class="form-group">
                    <label for="comprar-horario">Horário da Viagem:</label>
                    <input type="time" id="comprar-horario">
                </div>
                <button type="submit">Buscar Voos</button>
            </form>

            <div id="lista-voos-disponiveis">
                </div>

            <div id="selecao-assentos" style="display: none;">
                <h3>Selecione os Assentos para o Voo: <span id="voo-info-selecao"></span></h3>
                <div class="assentos-grid" id="grid-assentos">
                    </div>
                <p class="assento-info">Total a Pagar: R$ <span id="total-a-pagar">0.00</span></p>
                <button id="btn-confirmar-compra" disabled>Confirmar Compra</button>
                <button id="btn-cancelar-selecao">Cancelar</button>
            </div>
        `;
        setupComprarPassagemForm();
    }

    function setupComprarPassagemForm() {
        const form = document.getElementById('form-comprar-passagem');
        const comprarDataInput = document.getElementById('comprar-data');
        const comprarHorarioInput = document.getElementById('comprar-horario');
        const listaVoosDiv = document.getElementById('lista-voos-disponiveis');
        const selecaoAssentosDiv = document.getElementById('selecao-assentos');
        const vooInfoSelecaoSpan = document.getElementById('voo-info-selecao');
        const gridAssentosDiv = document.getElementById('grid-assentos');
        const totalAPagarSpan = document.getElementById('total-a-pagar');
        const btnConfirmarCompra = document.getElementById('btn-confirmar-compra');
        const btnCancelarSelecao = document.getElementById('btn-cancelar-selecao');

        let selectedVoo = null;
        let assentosSelecionados = [];

        form.onsubmit = (e) => {
            e.preventDefault();
            const dataBusca = comprarDataInput.value;
            const horarioBusca = comprarHorarioInput.value;

            const voosDisponiveis = voos.filter(voo => {
                if (horarioBusca) {
                    return voo.data === dataBusca && voo.horario.startsWith(horarioBusca); // Horário pode ser parcial
                }
                return voo.data === dataBusca;
            });

            listaVoosDiv.innerHTML = '';
            selecaoAssentosDiv.style.display = 'none';

            if (voosDisponiveis.length === 0) {
                listaVoosDiv.innerHTML = '<p>Nenhum voo encontrado para os critérios de busca.</p>';
                return;
            }

            let voosHtml = '<h3>Voos Disponíveis:</h3><table><thead><tr><th>Número</th><th>Data</th><th>Horário</th><th>Origem</th><th>Destino</th><th>Valor Normal</th><th>Valor Especial</th><th>Ações</th></tr></thead><tbody>';
            voosDisponiveis.forEach(voo => {
                voosHtml += `
                    <tr>
                        <td>${voo.numero}</td>
                        <td>${voo.data}</td>
                        <td>${voo.horario}</td>
                        <td>${voo.origem}</td>
                        <td>${voo.destino}</td>
                        <td>R$ ${voo.valorNormal.toFixed(2)}</td>
                        <td>R$ ${voo.valorEspecial.toFixed(2)}</td>
                        <td><button class="selecionar-voo-btn" data-voo-numero="${voo.numero}" data-voo-data="${voo.data}">Selecionar</button></td>
                    </tr>
                `;
            });
            voosHtml += '</tbody></table>';
            listaVoosDiv.innerHTML = voosHtml;

            document.querySelectorAll('.selecionar-voo-btn').forEach(button => {
                button.onclick = (event) => {
                    const numero = event.target.dataset.vooNumero;
                    const data = event.target.dataset.vooData;
                    selectedVoo = voos.find(v => v.numero === numero && v.data === data);
                    displayAssentos(selectedVoo);
                };
            });
        };

        btnCancelarSelecao.onclick = () => {
            selecaoAssentosDiv.style.display = 'none';
            selectedVoo = null;
            assentosSelecionados = [];
            totalAPagarSpan.textContent = '0.00';
            btnConfirmarCompra.disabled = true;
            listaVoosDiv.style.display = 'block';
        };

        btnConfirmarCompra.onclick = () => {
            if (!selectedVoo || assentosSelecionados.length === 0) {
                alert('Nenhum assento selecionado para compra.');
                return;
            }

            if (confirm(`Confirmar compra de ${assentosSelecionados.length} assento(s) por R$ ${totalAPagarSpan.textContent}?`)) {
                assentosSelecionados.forEach(assentoObj => {
                    const { assento, tipoAssento, valor } = assentoObj;
                    reservas.push({
                        vooNumero: selectedVoo.numero,
                        data: selectedVoo.data,
                        assento: assento,
                        tipoAssento: tipoAssento,
                        valorPago: valor
                    });
                    // Atualizar assentos ocupados
                    const key = `${selectedVoo.numero}-${selectedVoo.data}`;
                    if (!assentosOcupadosPorVoo[key]) {
                        assentosOcupadosPorVoo[key] = [];
                    }
                    assentosOcupadosPorVoo[key].push(assento);
                });
                alert('Compra(s) realizada(s) com sucesso!');
                renderComprarPassagem(); // Recarrega a tela para limpar
            }
        };

        function displayAssentos(voo) {
            listaVoosDiv.style.display = 'none';
            selecaoAssentosDiv.style.display = 'block';
            vooInfoSelecaoSpan.textContent = `${voo.numero} em ${voo.data} às ${voo.horario}`;
            gridAssentosDiv.innerHTML = '';
            assentosSelecionados = [];
            updateTotalPagar();

            const aviao = avioes.find(a => a.registro === voo.aviaoRegistro);
            if (!aviao) {
                gridAssentosDiv.innerHTML = '<p>Avião não encontrado para este voo.</p>';
                return;
            }

            const totalAssentos = aviao.assentosPadrao + aviao.assentosEspeciais;
            const key = `${voo.numero}-${voo.data}`;
            const assentosOcupadosAtuais = assentosOcupadosPorVoo[key] || [];

            // Simples lógica de assentos (ex: A1, A2... B1, B2...)
            // Isso pode ser aprimorado para refletir uma malha de assentos real.
            for (let i = 1; i <= totalAssentos; i++) {
                let assentoNome = '';
                let tipoAssento = 'padrao';

                if (i <= aviao.assentosPadrao) {
                    assentoNome = `P${i}`; // Assento Padrão
                    tipoAssento = 'padrao';
                } else {
                    assentoNome = `E${i - aviao.assentosPadrao}`; // Assento Especial
                    tipoAssento = 'especial';
                }

                const assentoDiv = document.createElement('div');
                assentoDiv.classList.add('assento');
                assentoDiv.textContent = assentoNome;
                assentoDiv.dataset.assentoNome = assentoNome;
                assentoDiv.dataset.tipoAssento = tipoAssento;
                assentoDiv.dataset.valor = tipoAssento === 'padrao' ? voo.valorNormal : voo.valorEspecial;

                if (tipoAssento === 'especial') {
                    assentoDiv.classList.add('especial');
                }

                if (assentosOcupadosAtuais.includes(assentoNome)) {
                    assentoDiv.classList.add('ocupado');
                } else {
                    assentoDiv.onclick = () => toggleAssentoSelection(assentoDiv);
                }
                gridAssentosDiv.appendChild(assentoDiv);
            }
        }

        function toggleAssentoSelection(assentoDiv) {
            const assentoNome = assentoDiv.dataset.assentoNome;
            const tipoAssento = assentoDiv.dataset.tipoAssento;
            const valor = parseFloat(assentoDiv.dataset.valor);

            if (assentoDiv.classList.contains('selecionado')) {
                assentoDiv.classList.remove('selecionado');
                assentosSelecionados = assentosSelecionados.filter(a => a.assento !== assentoNome);
            } else {
                assentoDiv.classList.add('selecionado');
                assentosSelecionados.push({ assento: assentoNome, tipoAssento: tipoAssento, valor: valor });
            }
            updateTotalPagar();
        }

        function updateTotalPagar() {
            const total = assentosSelecionados.reduce((sum, assento) => sum + assento.valor, 0);
            totalAPagarSpan.textContent = total.toFixed(2);
            btnConfirmarCompra.disabled = assentosSelecionados.length === 0;
        }
    }

    function renderRelatorioOcupacao() {
        contentDiv.innerHTML = `
            <h2>Relatório de Ocupação de Voos</h2>
            <form id="form-ocupacao">
                <div class="form-group">
                    <label for="ocupacao-voo-numero">Número do Voo (Opcional):</label>
                    <input type="text" id="ocupacao-voo-numero">
                </div>
                <div class="form-group">
                    <label for="ocupacao-data">Data (Opcional):</label>
                    <input type="date" id="ocupacao-data">
                </div>
                <button type="submit">Gerar Relatório</button>
                <button type="button" id="btn-limpar-ocupacao">Limpar Filtros</button>
            </form>

            <div id="resultados-ocupacao">
                </div>
        `;
        setupRelatorioOcupacao();
    }

    function setupRelatorioOcupacao() {
        const form = document.getElementById('form-ocupacao');
        const numeroInput = document.getElementById('ocupacao-voo-numero');
        const dataInput = document.getElementById('ocupacao-data');
        const resultadosDiv = document.getElementById('resultados-ocupacao');
        const btnLimpar = document.getElementById('btn-limpar-ocupacao');

        form.onsubmit = (e) => {
            e.preventDefault();
            const filtroNumero = numeroInput.value.trim().toUpperCase();
            const filtroData = dataInput.value;

            let voosFiltrados = voos;
            if (filtroNumero) {
                voosFiltrados = voosFiltrados.filter(v => v.numero.includes(filtroNumero));
            }
            if (filtroData) {
                voosFiltrados = voosFiltrados.filter(v => v.data === filtroData);
            }

            if (voosFiltrados.length === 0) {
                resultadosDiv.innerHTML = '<p>Nenhum voo encontrado para os critérios especificados.</p>';
                return;
            }

            let html = '<h3>Detalhes da Ocupação:</h3><table><thead><tr><th>Voo</th><th>Data</th><th>Avião</th><th>Capacidade Total</th><th>Assentos Padrão Ocupados</th><th>Assentos Especiais Ocupados</th><th>Ocupação (%)</th></tr></thead><tbody>';

            voosFiltrados.forEach(voo => {
                const aviao = avioes.find(a => a.registro === voo.aviaoRegistro);
                if (!aviao) return; // Se o avião não for encontrado, pula este voo

                const key = `${voo.numero}-${voo.data}`;
                const assentosOcupados = assentosOcupadosPorVoo[key] || [];

                let ocupadosPadrao = 0;
                let ocupadosEspeciais = 0;

                assentosOcupados.forEach(assento => {
                    if (assento.startsWith('P')) { // Assento Padrão (simulação: P1, P2...)
                        ocupadosPadrao++;
                    } else if (assento.startsWith('E')) { // Assento Especial (simulação: E1, E2...)
                        ocupadosEspeciais++;
                    }
                });

                const totalCapacidade = aviao.assentosPadrao + aviao.assentosEspeciais;
                const totalOcupados = ocupadosPadrao + ocupadosEspeciais;
                const percentOcupacao = totalCapacidade > 0 ? ((totalOcupados / totalCapacidade) * 100).toFixed(2) : 0;

                html += `
                    <tr>
                        <td>${voo.numero}</td>
                        <td>${voo.data}</td>
                        <td>${aviao.modelo} (${aviao.registro})</td>
                        <td>${totalCapacidade}</td>
                        <td>${ocupadosPadrao}</td>
                        <td>${ocupadosEspeciais}</td>
                        <td>${percentOcupacao}%</td>
                    </tr>
                `;
            });
            html += '</tbody></table>';
            resultadosDiv.innerHTML = html;
        };

        btnLimpar.onclick = () => {
            form.reset();
            resultadosDiv.innerHTML = '';
        };
    }

    function renderRelatorioVendas() {
        contentDiv.innerHTML = `
            <h2>Relatório de Vendas de Passagens</h2>
            <form id="form-vendas">
                <div class="form-group">
                    <label for="vendas-mes">Mês (MM):</label>
                    <input type="number" id="vendas-mes" min="1" max="12" placeholder="Ex: 07">
                </div>
                <div class="form-group">
                    <label for="vendas-ano">Ano (YYYY):</label>
                    <input type="number" id="vendas-ano" min="2000" max="2099" value="${new Date().getFullYear()}">
                </div>
                <button type="submit">Gerar Relatório</button>
                <button type="button" id="btn-limpar-vendas">Limpar Filtros</button>
            </form>

            <div id="resultados-vendas">
                </div>
        `;
        setupRelatorioVendas();
    }

    function setupRelatorioVendas() {
        const form = document.getElementById('form-vendas');
        const mesInput = document.getElementById('vendas-mes');
        const anoInput = document.getElementById('vendas-ano');
        const resultadosDiv = document.getElementById('resultados-vendas');
        const btnLimpar = document.getElementById('btn-limpar-vendas');

        form.onsubmit = (e) => {
            e.preventDefault();
            const filtroMes = mesInput.value ? parseInt(mesInput.value) : null;
            const filtroAno = anoInput.value ? parseInt(anoInput.value) : null;

            if ((filtroMes && (filtroMes < 1 || filtroMes > 12)) || (filtroAno && (filtroAno < 2000 || filtroAno > 2099))) {
                alert('Por favor, insira um mês (1-12) e um ano (2000-2099) válidos.');
                return;
            }

            let vendasPorDia = {}; // { 'YYYY-MM-DD': totalVendido }
            let totalVendasMes = 0;

            reservas.forEach(reserva => {
                const [ano, mes, dia] = reserva.data.split('-');
                const dataReserva = new Date(reserva.data);

                const mesMatch = !filtroMes || (dataReserva.getMonth() + 1) === filtroMes;
                const anoMatch = !filtroAno || dataReserva.getFullYear() === filtroAno;

                if (mesMatch && anoMatch) {
                    if (!vendasPorDia[reserva.data]) {
                        vendasPorDia[reserva.data] = 0;
                    }
                    vendasPorDia[reserva.data] += reserva.valorPago;
                    totalVendasMes += reserva.valorPago;
                }
            });

            if (Object.keys(vendasPorDia).length === 0) {
                resultadosDiv.innerHTML = '<p>Nenhuma venda encontrada para os filtros especificados.</p>';
                return;
            }

            let html = '<h3>Vendas por Dia:</h3><table><thead><tr><th>Data</th><th>Total Vendido (R$)</th></tr></thead><tbody>';
            // Ordenar por data
            Object.keys(vendasPorDia).sort().forEach(data => {
                html += `<tr><td>${data}</td><td>${vendasPorDia[data].toFixed(2)}</td></tr>`;
            });
            html += '</tbody></table>';

            html += `<h3>Total de Vendas no Período Selecionado: R$ ${totalVendasMes.toFixed(2)}</h3>`;
            resultadosDiv.innerHTML = html;
        };

        btnLimpar.onclick = () => {
            form.reset();
            anoInput.value = new Date().getFullYear(); // Volta para o ano atual
            resultadosDiv.innerHTML = '';
        };
    }


    // --- Event Listeners para Navegação ---
    homeLink.addEventListener('click', (e) => { e.preventDefault(); renderHomePage(); });
    aviaoLink.addEventListener('click', (e) => { e.preventDefault(); renderManterAvioes(); });
    vooLink.addEventListener('click', (e) => { e.preventDefault(); renderManterVoos(); });
    reservaLink.addEventListener('click', (e) => { e.preventDefault(); renderManterReservas(); });
    comprarLink.addEventListener('click', (e) => { e.preventDefault(); renderComprarPassagem(); });
    ocupacaoLink.addEventListener('click', (e) => { e.preventDefault(); renderRelatorioOcupacao(); });
    vendasLink.addEventListener('click', (e) => { e.preventDefault(); renderRelatorioVendas(); });

    // Carrega a página inicial ao carregar o DOM
    renderHomePage();
});