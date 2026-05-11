// ========== Utilidades e segurança ==========
function safeParse(json) {
    try {
        return JSON.parse(json) || null;
    } catch (e) {
        return null;
    }
}

// ========== Autenticação ==========
function getUsers() {
    return safeParse(localStorage.getItem('users')) || [];
}
function saveUsers(users) {
    localStorage.setItem('users', JSON.stringify(users));
}

let currentUser = sessionStorage.getItem('loggedInUser') || null;

function checkLogin(redirect = true) {
    if (!currentUser) {
        if (redirect) {
            let paginaAtual = window.location.href;
            if (paginaAtual.includes('login.html')) return false;
            // Caminho relativo para login
            let base = window.location.pathname.includes('/paginas/') ? '' : 'paginas/';
            window.location.href = base + 'login.html?redirect=' + encodeURIComponent(paginaAtual);
        }
        return false;
    }
    return true;
}

function getUserData(username) {
    let users = getUsers();
    return users.find(u => u.username === username) || null;
}

function updateUserData(userData) {
    let users = getUsers();
    let index = users.findIndex(u => u.username === userData.username);
    if (index !== -1) {
        users[index] = userData;
        saveUsers(users);
    }
}

function atualizarIconeLogin() {
    const iconLogin = document.getElementById('iconelogin');
    if (!iconLogin) return;

    // Define se estamos dentro da pasta 'paginas/'
    let base = window.location.pathname.includes('/paginas/') ? '' : 'paginas/';

    if (currentUser) {
        iconLogin.innerHTML = '<i class="fa-solid fa-user"></i>';
        iconLogin.href = base + 'conta.html';
    } else {
        iconLogin.innerHTML = '<i class="fa-solid fa-arrow-right-to-bracket"></i>';
        iconLogin.href = base + 'login.html';
    }
}

// ========== Menu Hamburguer (com classes, sem estilo inline) ==========
let menudecima = document.querySelector('.menudecima');
let menuhamburguer = document.querySelector('.menuhamburguer');

function clicado() {
    if (menudecima && menuhamburguer) {
        menudecima.classList.toggle('menu-aberto');
        menuhamburguer.classList.toggle('clicou');
        // Gerencia foco para acessibilidade
        if (menudecima.classList.contains('menu-aberto')) {
            let primeiroLink = menudecima.querySelector('a');
            if (primeiroLink) primeiroLink.focus();
        } else {
            menuhamburguer.focus();
        }
    }
}

// Fechar menu com ESC
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && menudecima && menudecima.classList.contains('menu-aberto')) {
        clicado();
    }
});

// Fechar menu ao clicar fora
document.addEventListener('click', function(e) {
    if (menudecima && menuhamburguer && menudecima.classList.contains('menu-aberto')) {
        if (!menudecima.contains(e.target) && !menuhamburguer.contains(e.target)) {
            clicado();
        }
    }
});

