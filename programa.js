import Calculator from './assets/biblioteca.js';

const calculator = new Calculator();

if (calculator.isPrime(10)) {
  console.log('É primo ');
} else {
  console.log('Não é primo ');
}