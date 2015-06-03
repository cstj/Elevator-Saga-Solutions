{
    init: function(elevators, floors) {
        //Function to check if a value is in an array
        var inArray = function(array, value) {
            var ret = false;
            array.forEach(function(a){
                if (a === value) {
                    ret = true;
                }
            });
            return ret;            
        };
        
        //Initial positions for elevators, make them go all over the place so they dont start synced.
        for(var i = 0; i < elevators.length; i++){
            if (i==1) {
                elevators[i].goToFloor(0, true)
            } else if (i==1) {
                elevators[i].goToFloor(floors.length - 1, true)}
            else {
                elevators[i].goToFloor(i, true) 
            }
        }
        
        //################ Elevators
        elevators.forEach(function(elevator){
            //On idle, go up and down!  TODO only goto top waiting floor OR pushed button and bottom waiting floor OR pushed button
            elevator.on("idle", function() { 
                elevator.goToFloor(0);
                elevator.goToFloor(floors.length - 1);
            });
            
            //Who cares if you pushed a button!
            elevator.on("floor_button_pressed", function(floorNum) {
            });
            
            //Calculate the load factor minus one passenger
            elevator.factor = 1 - (1 / elevator.maxPassengerCount());
            
            //When we are passing floros check many things
            elevator.on("passing_floor", function(floorNum, direction) {
                var floor = floors[floorNum];

                //Test if there is someone waiting at the floor and we have space and we are going in the right direction
                if (direction == "up" && elevator.loadFactor() < elevator.factor && floor.buttonStates.up == "activated"){
                    elevator.goToFloor(floorNum, true);
                } else if (direction == "down" && elevator.loadFactor() < elevator.factor && floor.buttonStates.down == "activated"){
                    elevator.goToFloor(floorNum, true);
                }
                
                //Also has the floor button been pushed
                if (inArray(elevator.getPressedFloors(), floorNum)){
                    elevator.goToFloor(floorNum, true);
                };
            });
            
            //if we are at the max floor or lowest floor then flip the indicator.  TODO like idle, only goto max floor pushed or button pusehd / min floor pushed or button pushed
            elevator.on("stopped_at_floor", function(floorNum) {
                if (elevator.currentFloor() == 0){
                    elevator.setDirection("up");
                } else if (elevator.currentFloor() == floors.length - 1) {
                    elevator.setDirection("down");
                };
            });
            
            //Set the direction of the elevator
            elevator.setDirection = function(dir){
                if (dir == "up") {
                    elevator.goingUpIndicator(true);
                    elevator.goingDownIndicator(false);
                } else if (dir == "down") {
                    elevator.goingUpIndicator(false);                    
                    elevator.goingDownIndicator(true);
                } else {
                    elevator.goingUpIndicator(true);                    
                    elevator.goingDownIndicator(true);
                };
            };
        });
            
        //################ Floors
        floors.forEach(function(floor){
            //I dont care that you pushed a button! Ill get there when i get there!
            floor.on("up_button_pressed", function() {
            });
            
            floor.on("down_button_pressed", function() {
            });
        });
    },
    update: function(dt, elevators, floors) {
        // We normally don't need to do anything here
    }
}
