/**
 * Common
 */

var localStorage = window.localStorage;
var landingPage = "home";
var menuPage = "menu";
var projectPage = "project";
var dancePage = "dance";
var aboutPage = "about";
var miscPage = "misc";

var pageIds = [landingPage, menuPage, projectPage, "misc", "about", "dance"];

var pageHandlers = {};
var basicHandler = {
    onKeyPress: function () { },
    onUpScroll: function () { },
    onDownScroll: function () { },
    onPageResize: function () { }
};

pageIds.forEach(function (p) {
    pageHandlers[p] = basicHandler;
});

var customLogicPostLoad = [];
var customLogicPreLoad = [];

var findObjectByAttribute = function (items, attribute, value) {
    for (var i = 0; i < items.length; i++) {
        if (items[i][attribute] === value) {
            return items[i];
        }
    }
    return null;
}

/**
 * Register global post page load function
 * @param {function} fn 
 */
var registerGlobalFunctionPostPageLoad = function (fn) {
    if (typeof fn !== "function") {
        console.error("Cannot register non-function");
        return;
    }
    customLogicPostLoad.push(fn);
}

/**
 * Register global pre page load function
 * @param {function} fn 
 */
var registerGlobalFunctionPrePageLoad = function (fn) {
    if (typeof fn !== "function") {
        console.error("Cannot register non-function");
        return;
    }
    customLogicPreLoad.push(fn);
}

window.onpopstate = function (e) {
    console.log(window.history);
    console.log(e);
};

/**
 * Removes loader
 */
var removeLoader = function () {
    $("#loaderPage").fadeOut(400, function (e) {
        $("#loaderPage").remove();
    });
};

/**
 * Get current loaded page
 */
var getCurrentPage = function () {
    var url = window.location.href;
    var currentPage = url.indexOf('#!/') == -1 ? null : (url.substr(url.indexOf('#!/') + 3, url.length - url.indexOf('#')));
    if (!currentPage) {
        return landingPage;
    }
    return currentPage;
}

var previousPage = getCurrentPage();

/**
 * On url change. Usually called when back button is pressed.
 */
window.onhashchange = function () {
    console.log("Hash change", getCurrentPage());
    if (getCurrentPage() == null || getCurrentPage() == '') {
        routeToFade(landingPage)
    }
    else {
        routeToFade(getCurrentPage());
    }
    removeLoader();
}
var apiUrl = "https://the-void-view-backend.herokuapp.com/data";
var onLoad = function () {
    if (getCurrentPage() == null) {
        directLoad(landingPage)
    }
    else {
        directLoad(getCurrentPage());
    }

    $.get(apiUrl)
        .then(function (data) {
            webData = data;
            runOnPageLoadFunctions();
            removeLoader();
            runOnPagePostLoadFunctions();
            console.log("API call:", webData);
        })
        .fail(function (err) {
            alert("Error: Could not load data.");
            console.error(err);
        });


    pageIds.forEach(function (page) {

    });
}

var onProjectPageLoad = function () {
    console.log('Loaded page 3');
}



var pageRefreshPipeline = [];
var pagePostLoaders = [];

/**
 * Register function callback on page load
 * @param {string} page Unique name of the page.
 * @param {function} fn Callback function to be called on page load.
 */
var registerOnPageLoad = function (page, fn) {
    pageRefreshPipeline[page] = fn;
}

/**
 * Register function callback on page post load
 * @param {string} page 
 * @param {function} fn 
 */
var registerPagePostLoad = function (page, fn) {
    pagePostLoaders[page] = fn;
}

/**
 * Runs all page load functions
 */
var runOnPageLoadFunctions = function () {
    customLogicPreLoad.forEach(function (fn) {
        fn();
    });
    $("#footer").fadeIn('slow');
    if (pageRefreshPipeline[getCurrentPage()]) {
        pageRefreshPipeline[getCurrentPage()]();
    }
    customLogicPostLoad.forEach(function (fn) {
        fn();
    });
}

/**
 * Runs all page post load functions
 */
var runOnPagePostLoadFunctions = function () {
    if (pagePostLoaders[getCurrentPage()]) {
        pagePostLoaders[getCurrentPage()]();
    }
};

registerGlobalFunctionPostPageLoad(function () {

    switch (getCurrentPage()) {
        case "menu":
        case "home":
            $("#main-menu").hide();
            $("#scroll-message").fadeOut(400);
            break;
        default:
            $("#main-menu").fadeIn('slow');
    }
});

