const cartListCont = document.querySelector(".cart-full ul");
const cartFullTemp = document.querySelector(".cart-full");
const cartEmpthyTemp = document.querySelector(".cart-empthy");
let proIncreaseDecreaseBtns = undefined;
let addToCartBtns = undefined;
let eachItemTotalQuantity = undefined;
const itemCont = document.querySelector(".products");
const cartHeader = document.querySelector(".cart-header");
const totalOrderPrice = document.querySelector(".total-order-price");
const thumbnailTemplate = document.querySelector(".thumpnail-temp-cont");
const consfirmOrderBtn = document.querySelector(".order-confirm-btn");
const newOrderBtn = document.querySelector(".new-order");
const thumbnailItems = document.querySelector(".temp-middle ul");
const tempTotalPrice = document.querySelector(".temp-total-price")
let deleteBtns = undefined;

let itemHtml = ``;
let btnIds = 0;
let dataForCart = undefined;

/* inserts items into html */
fetch("./data.json").then(resp =>{
	resp.json().then(data => {
		dataForCart = data
		data.forEach(each => {
		itemHtml += `
		 <div class="product">
          <div class="upper-part">
            <img src="${handlecorrectImgSize(each)}" alt="${each.name}">

            <div class="pro-add-btn">

              <button id="${each.id}" aria-checked="false" class="add-to-cart-btn">
                <img src="./assets/images/icon-add-to-cart.svg" alt="">
                <span>Addt to cart</span>
              </button>
              <!-- ========== -->
               <div id="${each.id}" aria-checked="false" class="pro-increase-decrease">
                  <button id="${each.id}" data-name="decrement" class="decrement">
                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="2" fill="none" viewBox="0 0 10 2"><path fill="#fff" d="M0 .375h10v1.25H0V.375Z"/></svg>
                  </button>
                  
                  <span id="${btnIds - 1}" class="pro-quantity">1</span>
  
                  <button id="${btnIds}" data-name="increment" class="increment">
                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="none" viewBox="0 0 10 10"><path fill="#fff" d="M10 4.375H5.625V0h-1.25v4.375H0v1.25h4.375V10h1.25V5.625H10v-1.25Z"/></svg>
                  </button>
               </div>
            </div>
          </div>

          <div class="pro-info">
            <span class="dessert-family">
						${each.category}
            </span>
            <span class="name">
						${each.name}
            </span>
            <span class="price">
              $${(each.price).toFixed(2)}
            </span>
          </div>
        </div>
		`;
		btnIds++;
	});
	itemCont.innerHTML = itemHtml

	})
})

function handlecorrectImgSize(each) {
	let correspondingImg = undefined;
	if(window.innerWidth > 560 && window.innerWidth < 720) {
		correspondingImg = each.image.tablet
	}
	else if(window.innerWidth > 720) {
		correspondingImg = each.image.desktop
	}
	else {
		correspondingImg = each.image.mobile
	}
	return correspondingImg
}

/* handles item buttons */
let cartItems = [/* {name: "catana perisan", price: 66, quantity: 10} */];

function handleAddToCartBtns () {
	proIncreaseDecreaseBtns = document.querySelectorAll(".pro-increase-decrease");
	addToCartBtns = document.querySelectorAll(".add-to-cart-btn");
	eachItemTotalQuantity = document.querySelectorAll(".pro-quantity");


	addToCartBtns.forEach(each => {
		each.addEventListener("click", () =>{
			each.setAttribute("aria-checked", "true");
			addToCart(dataForCart[each.id], dataForCart[each.id].id, each)
			handleCartPopulation();

			proIncreaseDecreaseBtns.forEach(btn => {
				if(btn.id === each.id) {
					btn.setAttribute("aria-checked", "true");
					btn.children[2].addEventListener("click", () => {
						
						addToCart(dataForCart[each.id], dataForCart[each.id].id, btn.children[2])
						
						
					});

					btn.children[0].addEventListener("click", () => {
					
					addToCart(dataForCart[each.id], dataForCart[each.id].id, btn.children[0])
					
					})

				}
				else {
					return
				}
			})
		})
	});
}
setTimeout(handleAddToCartBtns, 1000);
handleAddToCartBtns()

/* inserts cart items into cart html */

let cartListHtml = ``;

function handleCartPopulation() {
	cartListHtml = ``
	if(cartItems.length > 0) {
		cartItems.forEach(each => {
			cartListHtml += `
			 <li class="cart-items">
								<div class="cart-item-info">
									<span class="item-name">${each.name}</span>
									<div class="item-price-quantity-total-price">
										<span class="quantity">${each.quantity}x</span>
										<span class="price">@$${each.price.toFixed(2)}</span>
										<span class="total-price">${totalPrice(each)}</span>
									</div>
								</div>
								<span class="cart-item-del-icon" id="${each.id}">
									<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" viewBox="0 0 10 10"><path fill="#CAAFA7" d="M8.375 9.375 5 6 1.625 9.375l-1-1L4 5 .625 1.625l1-1L5 4 8.375.625l1 1L6 5l3.375 3.375-1 1Z"/></svg>
								</span>
						</li>
			`;
		});
		cartEmpthyTemp.classList.add("is-none")
		cartFullTemp.classList.remove("is-none")
		cartListCont.innerHTML = cartListHtml;
		deleteBtns = document.querySelectorAll(".cart-item-del-icon");
		deleteFromCart();
	}
	else if(cartItems.length === 0){
		cartEmpthyTemp.classList.remove("is-none")
		cartFullTemp.classList.add("is-none")
		console.log(cartFullTemp.classList)
	}
};
handleCartPopulation();