// ========== Modal customizado (substitui alert/confirm) ==========
function criarModal() {
    const existente = document.getElementById('modal-custom');
    if (existente) existente.remove();

    const modal = document.createElement('div');
    modal.id = 'modal-custom';
    modal.innerHTML = `
        <div class="modal-overlay">
            <div class="modal-box">
                <p class="modal-mensagem"></p>
                <div class="modal-botoes">
                    <button class="modal-btn modal-btn-ok">OK</button>
                    <button class="modal-btn modal-btn-cancelar">Cancelar</button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    // Estilos se ainda não existirem
    if (!document.getElementById('modal-estilos')) {
        const style = document.createElement('style');
        style.id = 'modal-estilos';
        style.textContent = `
            .modal-overlay {
                position: fixed; top: 0; left: 0;
                width: 100%; height: 100%;
                background: rgba(0,0,0,0.6);
                display: flex; align-items: center; justify-content: center;
                z-index: 9999;
            }
            .modal-box {
                background: white; padding: 24px; border-radius: 16px;
                max-width: 400px; width: 90%;
                text-align: center;
                box-shadow: 0 4px 20px rgba(0,0,0,0.2);
            }
            .modal-mensagem {
                font-size: 1.1em; color: #3B2F2F;
                margin: 0 0 20px; white-space: pre-line;
                font-family: system-ui, sans-serif;
            }
            .modal-botoes {
                display: flex; gap: 10px; justify-content: center;
            }
            .modal-btn {
                padding: 10px 20px; border: none; border-radius: 20px;
                font-weight: bold; cursor: pointer; transition: 0.2s;
                font-family: system-ui, sans-serif;
            }
            .modal-btn-ok { background: #C1440E; color: white; }
            .modal-btn-cancelar { background: #ddd; color: #333; }
            .modal-btn:active { transform: scale(0.95); }
        `;
        document.head.appendChild(style);
    }
}

function mostrarModal(mensagem, tipo = 'alert') {
    return new Promise((resolve) => {
        criarModal();
        const overlay = document.querySelector('.modal-overlay');
        const msgEl = document.querySelector('.modal-mensagem');
        const btnOk = document.querySelector('.modal-btn-ok');
        const btnCancelar = document.querySelector('.modal-btn-cancelar');

        msgEl.textContent = mensagem;

        if (tipo === 'alert') {
            btnCancelar.style.display = 'none';
            btnOk.textContent = 'OK';
        } else {
            btnCancelar.style.display = 'inline-block';
            btnOk.textContent = 'Sim';
            btnCancelar.textContent = 'Cancelar';
        }

        function fechar(resultado) {
            overlay.remove();
            resolve(resultado);
        }

        btnOk.onclick = () => fechar(true);
        btnCancelar.onclick = () => fechar(false);
        overlay.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') fechar(false);
        });
        btnOk.focus();
    });
}

// ========== Simulação de Pagamento ==========
function simularPagamento(total) {
    return new Promise((resolve) => {
        criarModal();
        const overlay = document.querySelector('.modal-overlay');
        const msgEl = document.querySelector('.modal-mensagem');
        const btnOk = document.querySelector('.modal-btn-ok');
        const btnCancelar = document.querySelector('.modal-btn-cancelar');
        const botoesDiv = document.querySelector('.modal-botoes');

        msgEl.textContent = `Pagamento no valor de R$ ${total.toFixed(2)}\nEscolha a forma de pagamento:`;

        btnOk.style.display = 'none';
        btnCancelar.style.display = 'inline-block';
        btnCancelar.textContent = 'Cancelar';

        const btnCartao = document.createElement('button');
        btnCartao.className = 'modal-btn modal-btn-ok';
        btnCartao.textContent = '💳 Cartão';
        const btnPix = document.createElement('button');
        btnPix.className = 'modal-btn modal-btn-ok';
        btnPix.textContent = '📱 Pix';

        botoesDiv.insertBefore(btnCartao, btnCancelar);
        botoesDiv.insertBefore(btnPix, btnCancelar);

        function fechar(resultado) {
            btnCartao.remove();
            btnPix.remove();
            overlay.remove();
            resolve(resultado);
        }

        function processarPagamento(metodo) {
            msgEl.textContent = `Processando pagamento via ${metodo}...`;
            [btnCartao, btnPix, btnCancelar].forEach(b => b.disabled = true);
            setTimeout(() => {
                const sucesso = Math.random() > 0.1; // 90% de chance
                if (sucesso) {
                    msgEl.textContent = `✅ Pagamento aprovado via ${metodo}!`;
                    setTimeout(() => fechar(true), 1200);
                } else {
                    msgEl.textContent = `❌ Pagamento recusado. Tente novamente.`;
                    [btnCartao, btnPix, btnCancelar].forEach(b => b.disabled = false);
                }
            }, 1500);
        }

        btnCartao.onclick = () => processarPagamento('Cartão');
        btnPix.onclick = () => processarPagamento('Pix');
        btnCancelar.onclick = () => fechar(false);
        overlay.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') fechar(false);
        });
    });
}

// ========== Sistema do carrinho ==========
function obterCarrinho() {
    if (!currentUser) return [];
    return safeParse(localStorage.getItem('carrinho_' + currentUser)) || [];
}
function salvarCarrinho(carrinho) {
    if (!currentUser) return;
    localStorage.setItem('carrinho_' + currentUser, JSON.stringify(carrinho));
}

function adicionarAoCarrinho(nome, preco, imagem) {
    if (!checkLogin()) return;
    let carrinho = obterCarrinho();
    let itemExistente = carrinho.find(item => item.nome === nome);
    if (itemExistente) {
        itemExistente.quantidade++;
    } else {
        carrinho.push({ nome, preco, quantidade: 1, imagem });
    }
    salvarCarrinho(carrinho);
    mostrarFeedback(nome);
    atualizarContador();
}

// ========== Retorno visual (toast) ==========
function mostrarFeedback(nome, emoji = '🛒') {
    let aviso = document.createElement('div');
    aviso.textContent = `${nome} ${emoji}`;
    aviso.style.position = 'fixed';
    aviso.style.bottom = '70px';
    aviso.style.left = '50%';
    aviso.style.transform = 'translateX(-50%)';
    aviso.style.background = '#C1440E';
    aviso.style.color = 'white';
    aviso.style.padding = '10px 16px';
    aviso.style.borderRadius = '20px';
    aviso.style.fontSize = '0.9em';
    aviso.style.zIndex = '999';
    document.body.appendChild(aviso);
    setTimeout(() => aviso.remove(), 3000);
}

// ========== Carrinho (página) ==========
function carregarCarrinho() {
    let lista = document.getElementById('listacarrinho');
    let totalElemento = document.getElementById('total');
    let pontosElemento = document.getElementById('pontos');
    if (!lista) return;

    if (!currentUser) {
        lista.innerHTML = '<p>Faça login para ver seu carrinho.</p>';
        return;
    }

    let carrinho = obterCarrinho();
    lista.innerHTML = '';

    if (carrinho.length === 0) {
        lista.innerHTML = '<p>Seu carrinho está vazio 😢</p>';
        if (totalElemento) totalElemento.innerText = 'R$ 0,00';
        if (pontosElemento) pontosElemento.innerText = '0 pontos';
        return;
    }

    let total = 0;
    carrinho.forEach((item, index) => {
        let quantidade = item.quantidade || 1;
        let subtotal = item.preco * quantidade;
        total += subtotal;

        lista.innerHTML += `
            <li class="itemcarrinho">
                <img src="${item.imagem}" alt="${item.nome}" class="imagemicone">
                <div class="informacao">
                    <strong>${item.nome}</strong>
                    <div class="controlequantidade">
                        <button onclick="diminuirItem(${index})" aria-label="Diminuir quantidade de ${item.nome}">-</button>
                        <span>${quantidade}</span>
                        <button onclick="aumentarItem(${index})" aria-label="Aumentar quantidade de ${item.nome}">+</button>
                    </div>
                    <span>R$ ${subtotal.toFixed(2)}</span>
                </div>
                <button class="remover" onclick="removerItemTotal(${index})" aria-label="Remover ${item.nome} do carrinho">❌</button>
            </li>
        `;
    });

    if (totalElemento) totalElemento.innerText = 'R$ ' + total.toFixed(2);
    if (pontosElemento) {
        let userData = getUserData(currentUser);
        let pontos = userData ? userData.pontos : 0;
        pontosElemento.innerText = pontos + ' pontos';
    }
}

function aumentarItem(index) { let c = obterCarrinho(); c[index].quantidade++; salvarCarrinho(c); carregarCarrinho(); atualizarContador(); }
function diminuirItem(index) { let c = obterCarrinho(); if (c[index].quantidade > 1) c[index].quantidade--; else c.splice(index,1); salvarCarrinho(c); carregarCarrinho(); atualizarContador(); }
function removerItemTotal(index) { let c = obterCarrinho(); c.splice(index,1); salvarCarrinho(c); carregarCarrinho(); atualizarContador(); }

function atualizarContador() {
    let contador = document.getElementById('contadorcarrinho');
    if (!contador) return;
    let carrinho = currentUser ? obterCarrinho() : [];
    let totalItens = carrinho.reduce((s, i) => s + (i.quantidade || 1), 0);
    contador.textContent = totalItens;
}

// ========== Pedidos ==========
function salvarPedido(carrinho, total, pontosganhos, unidade) {
    let pedidos = safeParse(localStorage.getItem('pedidos_' + currentUser)) || [];
    pedidos.unshift({
        id: Date.now(),
        data: new Date().toLocaleString('pt-BR'),
        timestamp: Date.now(),
        itens: carrinho.map(i => ({ nome: i.nome, preco: i.preco, quantidade: i.quantidade, imagem: i.imagem })),
        total, pontos: pontosganhos, status: 'Em preparo', unidade
    });
    localStorage.setItem('pedidos_' + currentUser, JSON.stringify(pedidos));
}

const tempoParaPronto = 1, tempoParaRetirado = 2;

function carregarPedidos() {
    const container = document.getElementById('listapedidos');
    if (!container) return;
    if (!currentUser) {
        container.innerHTML = '<p class="pedidovazio">Faça login para ver seus pedidos.</p>';
        return;
    }
    let pedidos = safeParse(localStorage.getItem('pedidos_' + currentUser)) || [];
    if (pedidos.length === 0) {
        container.innerHTML = '<p class="pedidovazio">Você ainda não fez nenhum pedido 😢<br><a href="cardapio.html">Ver cardápio</a></p>';
        return;
    }
    const agora = Date.now();
    let mudou = false;
    pedidos.forEach(p => {
        const min = (agora - p.timestamp) / 60000;
        if (p.status === 'Em preparo' && min >= tempoParaPronto) { p.status = 'Pronto para retirada'; mudou = true; }
        if (p.status === 'Pronto para retirada' && min >= tempoParaRetirado) { p.status = 'Pedido retirado'; mudou = true; }
    });
    if (mudou) localStorage.setItem('pedidos_' + currentUser, JSON.stringify(pedidos));

    container.innerHTML = pedidos.map(p => {
        let cls = p.status === 'Em preparo' ? 'statusempreparo' : p.status === 'Pronto para retirada' ? 'statuspronto' : 'statusretirado';
        return `<article class="pedidocard">
            <div class="pedidocabecalho"><span class="pedidodata">📅 ${p.data}</span><span class="pedidostatus ${cls}">🕒 ${p.status}</span></div>
            <div class="pedidounidade">📍 Unidade: ${p.unidade || 'Não informada'}</div>
            <ul class="pedidoitens">${p.itens.map(i => `<li class="pedidoitem"><img src="${i.imagem}" alt="${i.nome}" class="imagempedido"><div class="informacaopedido"><span class="nomepedido">${i.nome} (x${i.quantidade})</span><span class="precopedido">R$ ${(i.preco*i.quantidade).toFixed(2)}</span></div></li>`).join('')}</ul>
            <div class="pedidototal"><strong>Total: R$ ${p.total.toFixed(2)}</strong><span class="pedidopontos">+${Math.floor(p.pontos)} pontos</span></div>
        </article>`;
    }).join('');
}

// ========== Finalizar Pedido (com pagamento) ==========
async function finalizarPedido(event) {
    if (event) event.preventDefault();
    if (!currentUser) {
        await mostrarModal('Faça login para finalizar o pedido.');
        window.location.href = 'paginas/login.html';
        return;
    }
    let carrinho = obterCarrinho();
    if (carrinho.length === 0) {
        await mostrarModal('Seu carrinho está vazio 😢');
        return;
    }
    const selectUnidade = document.getElementById('unidaderetirada');
    const unidade = selectUnidade ? selectUnidade.value : '';
    if (!unidade) {
        await mostrarModal('Por favor, selecione uma unidade para retirada.');
        selectUnidade?.focus();
        return;
    }
    let totalBruto = 0;
    carrinho.forEach(item => totalBruto += item.preco * item.quantidade);
    let userData = getUserData(currentUser);
    let desconto = userData.desconto || 0;
    let totalFinal = totalBruto;
    if (desconto > 0) {
        totalFinal = Math.max(0, totalBruto - desconto);
        userData.desconto = 0;
    }

    // Pagamento simulado
    const pago = await simularPagamento(totalFinal);
    if (!pago) {
        mostrarFeedback('Pagamento cancelado', '💳');
        return;
    }

    const pontosGanhos = totalFinal * 10;
    userData.pontos = (userData.pontos || 0) + pontosGanhos;
    updateUserData(userData);
    salvarPedido(carrinho, totalFinal, pontosGanhos, unidade);

    let msg = `🛒 Pedido concluído!\nUnidade: ${unidade}\nTotal: R$ ${totalFinal.toFixed(2)}\n+${Math.floor(pontosGanhos)} pontos`;
    await mostrarModal(msg);
    mostrarFeedback('Pedido confirmado!', '🎉');

    localStorage.removeItem('carrinho_' + currentUser);
    atualizarContador();
    setTimeout(() => { window.location.href = 'pedidos.html'; }, 2000);
}

// ========== Login / Cadastro ==========
function initLoginPage() {
    if (!document.getElementById('abaentrar')) return;
    document.getElementById('abaentrar').addEventListener('click', () => {
        document.getElementById('abaentrar').classList.add('active');
        document.getElementById('abacadastrar').classList.remove('active');
        document.getElementById('painellogin').classList.add('active');
        document.getElementById('painelcadastro').classList.remove('active');
    });
    document.getElementById('abacadastrar').addEventListener('click', () => {
        document.getElementById('abacadastrar').classList.add('active');
        document.getElementById('abaentrar').classList.remove('active');
        document.getElementById('painelcadastro').classList.add('active');
        document.getElementById('painellogin').classList.remove('active');
    });

    document.getElementById('painellogin').addEventListener('submit', async function(e) {
        e.preventDefault();
        const ok = await mostrarModal('Ao entrar, você concorda com nossos Termos de Uso e Política de Privacidade.', 'confirm');
        if (!ok) return;
        let user = document.getElementById('usuariologin').value.trim();
        let pass = document.getElementById('senhalogin').value;
        let users = getUsers();
        let found = users.find(u => u.username === user && u.password === pass);
        if (found) {
            sessionStorage.setItem('loggedInUser', user);
            let redirect = new URLSearchParams(window.location.search).get('redirect') || '../index.html';
            window.location.href = redirect;
        } else {
            document.getElementById('errologin').textContent = 'Usuário ou senha inválidos.';
        }
    });

    document.getElementById('painelcadastro').addEventListener('submit', async function(e) {
        e.preventDefault();
        const ok = await mostrarModal('Ao criar a conta, você concorda com nossos Termos de Uso e Política de Privacidade.', 'confirm');
        if (!ok) return;
        let user = document.getElementById('usuariocadastro').value.trim();
        let pass = document.getElementById('senhacadastro').value;
        let pass2 = document.getElementById('senhacadastro2').value;
        let erro = document.getElementById('errocadastro');
        if (!user || !pass) { erro.textContent = 'Preencha todos os campos.'; return; }
        if (pass !== pass2) { erro.textContent = 'As senhas não coincidem.'; return; }
        let users = getUsers();
        if (users.find(u => u.username === user)) { erro.textContent = 'Nome de usuário já existe.'; return; }
        users.push({ username: user, password: pass, pontos: 0, desconto: 0 });
        saveUsers(users);
        sessionStorage.setItem('loggedInUser', user);
        window.location.href = '../index.html';
    });
}

// ========== Conta ==========
function initContaPage() {
    if (!document.getElementById('nomeusuario')) return;
    if (!checkLogin()) return;
    let userData = getUserData(currentUser);
    document.getElementById('nomeusuario').textContent = currentUser;
    document.getElementById('pontosusuario').textContent = userData.pontos || 0;
    document.getElementById('descontousuario').textContent = (userData.desconto || 0) > 0 ? 'R$ ' + userData.desconto.toFixed(2) : 'Nenhum';
    document.getElementById('btnsair').addEventListener('click', () => {
        sessionStorage.removeItem('loggedInUser');
        currentUser = null;
        window.location.href = '../index.html';
    });
}

// ========== Fidelidade ==========
function renderRecompensas() {
    let userData = getUserData(currentUser);
    document.getElementById('pontosfidelidade').textContent = userData.pontos || 0;
    document.getElementById('descontofidelidade').textContent = (userData.desconto || 0) > 0 ? 'R$ ' + userData.desconto.toFixed(2) : 'Nenhum';
    const recompensas = [
        { pontos: 50,  desconto: 5  },
        { pontos: 100, desconto: 10 },
        { pontos: 200, desconto: 20 },
        { pontos: 350, desconto: 35 },
        { pontos: 500, desconto: 50 },
        { pontos: 1000, desconto: 100 }
    ];
    let grid = document.getElementById('gridrecompensas');
    if (!grid) return;
    grid.innerHTML = recompensas.map(r => `
        <article class="cardrecompensa">
            <p>⭐ ${r.pontos} pontos</p><p>🏷️ R$ ${r.desconto.toFixed(2)} de desconto</p>
            <button class="botaoresgate" data-pontos="${r.pontos}" data-desconto="${r.desconto}">Resgatar</button>
        </article>`).join('');
    grid.onclick = (e) => {
        if (e.target.classList.contains('botaoresgate')) {
            resgatarRecompensa(parseInt(e.target.dataset.pontos), parseFloat(e.target.dataset.desconto));
        }
    };
}

async function resgatarRecompensa(pontosCusto, descontoValor) {
    let userData = getUserData(currentUser);
    if (userData.pontos < pontosCusto) {
        await mostrarModal('Pontos insuficientes!'); return;
    }
    if (userData.desconto > 0) {
        await mostrarModal('Você já possui um desconto ativo. Utilize-o antes.'); return;
    }
    const ok = await mostrarModal(`Trocar ${pontosCusto} pontos por R$ ${descontoValor.toFixed(2)} de desconto?`, 'confirm');
    if (!ok) return;
    userData.pontos -= pontosCusto;
    userData.desconto = descontoValor;
    updateUserData(userData);
    renderRecompensas();
    await mostrarModal('Desconto resgatado com sucesso!');
}

function initFidelidadePage() {
    if (!document.getElementById('pontosfidelidade')) return;
    if (!checkLogin()) return;
    renderRecompensas();
}

// ========== Inicialização ==========
window.addEventListener('load', () => {
    atualizarIconeLogin();
    initLoginPage();
    initContaPage();
    initFidelidadePage();

    if (currentUser) {
        carregarCarrinho();
        atualizarContador();
        carregarPedidos();
        setInterval(carregarPedidos, 30000);
    }

    let btnFinalizar = document.getElementById('finalizar');
    if (btnFinalizar) btnFinalizar.addEventListener('click', finalizarPedido);

    document.body.addEventListener('click', (e) => {
        if (e.target.classList.contains('adicionarcarrinho')) {
            e.preventDefault();
            let card = e.target.closest('.itenscardapio') || e.target.closest('.card');
            if (!card) return;
            let nome = card.querySelector('h3').innerText;
            let preco = Number(card.querySelector('.preco').innerText.replace('R$', '').replace(',', '.').trim());
            let imagem = card.querySelector('img').src;
            adicionarAoCarrinho(nome, preco, imagem);
        }
    });

     // ====== Ano automático ======
    let ano = document.querySelector('#ano');
    let data = new Date();
    let anoatual = data.getFullYear();
    ano.textContent = anoatual;
});
