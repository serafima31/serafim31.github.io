const personalLabel = document.querySelector('#personal-data-label'),
			personalInput = document.querySelector('#personal-data-input'),
			menu = document.querySelector('.nav'),
			burger = document.querySelector('.burger'),
			overlay = document.querySelector('.overlay'),
			accordionTrigger = document.querySelectorAll('.accordion-item__trigger');


const lockScroll = () => {
    document.body.classList.add('lock');
}

const unlockScroll = () => {
    document.body.classList.remove('lock');
}

burger.addEventListener('click', (e) => {
    menu.classList.add('open');
    menu.classList.remove('close');
    overlay.classList.add('open');
    lockScroll();
});

overlay.addEventListener('click', () => {
    menu.classList.remove('open');
    menu.classList.add('close');
    overlay.classList.remove('open');
    unlockScroll();
});

const mySwiper = new Swiper('.swiper-container', {
  loop: true,

  // If we need pagination
  pagination: {
		el: '.swiper-pagination',
		clickable: true,
  },
})

accordionTrigger.forEach(function(item){
	item.addEventListener('click', function() {
			item.parentNode.classList.toggle('accordion-item--active');
	})
})

personalLabel.addEventListener('keydown', function(e) { // Прослушиваем событие нажатие клавиш
	if (e.keyCode === 13) { // Если нажат Enter  (он имеет код 13)
	 personalInput.click(); // симулируем клик по полю ввода
	}
 });