function addToCart(item, id, btn) {
	let idToCheck = id;
	let foundDessert = cartItems.find(index => index.id === idToCheck)
	if(cartItems.length === 0) {
		cartItems.push({name: item.name, price: item.price, quantity: 1, id: item.id, img: item.image.thumbnail})
		console.log(cartItems)
		
	}
	else if(!foundDessert) {
		cartItems.push({name: item.name, price: item.price, quantity: 1, id: item.id, img: item.image.thumbnail})
		
		console.log(cartItems)
	}
	else if(btn.dataset.name === "increment"){
		cartItems.forEach(Citem => {
			Citem.id === id? Citem.quantity++: console.log("error")
		})
		
	}
	else if(btn.dataset.name === "decrement"){
		let CcartItemsId = ``
		cartItems.forEach(Citem => Citem.id === id? CcartItemsId = Citem.quantity: console.log("Error") )
		if(CcartItemsId > 1) {
			cartItems.forEach(Citem => {
				Citem.id === id? Citem.quantity--: console.log("error")
			})
		}
	}
	handleCartPopulation();
	handlesCorresPoItemQ(id);
}



/* calculates total price */
function totalPrice(each) {
	allItemsQuantity()
	return (each.price * each.quantity).toFixed(2)
}

/* calculates Quantity of all items */
function allItemsQuantity() {
	let quan = 0;
	if(cartItems) {
		cartItems.forEach(each => {
			quan += each.quantity
		})
	}
	cartHeader.innerHTML = `Your Cart(${quan})`
}


/* returns each item's quantity */
function handlesCorresPoItemQ(id) {
	console.log(id)
	let singlrItemQ = document.querySelectorAll(".pro-quantity");
	cartItems.forEach(each => {
		if(each.id === id){
			singlrItemQ[id].innerHTML = each.quantity
		}
	})
	calculateOrderTotalCost()
};

/* Deletes from cart */;
function deleteFromCart() {
	let singlrItemQ = document.querySelectorAll(".pro-quantity");

	if(deleteBtns.length > 0) {
		deleteBtns.forEach(eachElem => {
			eachElem.addEventListener("click", (e) => {
				cartItems.forEach(eachCartPro => {
					if(eachCartPro.id === Number(eachElem.id)) {
						if(eachCartPro.quantity > 1) {
							eachCartPro.quantity --;
							singlrItemQ[eachElem.id].innerHTML = eachCartPro.quantity
							handleCartPopulation()
						}
						else {
							cartItems = cartItems.filter(eachFil => {
								return eachFil.id !== Number(eachElem.id)
							});

							/* hides the quantity of item when is deleted from cart */
							addToCartBtns.forEach(Del => {
								if(Number(Del.id) === eachCartPro.id) {
									console.log(Del.id)
									Del.setAttribute("aria-checked", "false")
								}
							});

							proIncreaseDecreaseBtns.forEach(eachDel => {
								if(Number(eachDel.id) === eachCartPro.id) {
									console.log("parisa")
									eachDel.setAttribute("aria-checked", "false")
								}
							})
							singlrItemQ[eachElem.id].innerHTML = eachCartPro.quantity
							handleCartPopulation()
						}
					}
				})
			})
		})
	}
}


/* calculates cost of total order */
function calculateOrderTotalCost() {
	let totalCos = 0;
	cartItems.forEach(each => {
		totalCos += each.quantity * each.price
	});
	totalOrderPrice.innerHTML = `$${totalCos.toFixed(2)}`;
	return totalCos;
}

/* shows the thumbnail template */
function showThumbTemplate() {
	thumbnailTemplate.classList.remove("is-none");
	tempTotalPrice.innerHTML = `$${calculateOrderTotalCost().toFixed(2)}`
	loadThumbnail();
};
consfirmOrderBtn.addEventListener("click", showThumbTemplate);

/*populates the thumbnail template*/
let thumbnailItemsHtml = ``
function loadThumbnail() {
	thumbnailItemsHtml = ``;
	cartItems.forEach(eachCartItem => {
		console.log(eachCartItem)
		thumbnailItemsHtml += `
		  <li>
          <img src="${eachCartItem.img}" alt="${eachCartItem.name}">
          <div class="temp-list-info">
            <span class="name">
              ${eachCartItem.name}
            </span>
            <div class="price-quantity">
              <span class="temp-quantity">${eachCartItem.quantity}x</span>
              <span class="temp-price">$${(eachCartItem.price).toFixed(2)}</span>
            </div>
          </div>
          <span class="temp-list-total-price">$${(eachCartItem.price * eachCartItem.quantity).toFixed(2)}</span>
        </li>
		`
	});
	thumbnailItems.innerHTML = thumbnailItemsHtml
}
newOrderBtn.addEventListener("click", () => {
	location.reload()
})
console.log(thumbnailItems)