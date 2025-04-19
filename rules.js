class Start extends Scene {
    create() {
        this.engine.setTitle(this.engine.storyData.Title); // DONE: replace this text using this.engine.storyData to find the story title
        this.engine.addChoice("Begin the story");
    }

    handleChoice() {
        this.engine.gotoScene(Location, this.engine.storyData.InitialLocation); // DONE: replace this text by the initial location of the story
    }
}

let haveKey = false;
let sosLock = false;
let keyLock = false;

class Location extends Scene {

    create(key) {
        let locationData = this.engine.storyData.Locations[key]; // TODO: use `key` to get the data object for the current story location DONE?
        this.engine.show(locationData.Body); // TODO: replace this text by the Body of the location data DONE?

        if(locationData.Choices && locationData.Choices.length > 0) { //  Check if location has choices
            for(let choice of locationData.Choices) { // Unlock all choices
                choice.isLocked = false;
                if(choice.PreLock == true){ //If the location should be prelocked
                    if(haveKey == false){   //And if you do not have the key
                        choice.isLocked = true; //Lock choice from appearing
                        console.log(choice.Text)
                        console.log("Is Locked")
                    }
                    else{   //If you do have the key
                        choice.isLocked = false;    //Unlock choice
                    }
                }
                if(choice.Target == "SOS"){ //If the target is location specific SOS
                    if(sosLock == true){ //If you have visited location-sepecifc event already
                        choice.isLocked = true; //Lock that locations
                    }
                }
                if(choice.Target == "Key"){ //If the target is Key Location
                    if(keyLock == true){ //If you have visited location-sepecifc event already
                        choice.isLocked = true; //Lock that locations
                    }
                }
            }
        }

        if(locationData.GetKey == true){ //If the location tell you to get a key,
            haveKey = true;    //Unlock the hidden location
        }

        //Flag if one time choices are visited
        if(locationData.VisitedSOS == true){
            sosLock = true;
        }
        if(locationData.VisitedKey == true){
            keyLock = true;
        }

        if(locationData.Choices && locationData.Choices.length > 0) { // TODO: check if the location has any Choices DONE?
            for(let choice of locationData.Choices) { // TODO: loop over the location's Choices DONE?
                if(choice.isLocked == false){
                    this.engine.addChoice(choice.Text, choice); // TODO: use the Text of the choice DONE?
                }
                // TODO: add a useful second argument to addChoice so that the current code of handleChoice below works
            }
        } else {
            this.engine.addChoice("The end.")
        }
    }

    handleChoice(choice) {
        if(choice) {
            this.engine.show("&gt; "+choice.Text);
            this.engine.gotoScene(Location, choice.Target);
        } else {
            this.engine.gotoScene(End);
        }
    }

}


class End extends Scene {
    create() {
        this.engine.show("<hr>");
        this.engine.show(this.engine.storyData.Credits);
    }
}

Engine.load(Start, 'myStory.json');