/**
 * Highlight top menu
 */
registerGlobalFunctionPrePageLoad(function () {
    pageIds.forEach(function (page) {
        var menuId = "#" + page + "-link";
        if (page == getCurrentPage()) {
            $(menuId).addClass("highlight");
        }
        else {
            $(menuId).removeClass("highlight");
        }
    });

});

registerOnPageLoad(landingPage, function () {
    $("#footer").hide();
    $("#main-menu").hide();

    setTimeout(typeFallSeven, 2000);
    if (typingCallbackCalled) {
        $("#voidwaybtn").animate({ width: "150px" }, 'fast', function () {
            $("#btnContent").html('<span class="fadein">the void way -><span>');
        });
    }
});

registerOnPageLoad(projectPage, onProjectPageLoad);
registerOnPageLoad(menuPage, onMenuPageLoad);

var hasLoadedOnce = false;

var webData = null;

window.onload = function () {
    console.log("onload(): Current Page", getCurrentPage(), "HasLoadedOnce:", hasLoadedOnce);
    onLoad();
    if (!hasLoadedOnce) {
        hasLoadedOnce = true;
    }
    else {

    }
}

var directLoad = function (page) {
    pageIds.forEach(function (v, i, arr) {
        $("#" + v).css("left", "100%");
    });
    $("#" + page).css("left", "0px");
}

window.onresize = function () {
    if (pageHandlers[getCurrentPage()] && pageHandlers[getCurrentPage()].onPageResize) {
        pageHandlers[getCurrentPage()].onPageResize();
    }
}

var pushStateHistory = function (toPage) {
    previousPage = getCurrentPage();
    if (previousPage == toPage) return;
    window.history.pushState('Object', toPage, '#!/' + toPage);
}

var resetPages = function () {
    pageIds.forEach(function (v, i, arr) {
        $("#" + v).css("left", "-100%");
        $("#" + v).css("top", "0");
        $("#" + v).fadeIn(100);
    });
}

var resetPagesForSlideUp = function () {
    pageIds.forEach(function (v, i, arr) {
        $("#" + v).css("top", "100%");
        $("#" + v).css("left", "0");
        $("#" + v).fadeIn(100);
    });
}

var routeTo = function (toPage, fromPage, cb) {
    if (!toPage) toPage = landingPage;
    animStack.push(true);
    if (!fromPage) {
        resetPages();
        $("#" + toPage).css("left", "-100%");
        $("#" + toPage).animate({ "left": "0px" }, 900);
    }
    else {
        resetPages();
        $("#" + toPage).css("left", "100%");
        $("#" + toPage).css("top", "0");
        $("#" + fromPage).animate({ left: "-100%" }, 900);
        $("#" + toPage).animate({ left: "0" }, 900);
    }
    pushStateHistory(toPage);
    runOnPageLoadFunctions();
    setTimeout(function () {
        animStack.pop();
        runOnPagePostLoadFunctions();
    }, 600);
}

/**
 * Routes to given page from current page with transition animation
 * @param {string} toPage 
 * @param {string} fromPage 
 * @param {function} cb Callback
 */
var routeToSlideUp = function (toPage, fromPage, cb) {
    if (!toPage) toPage = landingPage;
    animStack.push(true);
    if (!fromPage) {
        resetPagesForSlideUp();
        $("#" + toPage).css("top", "100%");
        $("#" + toPage).animate({ "top": "0px" }, 'slow');
    }
    else {
        $("#" + toPage).css("display", "unset");
        $("#" + toPage).css("top", "100%");
        $("#" + toPage).css("left", "0");
        $("#" + fromPage).animate({ top: "-100%" }, 'slow');
        $("#" + toPage).animate({ top: "0" }, 'slow');
    }
    pushStateHistory(toPage);
    runOnPageLoadFunctions();
    setTimeout(function () {
        animStack.pop();

        runOnPagePostLoadFunctions();
    }, 600);
}

/**
 * Routes to given page from current page with transition animation
 * @param {string} toPage 
 * @param {string} fromPage 
 * @param {function} cb Callback
 */
