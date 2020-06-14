Vue.component('input-number', {
	props: ['variants', 'value'],
	methods: {
		addOrDelete(e, i) {
			const currentValue = [...this.value];
			let result = e.target.checked
			 ? [...currentValue, Number(e.target.value)]
			 : currentValue.filter(v => v != e.target.value);

			this.$emit('input', result);
		},
	},
	template: `
		<div id="inputs-id" class='input-numbers'>
		 <div v-for="(v, i) in variants">
			 <input
				type="checkbox"
				:id="v + '_var'"
				:value.number="v"
				@input="addOrDelete($event, i)"
				:checked="value.includes(v)">
				<label :for="v + '_var'">{{ v }}</label><br>
		 </div>
		</div>
	`
});

const app = new Vue({ // Всегда используй const или let вместо var
	el: '#app',
	mounted() {
		this.bindHandler('up');
		this.bindHandler('left');
		this.bindHandler('right');
		this.bindHandler('down');

		window.addEventListener('keydown', event => {
			const selectedBtn = this.buttons.find(btn => btn.keyCode == event.keyCode);
			if (selectedBtn) {
				this.doChoise(event.keyCode);
			}
		}, false);
		this.next();
	},
	data: {
		// Лучше чтобы начальные значения были пусты,
		// если позже мы их будем заполнять
		buttons: [ 
			{
				value: 0,
				isCorrect: null, // Если верно true, если не верно false
				keyCode: 38, // Up
				idName: 'up'
			},
			{
				value: 0,
				isCorrect: null,
				keyCode: 39, // Right
				idName: 'right'
			},
			{
				value: 0,
				isCorrect: null,
				keyCode: 37, // left
				idName: 'left'
			},
			{
				value: 0,
				isCorrect: null,
				keyCode: 40, // down
				idName: 'down'
			}
		],

		minute: 2000,
		leftOperandVariants: [2],
		leftOperand: 0,
		rightOperandVariants: [2, 3, 4, 5, 6, 7, 8, 9],
		rightOperand: 0,
		isHideResult: true, // Показываем ? вместо ответа пока выбор не сделан
		pauseGame: true, // После того как выбор сделан запрещаем нажимать кнопки пока не будет приготовлен новый пример
	},
	computed: {
		result() {
			return this.leftOperand * this.rightOperand; // Правильный ответ
		}
	},
	methods: {
		bindHandler(id) {
			let myEvent = document.getElementById(id);
			myEvent.addEventListener('click', event => {
				let clickKeyCode = myEvent.getAttribute('data-keycode');
				this.doChoise(clickKeyCode);
			});
		},

		getRandomInt(min, max, exclude) { // Случайное число между min и max
			const newInt = Math.floor(Math.random() * (max - min)) + min;
			return newInt === exclude ? this.getRandomInt(min, max, exclude) : newInt;
		},
		
		selectRandomFrom(variants) { // Случайное число из вариантов
			const randomPosition = this.getRandomInt(0, variants.length);
			return variants[randomPosition];
		},
		
		doChoise(keyCode) {
			if (this.pauseGame) return; // Если игра на паузе ничего не делаем
			this.pauseGame = true; // Ставим на паузу
			const selectedBtn = this.buttons.find(btn => btn.keyCode == keyCode); // Находим что выбрал игрок
			
			// Проверяем выбор игрока
			if (selectedBtn.value === this.result) { 
				selectedBtn.isCorrect = true;
			} else {
				/* Если не правильно то выбранный кнопка будет закрашен на красный цвет,
				Дальше найдем правильный ответ и закрашим его на белый цвет.
				*/
				selectedBtn.isCorrect = false;
				const rightResponse = this.buttons.find(btn => btn.value == this.result);
				rightResponse.isCorrect = true;
			}

			this.isHideResult = false; // Показываем правильный овтет

			if (this.leftOperandVariants.length == 0) {
				alert('Если, не выбран ни одно число по умолчанию будет выбран число 2');
				this.leftOperandVariants.push(2);
				setTimeout(() => this.reset() && this.next(), this.minute) // Сброс и следующий раунд
			} else {
				setTimeout(() => this.reset() && this.next(), this.minute) // Сброс и следующий раунд
			}
		},
		
		reset() {
			this.buttons.forEach(b => {
				b.isCorrect = null
			})
			this.isHideResult = true;
			return true;
		},
		
		next() {
			this.rightOperand = this.selectRandomFrom(this.rightOperandVariants);
			this.leftOperand = this.selectRandomFrom(this.leftOperandVariants);
			
			// Выбираем в какой кнопке будет правильный ответ
			const correctButtonIndex = this.getRandomInt(0, this.buttons.length); 
			
			// Добавляем кнопкам значечния
			this.buttons.forEach((b, i) => {
				b.value = i === correctButtonIndex
					? this.result
					: this.getRandomInt(0, this.leftOperand * 9, this.result);
			});
			
			// Готово, снимаем игру с паузы, разрешаем сделать выбор
			this.pauseGame = false;
		}
	},
});

// js code for click menu
let menu = document.getElementById('click-menu');
menu.addEventListener('click', event => {
  let inputs = document.getElementById('inputs-id');

  if(inputs.style.display === 'none') {
     inputs.style.display = 'block';
  } else {
    inputs.style.display = 'none';
  }
}, false);