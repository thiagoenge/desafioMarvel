
//Inicia a aplicacao em angular
var appAngular = angular.module('marvelApp', []);
//Controller Principal
appAngular.controller('personagem',['$http', function($http) {
	// evitando problemas com escopos
	var self = this;
	// Inicia a pontuacao pela pontuacao gravada no browser, se nao houver inicia com 0
	self.pontos = Number(localStorage.pontos) || 0
	// container para os dados da requisicao
	self.items = [];
	// handler para tratar o envio da informacao
	self.submit = function(){
		if(!self.charNameInputed){//se o campo estiver vazio adiciona validacao
			self.validaCampo = true
			self.validaCampoClass = "invalid"
		}else{// se nao tiver vazio 
			self.validaCampo = false
			self.validaCampoClass = ""
			if(self.calculaPontos()){ //verifica se a resposta esta certa ou errada
				self.searchChar() // se estiver certa passa para o proximo personagem
			}
			//guarda a pontuação no browser
			localStorage.setItem("pontos",self.pontos)
			//Compartilhar link do resultado atualizado
			self.shareWhatsapp = "https://api.whatsapp.com/send?text="+encodeURIComponent("Eu fiz: "+self.pontos+" pontos.\nVeja quantos pontos consegue fazer em:\n"+window.location)
		}
	}
	self.getHelp = function(){
		self.charNameInputed = self.items.name;
		self.ajuda = true
	}
	// encapsulando a chamada numa função para ser utilizada novamente no click do botao "Responder"
	self.searchChar = function(){
		//Exibe o loading enquanto a requisicao nao termina
		self.hideLoader=false;
		//numeros aleatório para sempre trazer personagens novos
		this.randomOffset = Math.floor(Math.random() * 1000 + 1)
		// abre a conexão com a api da marvel
		$http.get('https://gateway.marvel.com:443/v1/public/characters?limit=1&offset='+this.randomOffset+'&apikey=ebdfa816a9ce6fea4176886d00243106').then(function(response){
			//guarda as informações recebidas no formato json; como limitei o retorno da api em 1 personagem por vez, sempre busco o primeiro item do array
			self.items = response.data.data.results[0]
			//esconde o loading quando a requisicao termina
			self.hideLoader=true;
			//console.log(self.items)
			//trata o nome retirando textos entre parentesis
			self.items.name = self.items.name.replace(/(\s\(.*?\))/g,"")
			console.log(self.items.name)

			// limpa o campo
			self.charNameInputed = ""
			//Zera a ajuda
			self.ajuda = false
			//trata se houver algum erro na requisição
		},function(err){
			console.log("Erro inesperado:",err)
		});
	}
	self.searchChar()
	// logica dos pontos
	self.calculaPontos = function(){
		// se o nome inputado casar com o nome vindo da api 
		if(self.charNameInputed.toLowerCase() == self.items.name.toLowerCase()){
			// verifica se utilizou ajuda 
			if(self.ajuda)self.pontos = self.pontos  //se sim, passa mas nao soma pontos
			else self.pontos += 1 //se nao, passa e soma ponto
				return true 
		}else{//se a resposta estiver errada
			//verifica se tem pontos a serem retirados
			if(self.pontos > 0)
			self.pontos -= 1 //se sim tira 1
		return false
	}
}
	//Compartilhar link do resultado atual
	self.shareWhatsapp = "https://api.whatsapp.com/send?text="+encodeURIComponent("Eu fiz: "+self.pontos+" pontos.\nVeja quantos pontos consegue fazer em:\n"+window.location)
}]);
