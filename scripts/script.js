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

let botoes = document.querySelectorAll('.adicionarcarrinho');

  botoes.forEach(btn => {
    btn.addEventListener('click', () => {
      alert('Item adicionado ao carrinho 🛒');
    });
  });