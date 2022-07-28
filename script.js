/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
let cart = [];
let modalQt = 1;
let modalKey = 0;

const C = (el) => document.querySelector(el); //sub queryselector

const CS = (el) => document.querySelectorAll(el);

//piza list
pizzaJson.map((item, index) => {
  let pizzaItem = C(".models .pizza-item").cloneNode(true);
  //preencher informações em pizzaItem

  pizzaItem.setAttribute("data-key", index);
  pizzaItem.querySelector(".pizza-item--img img").src = item.img;
  pizzaItem.querySelector(".pizza-item--name").innerHTML = item.name;
  pizzaItem.querySelector(".pizza-item--desc").innerHTML = item.description;
  pizzaItem.querySelector(
    ".pizza-item--price"
  ).innerHTML = `R$ ${item.price.toFixed(2)}`;
  pizzaItem.querySelector("a").addEventListener("click", (e) => {
    e.preventDefault();

    let key = e.target.closest(".pizza-item").getAttribute("data-key");
    modalQt = 1;
    modalKey = key;

    //info modal
    C(".pizzaBig img").src = pizzaJson[key].img;
    C(".pizzaInfo h1").innerHTML = pizzaJson[key].name;
    C(".pizzaInfo--desc").innerHTML = pizzaJson[key].description;
    C(".pizzaInfo--actualPrice").innerHTML = `R$ ${pizzaJson[key].price.toFixed(
      2
    )}`;
    C(".pizzaInfo--size.selected").classList.remove("selected");
    CS(".pizzaInfo--size").forEach((size, sizeIdex) => {
      if (sizeIdex == 2) {
        size.classList.add("selected");
      }
      size.querySelector("span").innerHTML = pizzaJson[key].sizes[sizeIdex];
    });

    //set modalQt = 1;
    C(".pizzaInfo--qt").innerHTML = modalQt;

    //transition modal
    C(".pizzaWindowArea").style.opacity = 0;
    setTimeout(() => {
      C(".pizzaWindowArea").style.opacity = 1;
    }, 200);
    C(".pizzaWindowArea").style.display = "flex";
  });

  C(".pizza-area").append(pizzaItem);
});

// modal events

function closeModal() {
  C(".pizzaWindowArea").style.opacity = 0;
  setTimeout(() => {
    C(".pizzaWindowArea").style.display = "none";
  }, 500);
}

CS(".pizzaInfo--cancelButton", ".pizzaInfo--cancelMobileButton").forEach(
  (item) => {
    item.addEventListener("click", closeModal);
  }
);

//set modalQtpizzas+ -

C(".pizzaInfo--qtmenos").addEventListener("click", () => {
  if (modalQt > 1) {
    modalQt--;
    C(".pizzaInfo--qt").innerHTML = modalQt;
  }
});
C(".pizzaInfo--qtmais").addEventListener("click", () => {
  modalQt++;
  C(".pizzaInfo--qt").innerHTML = modalQt;
});

//size modalQtpizzas

CS(".pizzaInfo--size").forEach((size, sizeIdex) => {
  size.addEventListener("click", (e) => {
    C(".pizzaInfo--size.selected").classList.remove("selected");
    size.classList.add("selected");
  });
});

//shopping cart
C(".pizzaInfo--addButton").addEventListener("click", () => {
  //sizePizza
  let size = parseInt(C(".pizzaInfo--size.selected").getAttribute("data-key"));

  let indetifier = pizzaJson[modalKey].id + "@" + size;

  //check the cart if you have repeated item
  let key = cart.findIndex((item) => item.indetifier == indetifier);

  if (key > -1) {
    cart[key].qt += modalQt;
  } else {
    //getcartinfo
    cart.push({
      indetifier,
      id: pizzaJson[modalKey].id,
      size,
      qt: modalQt,
    });
  }
  updateCart();
  closeModal();
});

C('.menu-openner').addEventListener ('click',()=>{
  if(cart.length > 0){
    C('aside').style.left = '0';
  }
});

C('.menu-closer').addEventListener('click',()=>{
  C('aside').style.left = '100vw';
});

function updateCart() {
  C('.menu-openner span').innerHTML = cart.length;


  if (cart.length > 0) {
    C("aside").classList.add("show");
    C(".cart").innerHTML = "";

    let subtotal = 0;
    let desconto = 0;
    let total = 0;


    for (let i in cart) {
      let pizzaItem = pizzaJson.find((item) => item.id == cart[i].id);
      subtotal += pizzaItem.price * cart[i].qt;

      let cartItem = C(".models .cart--item").cloneNode(true);

      let pizzaSizeName;
      switch (cart[i].size) {
        case 0:
          pizzaSizeName = "P";
          break;
        case 1:
          pizzaSizeName = "M";
          break;
        case 2:
          pizzaSizeName = "G";
          break;
      }

      let pizzaName = `${pizzaItem.name}(${pizzaSizeName})`;

      //img
      cartItem.querySelector("img").src = pizzaItem.img;
      //name
      cartItem.querySelector(".cart--item-nome").innerHTML = pizzaName;
      //qtd
      cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;
      //action cart
      cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', ()=>{
        if(cart[i].qt > 1){
          cart[i].qt--;
        } else {
          cart.splice(i, 1);
        }
        updateCart();
      });

      //add
      cartItem.querySelector('.cart--item-qtmais').addEventListener('click',()=>{
        cart[i].qt++;
        updateCart();
      });

      C(".cart").append(cartItem);
    }
    
    desconto = subtotal * 0.1;
    total = subtotal - desconto;

    C('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}` 
    C('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}` 
    C('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;

  } else {
    C('aside').classList.remove("show");
    C('aside').style.left = '100vw';
  }
}
