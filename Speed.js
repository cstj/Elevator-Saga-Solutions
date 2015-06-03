{
    init: function(elevators, floors) {
        var inArray = function(array, value) {
            var ret = false;
            array.forEach(function(a){
                if (a === value) {
                    ret = true;
                }
            });
            return ret;            
        };
        
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
            elevator.on("idle", function() { 
                elevator.goToFloor(0);
                elevator.goToFloor(floors.length - 1);
            });
            
            
            
            elevator.on("floor_button_pressed", function(floorNum) {
            });
            
            elevator.factor = 1 - (1 / elevator.maxPassengerCount());
            
            elevator.on("passing_floor", function(floorNum, direction) {
                var floor = floors[floorNum];
                console.log("Floor " + floorNum + " - Up: " + floor.buttonStates.up + " Down: " + floor.buttonStates.down);
                console.log("Direction " + direction + " LoadFactor " + elevator.loadFactor())
                //Test if there is someone waiting of the button is pushed
                if (direction == "up" && elevator.loadFactor() < elevator.factor && floor.buttonStates.up == "activated"){
                    elevator.goToFloor(floorNum, true);
                } else if (direction == "down" && elevator.loadFactor() < elevator.factor && floor.buttonStates.down == "activated"){
                    elevator.goToFloor(floorNum, true);
                }
                
                if (inArray(elevator.getPressedFloors(), floorNum)){
                    elevator.goToFloor(floorNum, true);
                };
            });
            
            elevator.on("stopped_at_floor", function(floorNum) {
                if (elevator.currentFloor() == 0){
                    elevator.setDirection("up");
                } else if (elevator.currentFloor() == floors.length - 1) {
                    elevator.setDirection("down");
                };
            });
            
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
