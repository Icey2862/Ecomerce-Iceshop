window.onload = function(){
	// añadiendo data y productos al local
	const addCarroBtn = document.getElementsByClassName('añadirCarrito')
	let items = []
	for(let i=0; i<addCarroBtn.length; i++){
		addCarroBtn[i].addEventListener("click",function(e){
			if(typeof(Storage) !== 'undefined'){
				let item =
                    {
					id:i+1,
					nombre:e.target.parentElement.children[0].textContent,
					precio:e.target.parentElement.children[2].children[0].textContent,
					cantidad:1,
					}
				if(JSON.parse(localStorage.getItem('items')) === null){
					items.push(item)
					localStorage.setItem("items",JSON.stringify(items))
					window.location.reload()
				}else{
					const localItems = JSON.parse(localStorage.getItem("items"))
					localItems.map(data=>{
						if(item.id == data.id){
							item.cantidad = data.cantidad + 1
						}else{
							items.push(data)
						}
					});
					items.push(item)
					localStorage.setItem('items',JSON.stringify(items))
					window.location.reload()
				}
			}
		});
	}
	const iconShoppingP = document.querySelector('.iconShopping p');
	let cantidad = 0
	JSON.parse(localStorage.getItem('items')).map(data=>{
		cantidad = cantidad+data.cantidad
    });
	iconShoppingP.innerHTML = cantidad;

	//añadir los items al carrito
	const cardBoxTable = document.querySelector('.tablax')
	let tableData = ''
	tableData += '<tr><th class="textTable">ID</th><th class="textTable">Nombre</th><th class="textTable">Cantidad</th><th class="p-left textTable">Precio</th><th></th></tr>'
	JSON.parse(localStorage.getItem('items')).map(data=>{
        tableData += '<tr><th class="textTable">'+data.id+'</th><th class="textTable">'+data.nombre+'</th><th class="textTable">'+data.cantidad+'</th><th class="textTable">$'+data.precio+'</th><th> <a href="#" onclick=Delete(this);>Eliminar</a></th></tr>';
    })
    cardBoxTable.innerHTML = tableData
	
	//Calcular total de los productos
	const totalSpace = document.getElementById("total")
	let total = 0
	JSON.parse(localStorage.getItem('items')).map(data=>{
		if(data.cantidad !=1){
			total += (parseInt(data.precio) * parseInt(data.cantidad))  
		} else{
			total += parseInt(data.precio)
		}
	})
	totalSpace.innerText= "El total es de: $"+ total

	//Codigo descuento
	const codigoDescuento = "coderM4N"
	const cuponInput = document.getElementById("cupon")
	const btnAplicar = document.getElementById("aplicarCupon")
	let cupon = false
	btnAplicar.addEventListener("click", ()=>{
		if(cuponInput.value === codigoDescuento){
			totalUno = total * 25 / 100
			total -= totalUno
			cupon = true
			totalSpace.innerText= "El total es de: $"+ total
		}else {
			Swal.fire({
				icon: 'error',
				title: 'Codigo invalido!!',
				text: 'El codigo ingresado no es valido'
			})
		}
	})

	//ButtonComprar que a su vez manda los datos de la compra a la api fake de mockApi
	const btnComprar = document.getElementById("comprar")
	const formulario = document.getElementById("formulario")
	let nameInput = document.getElementById("nameInput")
	let apellidoInput = document.getElementById("apellidoInput")
	let correoInput = document.getElementById("emailInput")
	let telefonoInput = document.getElementById("telefonoInput")
	let direccionInput = document.getElementById("direccionInput")

	btnComprar.addEventListener("click", () =>{
		formulario.onsubmit = (event) => validarFormulario(event);
		function cargarCarrito (carrito){
			fetch("https://62e871cf93938a545be60439.mockapi.io/buyHistory", {
				method: "POST",
				body: JSON.stringify(carrito),
			headers: {
				"Content-type": "application/json",
			},
		})
		.then((response) => response.json())
	}
	function validarFormulario(event){
		Swal.fire({
			icon: 'success',
			title: 'Gracias por su compra!!',
			text: 'Gracias por su compra, le llegara un email con su codigo de seguimiento'
		})	
		event.preventDefault();
		formulario.reset();
		cargarCarrito(enviarCarrito)
	}
	let carrito = 0
	const enviarCarrito = {
		id: carrito + 1,
		productos: JSON.parse(localStorage.getItem('items')),
		totalCompra: total,
		cupon: cupon,
		nombre: nameInput.value + " " + apellidoInput.value,
		correo: correoInput.value,
		telefono: telefonoInput.value,
		direccion: direccionInput.value,
	}
	})
	//ButtonEliminar carrito entero 
	const btnEliminar = document.getElementById("eliminar")
	btnEliminar.addEventListener("click", () =>{
		Swal.fire({
			title: 'Estas seguro?',
			text: "No podra revertir esta accion!",
			icon: 'question',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Si, eliminalo!'
		}).then((result) => {
			if (result.isConfirmed) {
				localStorage.clear()
				window.location.reload()
			}
		})
	})
}