var routeToFade = function (toPage, fromPage, cb) {
    if (!toPage) toPage = landingPage;
    animStack.push(true);
    if (!fromPage) {
        pageIds.forEach(function (v, i, arr) {
            $("#" + v).css("top", "100%");
            $("#" + v).css("left", "0");
        });
        $("#" + toPage).css("display", "none");
        $("#" + toPage).css("top", "0px");
        $("#" + toPage).fadeIn(400);
    }
    else {
        $("#" + fromPage).fadeOut(400, function () {
            $("#" + fromPage).css({ top: "-100%" });
            $("#" + toPage).css("display", "none");
            $("#" + toPage).css("left", "0");
            $("#" + toPage).css("top", "0");
            $("#" + toPage).fadeIn(400);
        });
    };
    pushStateHistory(toPage);
    runOnPageLoadFunctions();
    setTimeout(function () {
        animStack.pop();
        runOnPagePostLoadFunctions();
    }, 600);
}


/**
 * I. First Page animations
 */

/**
 * a. Intro - Typewriter animation
 */
var captionLength = 0;
var caption = '';
var captionEl = $('#introHeader');
var currentPage = 0;

function type() {
    captionEl.html(caption.substr(0, captionLength++));
    if (captionLength < caption.length + 1 && !typingCallbackCalled) {
        if (caption[captionLength - 2] == '.') {
            setTimeout(type, 1500);
        }
        else setTimeout(type, 80);
    } else {
        caption = 'Fall Seven. Rise Eight';
        captionLength = caption.length;
        doneTypingCallback();
    }
}

function typeFallSeven() {
    caption = "Fall Seven. Rise Eight";
    type();
}

function cursorAnimation() {
    $('#cursor').animate({
        opacity: 0
    }, 'fast', 'swing').animate({
        opacity: 1
    }, 'fast', 'swing');
}

var typingCallbackCalled = false;

function doneTypingCallback() {
    console.log('Done Typing...');
    if (getCurrentPage() == landingPage && !typingCallbackCalled) {
        typingCallbackCalled = true;
        setTimeout(routeToFade.bind(routeToFade, menuPage, landingPage), 800);
    }
}

setTimeout(function () {
    $("#cursor").text('|');
    setInterval(cursorAnimation, 600)
}, 1000);


/**
 * b. The void way button - on hover animation
 */
$('.hover').bind('touchstart touchend', function (e) {
    e.preventDefault();
    $(this).toggleClass('hover_effect');
});

$("#voidwaybtn").width($("#btnContent").width());

$("#voidwaybtn").hover(function (e) {
    $("#voidwaybtn").animate({ width: "150px" }, 'fast', function () {
        $("#btnContent").html('<span class="fadein">the void way -><span>');
    });
},
    function (e) {
        $("#btnContent").html('<div id="circle" class="fadein"></div>').fadeIn('fast');
        $("#voidwaybtn").animate({ width: "42px" }, 'fast');
    });

$("#voidwaybtn").click(function () {
    routeToFade(menuPage, landingPage);
});



var transition = function (anim, toPage, fromPage) {
    var property;
    switch (anim) {
        case 'slide-left':
            property = 'left';
            break;
        case 'slide-up':
            property = 'top';
            break;
        default:
            property = 'left';
    }
    var animObj = {};
    animObj[property] = "-100%";
};

/**
 * Project Page 
 */



var projects = {};

var animStack = [];

var empty = function () { };

