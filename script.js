addItem = (event) => {
  event.preventDefault();
  let text = document.getElementById("todo-input");
  console.log(text.value);
  this.db
    .collection("todo-item")
    .add({
      text: text.value,
      status: "active",
    })
    .then((docRef) => {
      console.log("Document written with ID: ", docRef.id);
    })
    .catch((error) => {
      console.error("Error adding document: ", error);
    });
};
getItems = () => {
  db.collection("todo-item").onSnapshot((snapshot) => {
    let items = [];
    snapshot.docs.forEach((doc) => {
      items.push({
        id: doc.id,
        ...doc.data(),
      });
    });
    generateItems(items);
  });
};
generateItems = (items) => {
  let itemsHtml = "";
  items.forEach((item) => {
    itemsHtml += `
          <div class="todo-item">
            <div class="check">
              <div class="check-mark ${item.status=="completed" ?  "checked" : "" }" data-id="${item.id}">
                <img src="./assets/images/icon-check.svg" alt="" />
              </div>
            </div>
            <div class="todo-text ${item.status=="completed" ?  "checked" : "" }">${item.text}</div>
          </div>
          `;
  });
  document.querySelector(".todo-items").innerHTML = itemsHtml;
  createEventListeners();
};
createEventListeners = () => {
  let todoCheckMarks = document.querySelectorAll(".todo-item .check-mark");
  todoCheckMarks.forEach((checkMark) => {
    checkMark.addEventListener("click", () => {
      markCompleted(checkMark.dataset.id);
    });
  });
};
markCompleted = (id) => {
  let item = db.collection("todo-item").doc(id);
  item.get().then((doc) => {
    if (doc.exists) {
      let status = doc.data().status;
      if (status == "active") {
        item.update({ status: "completed" });
      } else {
        item.update({ status: "active" });
      }
    }
  });
};
getItems();
