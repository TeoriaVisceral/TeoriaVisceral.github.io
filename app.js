
const requestURL = 'https://api.npoint.io/6bd4285d6c18280921bc'

class Vertice{

	constructor(numerodeCuento, cuento, isFinal, probConexion, listadeHermanos){

		this.numerodeCuento = numerodeCuento
		this.cuento = cuento
		this.isFinal = isFinal
		this.probConexion = probConexion
		this.listadeHermanos = listadeHermanos

	}

}

const generateRandomNumber = (min, max, op = '0', listNumberExist = []) => {

	if(op == '0'){

		return Math.floor(Math.random() * (max - min)) + min

	}

	let number = Math.floor(Math.random() * (max - min)) + min

	while(listNumberExist.includes(number)){

		number = Math.floor(Math.random() * (max - min)) + min

	}

	return number
}



const generateListNumber = (cant, min, max,listNumber) => {

	for(let i = 0; i < cant; i++){

		listNumber.push(generateRandomNumber(min, max, '1', listNumber))

	}

	return listNumber

}

const generateListFinales = (cantFinales, listadeFinales, tam, probFinalidad) => {

	let i = 0;
	let nroFinales = 0;

	while(nroFinales < cantFinales){

		if(generateRandomNumber(0, 100) <= probFinalidad){

			listadeFinales[i] = 1
			nroFinales = nroFinales + 1
		}

		i = (i + 1) % tam
	}

	return listadeFinales
}

const initList = (tam, list) => {

	for(let i = 0; i < tam; i++){

		list.push(0)

	}

	return list

}

const CreateVertice = (numerodeCuento, cuento, isFinal, probConexion, numCuentos) => {

	const listadeHermanos = []

	for(let i = 0; i < numCuentos; i++){

		if(generateRandomNumber(0, 100) <= probConexion){

			listadeHermanos.push(i)

		}

	}

	const vertice = new Vertice(numerodeCuento, cuento, isFinal, probConexion, listadeHermanos)

	return vertice

}

const getCuento = (listaNumeroDeCuento, listadeFinales, listaDeProbabilidadDeConexion) => {

	const request = new XMLHttpRequest()

	request.open('GET', requestURL)
	request.responseType = 'json'
	request.send()

	request.onload = () => {

		const cuentos = request.response

		const grafo = []
		let primerVertice


		for(let i = 0; i < 24; i++){

			grafo.push(CreateVertice(listaNumeroDeCuento[i], cuentos.Cuentos[listaNumeroDeCuento[i]].Cuento, listadeFinales[i], listaDeProbabilidadDeConexion[i], 24))

		}

		primerVertice = grafo[0].numerodeCuento

		grafo.sort((a, b) => a.numerodeCuento - b.numerodeCuento)

		Lectura(grafo, primerVertice)
	}

}

const searchCuento = (key, list, L, R , pivot) => {

	if(L > R){

		return ""

	}

	pivot = Math.trunc((L + R) / 2)

	console.log(pivot)

	if(list[pivot].numerodeCuento < key){

		return searchCuento(key, list, pivot + 1, R, 0)
	}
	
	if(list[pivot].numerodeCuento > key){

		return searchCuento(key, list, L, pivot - 1, 0)
	
	}
	
	console.log(list[pivot].cuento)

	return list[pivot].cuento

}

const CuentoFinal = () => {

	let cuentoMostrado = document.querySelector('#current')
	let tituloCuento = document.querySelector('#titulo')
	let selectList = document.querySelector('#listNext')

	tituloCuento.innerHTML = "-3"

	cuentoMostrado.innerHTML = "Automata estaba mirando fijamente una piedra que estaba en el piso. El sol estival radiante la calentaba y hacia brillar. Las pupilas dilatadas de Automata parecian buscar aquel misterio que desde hace milenios o quizas horas lo llevaba persiguiendo.- Esa piedra dejo de ser interesante hace media hora- Dijo Maquinista mientras se reia de lo abstraido que estaba su amigo.-Esto puede ser una importante pista, los objetos brillantes son importantes pistas. Ademas esta piedra no es cualquier piedra es LA PIEDRA, pero mi cuerpo organico no puede tocarla, tu mecanica mano nos seria de ayuda. Maquinista no se habia percatado de que su querido y carnozo brazo izquierdo ahora era un brillante trozo de metal isomorfico a el antiguo artefacto que ocupaba su lugar. En aquella realidad era normal que cosas se transformaran en otras, Maquinista por su parte siempre lo hacia, aunque parecia tener un secreto para que su cuerpo volviera su forma habitual. Al levantar LA PIEDRA paso lo obvio. La realidad colapso sobre si misma, transportando a Maquinista y Automata al inicio de este cuento. Automata estaba mirando fijamente una piedra que estaba en el piso. El sol estival radiante la calentaba y hacia brillar. Las pupilas dilatadas de Automata parecian buscar aquel misterio que desde hace milenios o quizas horas lo llevaba persiguiendo..."

}


const Lectura = (grafo, numeroCuentoActual) => {

	let cuentoMostrado = document.querySelector('#current')
	let selectList = document.querySelector('#listNext')
	let tituloCuento = document.querySelector('#titulo')

	selectList.addEventListener('change', (event) => {

		if(event.handled !== true){

			event.handled = true;

			let siguiente = event.target.value

			if(siguiente == -3){

				CuentoFinal()

			}

			while(selectList.options.length > 0){

				selectList.remove(0)

			}

			Lectura(grafo, siguiente)

			return

		}

	})

	tituloCuento.innerHTML = numeroCuentoActual

	let opt = document.createElement('option')
	opt.value = -1
	opt.innerHTML = "Siguiente"
	selectList.appendChild(opt)

	selectList.selectedIndex

	if(grafo[numeroCuentoActual].isFinal == 1){

		let opt = document.createElement('option')
		opt.value = -3
		opt.innerHTML = "Final"
		selectList.appendChild(opt)

		selectList.selectedIndex

	}

	for(let i = 0; i < grafo[numeroCuentoActual].listadeHermanos.length; i++){

		const opt = document.createElement('option')
		opt.value = grafo[numeroCuentoActual].listadeHermanos[i]
		opt.innerHTML = grafo[numeroCuentoActual].listadeHermanos[i]

		selectList.appendChild(opt)
	
	}

	cuentoMostrado.innerText = searchCuento(numeroCuentoActual, grafo, 0, 24 , 0)

}

const listaNumerodeCuento = generateListNumber(24, 0, 24, [])
const listaDeProbabilidadDeConexion = generateListNumber(24, 0, 101, [])
let listdeFinales = initList(24, [])

listdeFinales = generateListFinales(3, listdeFinales, 24, 1)

//console.log(CreateVertice(listaNumerodeCuento[0], "", listdeFinales[0], listaDeProbabilidadDeConexion[0], 24))

getCuento(listaNumerodeCuento, listdeFinales, listaDeProbabilidadDeConexion)