var NebPay = require("nebpay");   
var nebPay = new NebPay();
var dappAddress = "n22T4KqfhfRneRm2f8sW6deqJ3EWjraUN5d";

 $('.popup').magnificPopup({
        type:'inline',
        fixedContentPos: true, 
        mainClass: 'mfp-fade',      
        showCloseBtn: true,
        closeOnBgClick: false
      });   

      $('.transaction').magnificPopup({
        type:'inline',
        fixedContentPos: true, 
        mainClass: 'mfp-fade',      
        showCloseBtn: true,
        closeOnBgClick: false
      });   

window.onload = function(){					  
	if(typeof(webExtensionWallet) === "undefined"){	    
    $(".noExtension").show();	  
    $(".content").hide();
  }else{
  }
};	

$('.inrank').click(function(){
  var name = $('.modal input').val() + " ";
  // var name = 'Dron '
  // resultTime = 100.1042;
  alert('When you confirm the transaction, wait 15 seconds and your result will be added to the results table');    
  resultTime = resultTime + "42";
  console.log(resultTime);  
  var to = dappAddress; 
  var value = "0";
  var callFunction = "push";  
  var callArgs = "[\"" + name + "\", \"" + resultTime + "\"]";      
  // interval = setInterval(function reload() {             
  // $('#transaction button').trigger('click');   
  // } , 20000);   
  nebPay.call(to, value, callFunction, callArgs, {       
      listener: cbTest,                        
  });              
  setInterval(function(){ 
    $('.ranking').trigger('click'); 
    $('.transaction').trigger('click'); 
  }, 20000);
})

function cbTest(resp) {  
  console.log('вот он сука: ' + JSON.stringify(resp));  
  // hash_value = resp.txhash;  
  // listnerTransaction();    
  // if (resp.txhash == undefined) {
  //  } else {
  //   // listnerTransaction();    
  // }  
}

function listnerTransaction() {
  $('.transaction').trigger('click');
  // $('.hash').html('txHash: <p>' + hash_value + '</p>'); 

  interval = setInterval(function reload() {       
      // var to = dappAddress;
      // var value = 0;
      // var callFunction = 'read';
      // var callArgs = "[]";    
      // nebPay.simulateCall(to, value, callFunction, callArgs, { 
          // listener: cbTest              
      // });         
      $('#transaction button').trigger('click');   
  } , 20000);
}

$('.ranking').click(function(){  
  var to = dappAddress;   
  var value = "0";
  var callFunction = "read";
  var callArgs = "[]";
  console.log(callArgs);
  nebPay.simulateCall(to, value, callFunction, callArgs, { 
      listener: cbSearch                
  });         
})

function cbSearch(resp) {    
  var result = resp.result;     
  console.log("return of rpc call: " + JSON.stringify(result))
  if (result === ''){           
      $(".errNetwork").show();    
      $(".content").hide();
  } else{             
    try{
      result = JSON.parse(result)
    }catch (err){       
    }
    if (!!result){       
      $("ul").html('<li><span class="name">播放机</span><span class="result">结果</span></li>');
      $.each(result,function(index,value){          
        $("ul").append('<li><span class="name">' + result[index].name + '<span class="adress">' + result[index].from + '</span></span><span class="result">' + result[index].time + '</span></li>')           
      })                
    }
  }    
}



// Memory Game
// © 2014 Nate Wiley
// License -- MIT
// best in full screen, works on phones/tablets (min height for game is 500px..) enjoy ;)
// Follow me on Codepen