registerOnPageLoad(projectPage, function () {

    //$("#project-list").fullpage();
    projects = webData.projects;
    var menuItems = [];
    var idIndex = 1;
    $(".page-title").click(function(){
       $("#project-list").animate({scrollTop:0});
    });
    var addProjectToList = function (title, image, text, images, nextProject, id) {
        var template = ` <div class="project-container" id="project${id}">
            <div class="project-card">
            <div class="project-name">${title}</div>
            <div class="project-image" id="pi${id}"></div>
            <div class="project-text" id="pt${id}">${text}</div>
            <div class="read-more" id="pr${id}">...</div>
            </div>
            <div class="vertical-line"></div>
            <div class="horizontal-line"></div>
            <div class="next-project-name" id="nextp${id}">${nextProject}</div>
            </div>`;
        $("#project-list").append(template);
        $("#pi" + id).css("background-image", "url(" + image + ")"); //change background image

        $("#pr" + id).click(function () {
            $(`#pt${id}`).fadeToggle("fast");
            //$("#pr"+id).fadeOut("fast");
            // $(`#project${id}`).click(function(){
            //     $(`#pt${id}`).fadeToggle("fast");
            //     $("#pr"+id).fadeIn("fast");
            //     $(`#project${id}`).unbind('click');
            // });
        })

        $("#nextp" + id).click(function () {
            console.log("nextp"+id);
            $('#project-list').stop().animate({ scrollTop: $("#project"+id).height() * (id+1) }, 800);
        });
    };

    var loadProjects = function () {
        $("#project-list").empty();
        var projectList = [];
        for (var key in projects) {
            projectList.push(key);
        }
        var count = 0;
        for (var key in projects) {
            var project = projects[key];
            var next;
            if (count + 1 > projectList.length - 1) {
                next = projectList[count + 1];
            }
            else {
                next = '';
            }
            addProjectToList(key, project.image, project.description, project.images, projectList[count + 1]?projectList[count + 1]:"End", count);
            count++;
        }
    };

    loadProjects();

    pageHandlers[projectPage] = {
        onKeyPress: function (e) {
            switch (e.which) {
                case 38: //Up
                    if (animStack.length == 0)
                        //menuUp();
                        break;
                case 40: //Down
                    if (animStack.length == 0)
                        //menuDown();
                        break;
            }
        },
        onUpScroll: empty,
        onDownScroll: empty,
        onPageResize: function () {
            // window.location.reload(true);
        }
    }


    registerPagePostLoad(projectPage, function () {

    });
});



/**
 * Menu page
 */

var menuPageItems = ['menu-home', 'menu-projects', 'menu-about', 'menu-dance', 'menu-art'];

var xPositions = {};

//Set on click


//Set image background change on hover
menuPageItems.forEach(function (val, i) {
    var menu = $("#" + val);
    menu.hover(function (e) {
        if (animStack.length == 0 && $("#menu-image").css("background-image").indexOf(val) == -1) {
            animStack.push(true);
            $("#menu-image").fadeOut(100, function () {
                $("#menu-image").css("background-image", "url(../img/" + val + ".png)");
                $("#menu-image").fadeIn(400, function () {
                    animStack.pop();
                });
            });

        };
    });
});

var menuSlideShow = null;

var onMenuPageLoad = function () {
    $("#menu-image").css("background-image", "url(../img/" + menuPageItems[0] + ".png)");
    var startMenuSlideShow = function () {
        clearInterval(menuSlideShow);
        var counter = 1;
        menuSlideShow = setInterval(function () {
            animStack.push(true);
            var val = menuPageItems[counter];
            $("#menu-image").fadeOut(400, function () {
                $("#menu-image").css("background-image", "url(../img/" + val + ".png)");
                $("#menu-image").fadeIn(400, function () {
                    animStack.pop();
                });
            });
            counter = (counter + 1) % menuPageItems.length;
        }, 3000);
    };

    startMenuSlideShow();

    console.log("Menu Page");
    menuPageItems.forEach(function (item) {
        $("#" + item).click(function (e) {
            menuItemClicked = item;
            switch (menuItemClicked) {
                case 'menu-projects':
                    routeToSlideUp(projectPage, menuPage);
                    break;
                case 'menu-art':
                    routeToSlideUp('misc', menuPage);
                    break;
                case 'menu-about':
                    routeToSlideUp('about', menuPage);
                    break;
                case 'menu-dance':
                    routeToSlideUp('dance', menuPage);
                default:
                //do nothing
            }
        });

        $("#" + item).hover(function () {
            // animateLine = false;
            //path.removeSegments();
        });
    });
}

registerOnPageLoad(menuPage, onMenuPageLoad);

/**
 * Misc Page
 */

var galleryLoaded = {}; //Variable to store the loaded galleries(photos, art) so as to not load them again.
registerOnPageLoad(miscPage, function () {


    var transformToIdMap = function (data) {
        var returnObj = {};
        data.forEach(function (item) {
            returnObj[item.id] = item;
        });
        return returnObj;
    }
    var writingData = webData.misc.writings;

    var writings = {};

    //Transforming data for UI
    writingData.forEach(function (item) {
        writings[item.id] = item.writing;
    });

    var data = webData.misc.photos;
    var data1 = webData.misc.art;
    var data2 = writingData;


    $('body').unbind('mousewheel');
    $('body').bind('mousewheel', function (e) {
        return true;
    });


    pageHandlers[miscPage] = {
        onPageResize: function () {
            //window.location.reload(true);
        },
        onKeyPress: function (e) {
            switch (e.which) {
                case 38: //Up
                    if (animStack.length == 0)
                        //miscPageMenuUp();
                        break;
                case 40: //Down
                    if (animStack.length == 0)
                        //miscPageMenuDown();
                        break;
            }
        },
        onUpScroll: empty,
        onDownScroll: empty
    }

    registerPagePostLoad(miscPage, function () {

    });
});

