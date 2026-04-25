// ====== Menu ======
let menudecima = document.querySelector('.menudecima')
let menuhamburguer = document.querySelector('.menuhamburguer')

function clicado() {
    if (menudecima.style.display == 'block') {
        menudecima.style.display = 'none'
        menuhamburguer.classList.remove('clicou')
    } else {
        menudecima.style.display = 'block'
        menuhamburguer.classList.add('clicou')
    }
}

// ====== Sistema do carrinho ======
let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
let pontos = Number(localStorage.getItem('pontos')) || 0;

function adicionarAoCarrinho(nome, preco) {
    let item = {
        nome: nome,
        preco: preco
    };

    carrinho.push(item);
    localStorage.setItem('carrinho', JSON.stringify(carrinho));

    adicionarPontos(preco * 10);

    mostrarFeedback(nome);
    atualizarContador();
}

let botoes = document.querySelectorAll('.adicionarcarrinho');

botoes.forEach(btn => {
    btn.addEventListener('click', () => {

        let card = btn.parentElement;

        let nome = card.querySelector('h3').innerText;
        let precoTexto = card.querySelector('p').innerText;

        let preco = Number(precoTexto.replace('R$', '').replace(',', '.'));

        adicionarAoCarrinho(nome, preco);
    });
});

// ====== Pontos ======
function adicionarPontos(valor) {
    pontos += valor;
    localStorage.setItem('pontos', pontos);
}

// ====== Retorno ======
function mostrarFeedback(nome) {
    let aviso = document.createElement('div');

    aviso.textContent = `${nome} adicionado 🛒`;

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

    setTimeout(() => {
        aviso.remove();
    }, 2000);
}

function carregarCarrinho() {
    let lista = document.getElementById('lista-carrinho');
    let totalElemento = document.getElementById('total');
    let pontosElemento = document.getElementById('pontos');

    if (!lista) return; // evita erro em outras páginas

    lista.innerHTML = '';

    let total = 0;

    carrinho.forEach((item, index) => {
        total += item.preco;

        lista.innerHTML += `
            <li>
                ${item.nome} - R$ ${item.preco.toFixed(2)}
                <button onclick="removerItem(${index})">❌</button>
            </li>
        `;
    });

    totalElemento.innerText = "R$ " + total.toFixed(2);
    pontosElemento.innerText = pontos + " pontos";
}

// REMOVER ITEM
function removerItem(index) {
    carrinho.splice(index, 1);
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    carregarCarrinho();
}

function atualizarContador() {
    let contador = document.getElementById('contadorcarrinho');

    if (!contador) return;

    contador.textContent = carrinho.length;
}

// CARREGAR AUTOMÁTICO
window.onload = function() {
    carregarCarrinho();
    atualizarContador();
};

// ====== Ano automatico ======
let ano = document.querySelector('#ano')
let data = new Date()
let anoatual = data.getFullYear()

if (ano) {
    ano.textContent = anoatual
}