(function(){
  
  var Memory = {

    init: function(cards){
      this.$game = $(".game");
      this.$modal = $(".modal");
      this.$overlay = $(".modal-overlay");
      this.$restartButton = $("button.restart");
      this.cardsArray = $.merge(cards, cards);
      this.shuffleCards(this.cardsArray);
      this.setup();      
    },

    shuffleCards: function(cardsArray){
      this.$cards = $(this.shuffle(this.cardsArray));
    },

    setup: function(){
      this.html = this.buildHTML();
      this.$game.html(this.html);
      this.$memoryCards = $(".card");
      this.paused = false;
      this.guess = null; 
      this.binding();
      dimOK();
      startGame = new Date();
      startGame = (startGame.getTime()/1000);      
      console.log(startGame);
    },

    binding: function(){
      this.$memoryCards.on("click", this.cardClicked);
      this.$restartButton.on("click", $.proxy(this.reset, this));
    },
    // kinda messy but hey
    cardClicked: function(){
      var _ = Memory;
      var $card = $(this);
      if(!_.paused && !$card.find(".inside").hasClass("matched") && !$card.find(".inside").hasClass("picked")){
        $card.find(".inside").addClass("picked");
        if(!_.guess){
          _.guess = $(this).attr("data-id");
        } else if(_.guess == $(this).attr("data-id") && !$(this).hasClass("picked")){
          $(".picked").addClass("matched");
          _.guess = null;
        } else {
          _.guess = null;
          _.paused = true;
          setTimeout(function(){
            $(".picked").removeClass("picked");
            Memory.paused = false;
          }, 600);
        }
        if($(".matched").length == $(".card").length){
          _.win();
          finishGame = new Date();
          finishGame = (finishGame.getTime()/1000);          
          console.log(finishGame);
        }
      }
    },

    win: function(){
      this.paused = true;
      setTimeout(function(){
        Memory.showModal();
        Memory.$game.fadeOut();
        $('.sidebar').fadeOut();
      }, 1000);
    },

    showModal: function(){
      this.$overlay.show();
      resultTime = (finishGame - startGame).toFixed(2);
      $('.winner').html('You win in ' + resultTime + ' seconds');
      this.$modal.fadeIn("slow");
    },

    hideModal: function(){
      this.$overlay.hide();
      this.$modal.hide();
    },

    reset: function(){
      this.hideModal();
      this.shuffleCards(this.cardsArray);
      this.setup();
      this.$game.show("slow");     
      $('.sidebar').show("slow"); 
    },

    // Fisher--Yates Algorithm -- https://bost.ocks.org/mike/shuffle/
    shuffle: function(array){
      var counter = array.length, temp, index;
      // While there are elements in the array
      while (counter > 0) {
          // Pick a random index
          index = Math.floor(Math.random() * counter);
          // Decrease counter by 1
          counter--;
          // And swap the last element with it
          temp = array[counter];
          array[counter] = array[index];
          array[index] = temp;
        }
        return array;
    },

    buildHTML: function(){
      var frag = '';
      this.$cards.each(function(k, v){
        frag += '<div class="card" data-id="'+ v.id +'"><div class="inside">\
        <div class="front"><img src="'+ v.img +'"\
        alt="'+ v.name +'" /></div>\
        <div class="back"><img src="./img/nebulas_logo.png"\
        alt="Codepen" /></div></div>\
        </div>';
      });
      return frag;
    }
  };

  var cards = [
    {
      name: "Hitters",
      img: "./img/user-hitters.jpg",
      id: 1,
    },
    {
      name: "Aero",
      img: "./img/user-aero.jpg",
      id: 2
    },
    {
      name: "Becky",
      img: "./img/user-becky.jpg",
      id: 3
    },
    {
      name: "dimOK",
      img: "./img/user-dimOK.png",      
      id: 4
    }, 
    {
      name: "Iris",
      img: "./img/user-iris.jpg",
      id: 5
    },
    {
      name: "Jackie",
      img: "./img/user-jackie.jpg",
      id: 6
    },
    {
      name: "Liyang",
      img: "./img/user-liyang.jpg",
      id: 7
    },
    {
      name: "Peng",
      img: "./img/user-peng.jpg",
      id: 8
    },
    {
      name: "Robin",
      img: "./img/user-robin.jpg",
      id: 9
    },
    {
      name: "Shu",
      img: "./img/user-shu.jpg",
      id: 10
    },
    {
      name: "Yiyi",
      img: "./img/user-yiyi.jpg",
      id: 11
    },
    {
      name: "Yuan",
      img: "./img/user-yuan.jpg",
      id: 12
    },
  ];
    
  Memory.init(cards);

})();

function dimOK() {

  var names = $(".front img").toArray()

  $.each( names ,function(index,value){                         
    if( $(names[index]).attr('alt') == 'dimOK' ) {
      $(names[index]).after('<img src="./img/border.png" class="border" />');
      $(names[index]).css('padding', '15px')
    }
  })

}