$('#dance').mouseenter(function () { MOUSE_OVER = true; });
$('#dance').mouseleave(function () { MOUSE_OVER = false; });

var slideShowTimer = null;
registerOnPageLoad(dancePage, function () {


    var danceSections = webData.dance.performances;
    var danceDescriptions = webData.dance.danceDescriptions;
    var danceImages = webData.dance.images;
    var danceImagesArray = webData.dance.imageArray;


    //Defining page handlers for currentPage
    pageHandlers[dancePage] = {
        onPageResize: function () {
            window.location.reload(true);
        },
        onKeyPress: function (e) {
            switch (e.which) {
                case 38: //Up
                    if (animStack.length == 0)
                        //dancePageMenuUp();
                        break;
                case 40: //Down
                    if (animStack.length == 0)
                        // dancePageMenuDown();
                        break;
            }
        },
        onUpScroll: empty,
        onDownScroll: empty
    }


    registerPagePostLoad(dancePage, function () {

    });
});

var aboutBgSlideShowTimer = null;
registerOnPageLoad("about", function () {
    var aboutCanvas = document.getElementById('about-canvas');
    var aboutPaper = new paper.PaperScope();
    aboutPaper.setup(aboutCanvas);
    var topPath = new aboutPaper.Path();
    var path1 = new aboutPaper.Path();
    var path2 = new aboutPaper.Path();
    var path3 = new aboutPaper.Path();
    var path4 = new aboutPaper.Path();
    var xPosition = xPositions["menu-about"] ? xPositions["menu-about"] : window.innerWidth / 2;
    var startBackgroundSlideShow = function () {
        var images = ['../img/about/about1.png', '../img/about/about2.png', '../img/about/about3.png', '../img/about/about5.png'];
        var imageIndex = 1;
        clearInterval(aboutBgSlideShowTimer);
        aboutBgSlideShowTimer = setInterval(function () {
            var img = images[imageIndex];
            imageIndex = (imageIndex + 1) % images.length;
            $("#about-image").fadeOut(400, function () {
                $("#about-image").css("background-image", "url(" + img + ")");
                $("#about-image").fadeIn(400);
            });
        }, 4000);
    };
    startBackgroundSlideShow();
    console.log(xPosition, window.innerWidth);
    topPath.moveTo(xPosition, 0);
    topPath.lineTo(xPosition, window.innerHeight);
    topPath.strokeColor = 'grey'
    path1.strokeColor = 'grey';
    path2.strokeColor = path3.strokeColor = path4.strokeColor = 'grey';
    pageHandlers[aboutPage] = {
        onPageResize: function () {
            window.location.reload();
        }
    };
    var clearPaths = function () {
        path1.removeSegments();
        path2.removeSegments();
        path3.removeSegments();
        path4.removeSegments();
    }
    var drawGoldenRatio = function () {
        path1.moveTo(xPosition, window.innerHeight / 2);
        path1.lineTo(window.innerWidth, window.innerHeight / 2);
        path2.moveTo(xPosition + window.innerWidth / 4, window.innerHeight / 2);
        path2.lineTo(xPosition + window.innerWidth / 4, window.innerHeight);
        path3.moveTo(xPosition + window.innerWidth / 4, 3 * window.innerHeight / 4);
        path3.lineTo(xPosition, 3 * window.innerHeight / 4);
        path4.moveTo(xPosition + window.innerWidth / 8, 3 * window.innerHeight / 4);
        path4.lineTo(xPosition + window.innerWidth / 8, window.innerHeight / 2);
    }

    drawGoldenRatio();

    registerPagePostLoad(aboutPage, function () {
        xPosition = window.innerWidth / 2 - 20;
        topPath.removeSegments();
        topPath.moveTo(xPosition, 0);
        topPath.lineTo(xPosition, window.innerHeight);
        clearPaths();
        drawGoldenRatio();
    });
});
