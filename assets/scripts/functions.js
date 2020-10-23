/* jshint esversion:6 */

const monsterHealthBar = document.querySelector("#monster-health");
const playerHealthBar = document.querySelector("#player-health");
const bonusLifeEl = document.querySelector("#bonus-life");

const attackBtn = document.querySelector("#attack-btn");
const strongAttackBtn = document.querySelector("#strong-attack-btn");
const healBtn = document.querySelector("#heal-btn");
const logBtn = document.querySelector("#log-btn");

function adjustHealthBars(maxLife) {
  monsterHealthBar.max = maxLife;
  monsterHealthBar.value = maxLife;
  playerHealthBar.max = maxLife;
  playerHealthBar.value = maxLife;
}

function dealMonsterDamage(damage) {
  const dealtDamage = Math.floor(Math.random() * damage);
  monsterHealthBar.value = +monsterHealthBar.value - dealtDamage;
  return dealtDamage;
}

function dealPlayerDamage(damage) {
  const dealtDamage = Math.floor(Math.random() * damage);
  playerHealthBar.value = +playerHealthBar.value - dealtDamage;
  return dealtDamage;
}

function increasePlayerHealth(healValue) {
  playerHealthBar.value = +playerHealthBar.value + healValue;
}

function resetGame(value) {
  playerHealthBar.value = value;
  monsterHealthBar.value = value;
}

function twoBonusLife() {
  bonusLifeEl.textContent = 2 + " bonus lifes";
}

function setPlayerHealth(health) {
  playerHealthBar.value = health;
}
