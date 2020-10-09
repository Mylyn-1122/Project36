//Create variables here
var dog, dogImg, happyDog, database, foodS, foodStock;
var fedTime, lastFed;
var foodObj;
var lastStocked;
var lastFed;
var readinggameState, changingGameState;
var bedroomIMG, gardenIMG, washroomIMG;
var gameState;
var feedPet, addFood;
function preload()
{
  //load images here
  dogImg = loadImage("images/dogImg.png");
  happyDog = loadImage("images/dogImg1.png");
  bedroomIMG = loadImage("images/Bed Room.png");
  gardenIMG = loadImage("images/Garden.png");
  washroomIMG = loadImage("images/Wash Room.png")
  

}

function setup() {
  createCanvas(500, 500);
  rectMode(CENTER);
  database = firebase.database();
  dog = createSprite(250, 250, 20, 20);
  dog.addImage(dogImg)
  dog.scale = 0.25;

  foodStock = database.ref("Food");
  foodStock.on("value", readStock);

  foodObj = new Food();

  feedPet = createButton('Feed the Pet')
  feedPet.position(700, 95);
  feedPet.mousePressed(feedDog);

  addFood = createButton('Add Food')
  addFood.position(800, 95);
  addFood.mousePressed(addFoods);

  readGameState = database.ref('gameState');
  readGameState.on("value", function(data){
    gameState = data.val();
  })
}


function draw() {  
  background(color(46, 139, 87))



  fedTime = database.ref('FeedTime')
  fedTime.on("value",function(data){
    lastFed=data.val();
  })

  foodObj.display();

  //console.log(foodStock)

  if(gameState !== "Hungry"){
    feedPet.hide();
    addFood.hide();
    dog.remove();
  }
  else{
    feedPet.show();
    addFood.show();
    dog.addImage(dogImg);
  }

  currentTime = hour();
  if(currentTime <= (lastFed + 1)){
    update("Playing");
    foodObj.garden();
  }
  else if(currentTime === (lastFed + 2)){
    update("sleeping");
    foodObj.bedroom();
  }
  else if(currentTime > (lastFed + 2) && currentTime <=(lastFed+4)){
    update("Bathing");
    foodObj.washroom();
  }
  else{
    update("Hungry");
    foodObj.display();

  }
  drawSprites();
  //add styles here
  fill(255);
  stroke(20);
  text("Food Stock" + ":" + foodStock, 400, 100)

  textSize (15);
  if(lastFed >= 12){
    text("Last Feed : " + lastFed % 12 + " PM", 350, 30);
  }
  else if(lastFed === 0){
    text("last feed : 12 AM", 350, 30)
  }
  else{
    text("Last Feed : " + lastFed + " AM", 350, 30)
  }

}

function readStock(data){
  Food = data.val()
  foodStock = Food
}

function feedDog(){
  dog.addImage(happyDog);

  foodStock = foodStock - 1;
  
  database.ref('/').update({
    Food : foodStock,
    FeedTime : hour()
  })
}

function addFoods(){
  foodStock ++;
  database.ref("/").update({
    Food : foodStock
  })
}

function update(state){
  database.ref('/').update({
    gameState:state
  })
}