"use strict";

/* 
 * Basics for a non-linear video player.
 * 
 * Jonathan Kaye, May, 2014
 */
 
var curLocationIndex = null;	// what is the current virtual location
var curStateIndex = 0;			// the current state (condition), 0 to susVars.states-1
var curBeginPlay, curEndPlay, beginPlaySeekable, preloading; // values for current segment being playted
var timingInterval;				// interval id for checking if player reached end of segment and need to loop back
var timesToForceWait;			// # of update interval checks to force a segment change go through "loading location" segment.

var susFunctions = {
	
	// Initialize the overlay placement and hide them all.
    init : function () {
        var i, arrowConfig = susVars.arrowInfo, numArrows = arrowConfig.length, curArrowLabel, curArrow;

         susVars.videoPtr = document.getElementsByTagName("video")[0];
	 
		 // place nav arrow overlays in their proper position and size
		 for (curArrowLabel in arrowConfig) {
			curArrow = arrowConfig[curArrowLabel];
			$(curArrow.id).css("top", curArrow.pos[0] + "px");
			$(curArrow.id).css("left", curArrow.pos[1] + "px");
		
			if (curArrow.size !== undefined) {
				$(curArrow.id).css("min-height", (curArrow.size.length > 1 ? curArrow.size[1] : curArrow.size[0]) + "px");
				$(curArrow.id).css("min-width", curArrow.size[0] + "px");
			}	
	
			// hide all nav arrows to begin
			$(curArrow.id).css("visibility", "hidden");
		}
		
    },

	// Called to change from the current location in the given direction (whichDir == L | R | ...)
    chgLoc : function (whichDir)  {
		var curNavInfo = susVars.locInfo[curLocationIndex].navHash;
		var targetLoc;
		var targLocIndex;
		
		// console.log("clicked on " + whichDir);
		if (curNavInfo.length > curStateIndex) {
			curNavInfo = curNavInfo[curStateIndex];
		} else {
			curNavInfo = curNavInfo[curNavInfo.length-1];
		}
		
		targetLoc = curNavInfo[whichDir];
		// console.log(whichDir + "->" + targetLoc);
		
		targLocIndex = susVars.locations.indexOf(targetLoc);
		if (targLocIndex != -1) {
			susFunctions.setupNewLocation(targLocIndex, curStateIndex);
		}
    },
	
	// Called to change the condition from current state to desired state (whichState)
	chgState : function (whichState)  {
		var targState = parseInt(whichState);
		
		if (targState != curStateIndex) {
			susFunctions.setupNewLocation(curLocationIndex, targState);
		}
    },
	
	// dummy function for when advertiser logo overlay (bottom right) is clicked
	gotoAd : function () {
		alert("This would go to advertiser web site or ad page.");
	},
	
	// Main code for checking whether or not we need to loop the video currently, based on
	// the timing for the current segment
	videoLoopCheck : function () {
		var v = susVars.videoPtr;
		
		// console.log("videoLoopCheck " + timesToForceWait);
		beginPlaySeekable = v.seekable.end(0) >= curEndPlay;
	
		if (beginPlaySeekable && timesToForceWait == 0 && (v.currentTime < curBeginPlay || v.currentTime > curEndPlay)) {
			v.currentTime = curBeginPlay;
			preloading = false;
			
		} else if (!beginPlaySeekable || timesToForceWait > 0) {
			if (beginPlaySeekable && timesToForceWait == 0) {		
			} else {
				timesToForceWait--;
				v.currentTime = (preloading ? susVars.firstPreload[0] : susVars.locLoad[0]);
				return;
			}
		}
			
		if (v.currentTime >= curEndPlay) {
			v.currentTime = curBeginPlay;
		}
	 },
	 
	 // Once all has been loaded, we try to jump to the starting location (and state)
	 startVideoPlaying : function () {
		susFunctions.setupNewLocation(0, 0);
     },
	 
	 // Set the video playhead to the desired location and state
	 setupNewLocation : function (locIndex, stateIndex) {
		var v = susVars.videoPtr;
		
		curLocationIndex = locIndex;
		curStateIndex 	 = stateIndex;
		
		susFunctions.setupNavigation(curLocationIndex, curStateIndex);
		
		curBeginPlay = susVars.locInfo[curLocationIndex].timing[curStateIndex][0];
		curEndPlay = susVars.locInfo[curLocationIndex].timing[curStateIndex][1];
		
		beginPlaySeekable = v.seekable.end(0) > curEndPlay;

		// Set to non-zero (# of updates) if we want to force the display into the "loading location" segment
		timesToForceWait = 0;
		 
		clearInterval(timingInterval);
		timingInterval = setInterval(susFunctions.videoLoopCheck, 500);
		
		v.play();
	 },
	 
	 // Based on the location and state, set up the overlays so the user can navigate
	 setupNavigation : function (locIndex, stateIndex) {
		var curNavInfo = susVars.locInfo[locIndex].navHash;
		var curArrow;
		
		// Check if there is a different setup for the current state, or just use last one
		if (curNavInfo.length > stateIndex) {
			curNavInfo = curNavInfo[stateIndex];
		} else {
			curNavInfo = curNavInfo[curNavInfo.length-1];
		}
		
		for (var arrow in susVars.arrowInfo) {
			curArrow = susVars.arrowInfo[arrow];
			$(curArrow.id).css("visibility", (curNavInfo[arrow] || curArrow.vis) ? "visible" : "hidden");	
		}
	 }
};

// This function is called when metadata is loaded and we're ready to setup the looping video checks
function readyToPlay(evt) {
	var v = susVars.videoPtr;
	v.removeEventListener("loadedmetadata", readyToPlay, true);
	
	if (isSeekable(susVars.firstPreload)) {
		clearInterval(timingInterval);
		timingInterval = setInterval(susFunctions.videoLoopCheck, 500);
	
		// start video playing, if not mobile version
		setTimeout(susFunctions.startVideoPlaying, 500);

		susVars.videoPtr.controls = false;
		preloading = true;
		
	} else {
		setTimeout(readyToPlay, 500);
	}
}

function initStructures () {
	  var v;
	  susFunctions.init();
	  v = susVars.videoPtr;
}

function isSeekable(timeSought) {
	var v = susVars.videoPtr;

    for (var i=0; i<v.seekable.length; i++) {
		if (timeSought > v.seekable.start(i) && timeSought < v.seekable.end(i)){
			return true;
		}
    }
    return false;
}

$(function () {
     initStructures();
	 
	  $("video").on("loadedmetadata", function(e){
		 readyToPlay(null);
		});
	 
	 
});