//DOM Elements
const totalBalance = document.getElementById("total_balance");
const totalIncome = document.getElementById("income");
const totalExpense = document.getElementById("expense");
const message = document.getElementById("message");
const list = document.getElementById("transaction_list");
const details = document.getElementById("details");
const transactionAmount = document.getElementById("transaction_amount");
//Set current date to show the date of transaction
let d = new Date();
let date = `(${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()})`;
console.log(date);
const submit = document.getElementById("submit");
const reset = document.getElementById("reset");
reset.addEventListener("click", resetTransactions);
//Creating a transactions array
let transactions =
  localStorage.getItem("transactions") !== null
    ? JSON.parse(localStorage.getItem("transactions"))
    : [];
window.addEventListener("load", init);
function init() {
  details.focus();
  updateLocalStorage();
  updateValues();
  transactions.forEach(updateTransactions);
  checkList();
}
submit.addEventListener("click", createTransaction);
//Check if list is empty
function checkList() {
  if (list.innerHTML === "") {
    message.style.display = "block";
    reset.disabled = true;
  } else {
    message.style.display = "none";
    reset.disabled = false;
  }
}
//Function to create transaction
function createTransaction(e) {
  e.preventDefault();
  let transactionType = document.querySelector(
    "input[name=transaction]:checked"
  ).value;
  if (isNaN(transactionAmount.value)) {
    alert("Please enter a valid amount");
  } else if (details.value === "") {
    alert("Transactions details cannot be empty");
  } else if (transactionAmount.value == 0) {
    alert("Amount cannot be zero");
  } else if (
    transactionType === "expense" &&
    transactionAmount.value > Number(totalBalance.innerText)
  ) {
    alert("Expense amount cannot be more than total balance");
  } else {
    let transaction = {
      id: Date.now(),
      type: transactionType,
      detail: details.value,
      amount:
        transactionType === "income"
          ? Number(transactionAmount.value)
          : Number(transactionAmount.value) * -1,
    };
    //Push the current transaction to the transactions[] array
    transactions.push(transaction);
    updateLocalStorage();
    updateValues();
    updateTransactions(transaction);
    checkList();
    console.log(transactions);
  }
  //Clear the input fields
  details.value = "";
  transactionAmount.value = "";
  details.focus();
}
//Function to update values
function updateValues() {
  let amounts = transactions.map((currentTransaction) => {
    return currentTransaction.amount;
  });
  let total = amounts.reduce((total, amount) => {
    return (total += amount);
  }, 0);
  let tIncome = amounts
    .filter((amount) => {
      return amount > 0;
    })
    .reduce((total, amount) => {
      return (total += amount);
    }, 0);
  let tExpense = amounts
    .filter((amount) => {
      return amount < 0;
    })
    .reduce((total, amount) => {
      return (total += amount);
    }, 0);
  totalIncome.innerText = tIncome.toFixed(2);
  totalExpense.innerText = (tExpense * -1).toFixed(2);
  totalBalance.innerText = total.toFixed(2);
}
//Function to update transactions
function updateTransactions(transaction) {
  let sign = transaction.type === "income" ? "plus" : "minus";
  let item = document.createElement("li");
  item.classList.add("list-group-item", sign);
  item.innerHTML = `<font id="detail">${
    transaction.detail
  } <span>${date}</span></font> 
  <div class="amount_div">
    <span>&#8377<span id="money">${Math.abs(transaction.amount)}</span></span>
    <button class="btn btn-danger" id="dlt_btn" onclick="deleteTransaction(${
      transaction.id
    })"><i class="fas fa-trash-alt"></i></button>
  </div>`;
  list.appendChild(item);
}
//Function to delete transaction
function deleteTransaction(id) {
  if (window.confirm("Are you sure?")) {
    transactions = transactions.filter((transaction) => {
      return transaction.id !== id;
    });
    list.innerHTML = "";
    updateLocalStorage();
    transactions.forEach(updateTransactions);
    updateValues();
    checkList();
  }
}
//Function to save transactions to localstorage
function updateLocalStorage() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}
//Function to reset transactions
function resetTransactions() {
  if (window.confirm("Are you sure to delete all transactions?")) {
    transactions = [];
    init();
  }
}
