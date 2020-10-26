/* jshint esversion:6 */

/* Getting the needed html node elements */
const monsterHealthBar = document.querySelector("#monster-health");
const playerHealthBar = document.querySelector("#player-health");
const bonusLifeEl = document.querySelector("#bonus-life");

const attackBtn = document.querySelector("#attack-btn");
const strongAttackBtn = document.querySelector("#strong-attack-btn");
const healBtn = document.querySelector("#heal-btn");
const logBtn = document.querySelector("#log-btn");

/* dealMonsterDamage function for adding random numbers to the monster's progress bar value */
function dealMonsterDamage(damage) {
  const dealtDamage = Math.floor(Math.random() * damage);
  monsterHealthBar.value = +monsterHealthBar.value - dealtDamage;
  return dealtDamage;
}

/* dealPlayerDamage function for adding random numbers to the player's progress bar value */
function dealPlayerDamage(damage) {
  const dealtDamage = Math.floor(Math.random() * damage);
  playerHealthBar.value = +playerHealthBar.value - dealtDamage;
  return dealtDamage;
}

/* increasePlayerHealth function for adding the healValue the player's progress bar */
function increasePlayerHealth(healValue) {
  playerHealthBar.value = +playerHealthBar.value + healValue;
}

/* resetGame function for reseting the value in the progress bars  */
function resetGame(value) {
  playerHealthBar.value = value;
  monsterHealthBar.value = value;
}

/* twoBonusLife function for adding the 2 bonus lifes text node after reseting the game  */
function twoBonusLife() {
  bonusLifeEl.textContent = 2 + " bonus lifes";
}

