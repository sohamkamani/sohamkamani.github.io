(function(){
  var fruits = [
    'apples',
    'bananas',
    'kiwis',
    'watermelon',
    'grapes',
    'avocado',
    'pear',
    'grapefruit',
    'strawberries',
    'mangoes',
    'oranges',
  ],
  
  fruitText = document.getElementById('fruit-text'),
  fruit = fruits[Math.floor(Math.random()* fruits.length)];
  fruitText.innerHTML = fruit;
}())