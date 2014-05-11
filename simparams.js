"use strict";

/* 
 * Parameters for the navigation and playing of the current movie.
 *
 * Here is a brief explanation of the parameters:
 *   poster - the beginning and ending of the "poster" image for the video, looping
 *            the poster image until the loading screen (first Preload) is ready.
 *   firstPreload - the # of seconds at which the movie preloader shows up. When
 *            that amount of the video has elapsed, the player can show that segment
 *            (given by seconds into the movie)
 *   locLoad - A generic segment of the video that is used if the user tries to navigate
 *             to a section that has not been loaded yet -- the locLoad is looped until
 *             the desired section has been loaded
 *   states - # of conditions in my movie, I had an "early" and "late" condition. This
 *            determines the timing for each location, as you'll see in the locInfo variable
 *   arrowInfo - Telling the player the position and optional size of each arrow overlay in the
 *            navigation cluster, also the id of the overlay
 *   locations - A set of the virtual locations in the movie. It is used in the video player
 *            to determine the index of the location in locInfo, when one is jumping to a segment
 *   locInfo - timing and navigation info for each location/segment. The timing tells
 *            the video player what time (in seconds) to loop, given the current 'state' --
 *            the current condition, from 0 to (states-1). The 'navHash' value tells the
 *            video player which arrows/overlays are active, i.e., where can the user navigate
 *            to when playing that segment.
 * 
 * Jonathan Kaye, May, 2014
 */
 
var susVars = {
    poster : [0, 0.5],
    firstPreload : [2],
    locLoad : [3.5],

    states : 2,

    arrowInfo : {L : {pos: [305, 25], id : "#l_button" },
                 R : {pos: [305, 91], id : "#r_button" },
                 F : {pos: [270, 58], id : "#f_button" },
                 B : {pos: [340, 58], id : "#b_button" },
                 U : {pos: [300, 58], size: [20], id : "#u_button" },
                 D : {pos: [320, 58], size: [20], id : "#d_button" },
                 FL : {pos: [273, 25], id : "#fl_button" },
                 FR : {pos: [273, 91], id : "#fr_button" },
                 BL : {pos: [337, 25], id : "#bl_button" },
                 BR : {pos: [337, 91], id : "#br_button" },
				 EA : {pos: [440, 20], size: [45, 20], vis: true, id : "#early_button" },
				 LA : {pos: [440, 80], size: [45, 20], vis: true, id : "#late_button" }
				 },

	locations : [ "A", "B", "C", "D", "INT", "INT_REAR" ],
	
    locInfo : [ { id: "A",
                  timing : [ [5, 11], [42, 48] ],
                  navHash : [ {L : "B", R : "D", F : "INT" } ]
                },
                { id: "B",
                  timing : [ [12, 17], [49, 53] ],
                  navHash : [ {L : "C", R : "A" } ]
                },
                { id: "C",
                  timing : [ [18, 19], [55, 59] ],
                  navHash : [ {L : "D", R : "B", F : "INT_REAR" } ]
                },
                { id: "D",
                  timing : [ [21, 26], [62, 65] ],
                  navHash : [ {L : "A", R : "C" } ]
                },
                { id: "INT",
                  timing : [ [27, 33], [67, 72] ],
                  navHash : [ {F : "C", B : "A" } ]
                },
                { id: "INT_REAR",
                  timing : [ [34, 40], [73, 79] ],
                  navHash : [ {F : "A", B : "C"} ]
                }
        ]
};