/**
 * Common
 */
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

window.onpopstate = function (e) {
    console.log(window.history);
    console.log(e);
};

var removeLoader = function () {
    $("#loaderPage").fadeOut(400, function (e) {
        $("#loaderPage").remove();
    });
};


window.onhashchange = function () {
    console.log("Hash change", getCurrentPage());
    if (getCurrentPage() == null || getCurrentPage() == '') {
        routeTo(landingPage)
    }
    else {
        routeTo(getCurrentPage());
    }
    removeLoader();
}

var onLoad = function () {
    if (getCurrentPage() == null) {
        directLoad(landingPage)
    }
    else {
        directLoad(getCurrentPage());
    }
    if (pageRefreshPipeline[getCurrentPage()]) {
        pageRefreshPipeline[getCurrentPage()]();
    }
    removeLoader();
    if (pagePostLoaders[getCurrentPage()]) {
        pagePostLoaders[getCurrentPage()]();
    }
    pageIds.forEach(function (page) {

    });
}

var onProjectPageLoad = function () {
    console.log('Loaded page 3');
}

var onMenuPageLoad = function () {
    console.log('Loaded menu page');
}

var pageRefreshPipeline = [];
var pagePostLoaders = [];

var registerOnPageLoad = function (page, fn) {
    pageRefreshPipeline[page] = fn;
}

var registerPagePostLoad = function (page, fn) {
    pagePostLoaders[page] = fn;
}

var runOnPageLoadFunctions = function () {
    $("#footer").fadeIn('slow');
    if (pageRefreshPipeline[getCurrentPage()]) {
        pageRefreshPipeline[getCurrentPage()]();
    }
}

var runOnPagePostLoadFunctions = function () {
    if (pagePostLoaders[getCurrentPage()]) {
        pagePostLoaders[getCurrentPage()]();
    }
}

registerOnPageLoad(landingPage, function () {
    $("#footer").hide();
    setTimeout(typeFallSeven, 2000);
});
registerOnPageLoad(projectPage, onProjectPageLoad);
registerOnPageLoad(menuPage, onMenuPageLoad);

var hasLoadedOnce = false;

window.onload = function () {
    console.log("onload(): Current Page", getCurrentPage());
    onLoad();
    if (!hasLoadedOnce) {
        hasLoadedOnce = true;
    }
    else {

    }
}

window.onresize = function () {
    if (pageHandlers[getCurrentPage()] && pageHandlers[getCurrentPage()].onPageResize) {
        pageHandlers[getCurrentPage()].onPageResize();
    }
}

var routeTo = function (toPage, fromPage, cb) {
    if (!toPage) toPage = landingPage;
    animStack.push(true);
    if (!fromPage) {
        pageIds.forEach(function (v, i, arr) {
            $("#" + v).css("left", "-100%");
            $("#" + v).css("top", "0");
        });
        $("#" + toPage).css("left", "-100%");
        $("#" + toPage).animate({ "left": "0px" }, 900);
    }
    else {
        $("#" + toPage).css("left", "100%");
        $("#" + toPage).css("top", "0");
        $("#" + fromPage).animate({ left: "-100%" }, 900);
        $("#" + toPage).animate({ left: "0" }, 900);
    }
    window.history.pushState('Object', toPage, '#!/' + toPage);
    runOnPageLoadFunctions();
    setTimeout(function () {
        animStack.pop();
        if (pagePostLoaders[getCurrentPage()]) {
            pagePostLoaders[getCurrentPage()]();
        }
    }, 600);
}

var routeToSlideUp = function (toPage, fromPage, cb) {
    if (!toPage) toPage = landingPage;
    animStack.push(true);
    if (!fromPage) {
        pageIds.forEach(function (v, i, arr) {
            $("#" + v).css("top", "100%");
            $("#" + v).css("left", "0");
        });
        $("#" + toPage).css("top", "100%");
        $("#" + toPage).animate({ "top": "0px" }, 'slow');
    }
    else {
        $("#" + toPage).css("top", "100%");
        $("#" + toPage).css("left", "0");
        $("#" + fromPage).animate({ top: "-100%" }, 'slow');
        $("#" + toPage).animate({ top: "0" }, 'slow');
    }
    window.history.pushState('Object', toPage, '#!/' + toPage);
    runOnPageLoadFunctions();
    setTimeout(function () {
        animStack.pop();
        if (pageRefreshPipeline[getCurrentPage()]) {
            pageRefreshPipeline[getCurrentPage()]();
        }
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
    if (captionLength < caption.length + 1) {
        if (caption[captionLength - 2] == '.') {
            setTimeout(type, 1500);
        }
        else setTimeout(type, 80);
    } else {
        captionLength = 0;
        caption = '';
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
        setTimeout(routeTo.bind(routeTo, menuPage, landingPage), 800);
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
    routeTo(menuPage, landingPage);
});

var getCurrentPage = function () {
    var url = window.location.href;
    var currentPage = url.indexOf('#!/') == -1 ? null : (url.substr(url.indexOf('#!/') + 3, url.length - url.indexOf('#')));
    if (!currentPage) {
        return landingPage;
    }
    return currentPage;
}

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



var directLoad = function (page) {
    pageIds.forEach(function (v, i, arr) {
        $("#" + v).css("left", "100%");
    });
    $("#" + page).css("left", "0px");
}


/**
 * Third Page 
 */


var MOUSE_OVER = false;
$('body').bind('mousewheel', function (e) {
    if (MOUSE_OVER) {
        if (e.preventDefault) { e.preventDefault(); }
        e.returnValue = false;
        return false;
    }
});

$('#' + projectPage).mouseenter(function () { MOUSE_OVER = true; });
$('#' + projectPage).mouseleave(function () { MOUSE_OVER = false; });

$('#' + projectPage).bind('mousewheel', function (e) {
    var delta;
    if (e.wheelDelta)
        delta = e.wheelDelta;
    else delta = e.originalEvent.wheelDelta;
    if (delta > 0) {
        //go up
        console.log("Up");
        if (animStack.length == 0 && pageHandlers[getCurrentPage()] && pageHandlers[getCurrentPage()].onUpScroll)
            pageHandlers[getCurrentPage()].onUpScroll();
    }
    else {
        //go down
        console.log("Down", animStack);
        if (animStack.length == 0 && pageHandlers[getCurrentPage()] && pageHandlers[getCurrentPage()].onDownScroll)
            pageHandlers[getCurrentPage()].onDownScroll();
    }
});





var projects = {
    Drone: {
        image: "../img/drone1.png",
        description: "Drone project description here."
    },
    Emoi: {
        image: "../img/b.jpg",
        description: "Emotion based feedback"
    },
    "Testimonial Map": {
        image: "../img/a.jpg",
        description: "Service Center testimonial feedback"
    },
    Other: {
        image: "../img/c.jpg",
        description: "Other"
    },
};

var animStack = [];

$(document).keyup(function (e) {
    if (pageHandlers[getCurrentPage()] && pageHandlers[getCurrentPage()].onKeyPress)
        pageHandlers[getCurrentPage()].onKeyPress(e);
});




registerOnPageLoad(projectPage, function () {
    var menuItems = [
        {
            id: 1,
            top: 25,
            text: "Drone",
            middle: false,
            element: null
        },
        {
            id: 2,
            top: 50,
            text: "Emoi",
            middle: true,
            element: null
        },
        {
            id: 3,
            top: 75,
            text: "Testimonial Map",
            middle: false,
            element: null
        },
        {
            id: 4,
            top: 100,
            text: "Other",
            middle: false,
            element: null
        }
    ];
    var canvas = document.getElementById('project-canvas');
    var projectPaper = new paper.PaperScope();
    projectPaper.setup(canvas);
    var path = new projectPaper.Path();
    path.strokeColor = 'white';
    var xPosition = xPositions["menu-projects"] ? xPositions["menu-projects"] : window.innerWidth * (0.334);
    var topPath = new projectPaper.Path();
    var bottomPath = new projectPaper.Path();
    topPath.strokeColor = 'grey';
    bottomPath.strokeColor = 'grey';
    var currentHeading = 0;
    var negativeCounter = 0;
    var nextHeading = 1;
    var ids = ["#misc-menu-heading", "#misc-side-title"];
    projectPaper.view.onFrame = function (event) {
    }
    var loadProject = function (projectName) {
        var project = projects[projectName];
        animStack.push(true);
        $("#project-image").fadeOut(100, function (e) {
            $("#project-image").css("background-image", "url(" + project.image + ")");
            $("#project-image").fadeIn(200, function (e) {
                animStack.pop();
            });
        });

        $("#project-title").fadeOut(100, function () {
            $("#project-title").text(projectName);
            $("#project-title").fadeIn(200, function (e) {
            });
        });
        $("#project-details").fadeOut(100, function () {
            $("#project-details").text(project.description);
            $("#project-details").fadeIn(200, function (e) {
            });
        });

        $("#next-project").fadeOut(100, function () {
            $("#next-project").text(menuItems[nextHeading].text);
            $("#next-project").fadeIn(200, function (e) {
            });
        });
    };

    var loadProjectMenu = function () {
        console.log("Project Menu loading");
        $("#next-project").css("left", xPosition - $("#next-project").width() / 2);
        loadProject(menuItems[currentHeading].text);
    }

    loadProjectMenu();
    console.log($("#next-project").offset().top);
    topPath.moveTo(xPosition, 0);
    topPath.lineTo(xPosition, $("#next-project").offset().top - 10);
    bottomPath.moveTo(xPosition, $("#next-project").offset().top + $("#next-project").height() + 10);
    bottomPath.lineTo(xPosition, window.innerHeight);

    var menuDown = function () {
        negativeCounter = negativeCounter - 1;
        if (Math.abs(negativeCounter) == menuItems.length) {
            negativeCounter = 0;
        }
        currentHeading = Math.abs(negativeCounter);
        nextHeading = (currentHeading + 1) % menuItems.length;
        loadProjectMenu();
    }

    var menuUp = function () {
        nextHeading = currentHeading;
        currentHeading = (currentHeading + 1) % menuItems.length;
        negativeCounter = currentHeading;
        loadProjectMenu();
    }

    pageHandlers[projectPage] = {
        onKeyPress: function (e) {
            switch (e.which) {
                case 38: //Up
                    if (animStack.length == 0)
                        menuUp();
                    break;
                case 40: //Down
                    if (animStack.length == 0)
                        menuDown();
                    break;
            }
        },
        onUpScroll: menuUp,
        onDownScroll: menuDown,
        onPageResize: function () {
            window.location.reload(true);
        }
    }
});

/**
 * Menu page
 */

var menuCanvas = document.getElementById('menu-canvas');
var menuPaper = new paper.PaperScope();
menuPaper.setup(menuCanvas);
var path = new menuPaper.Path();
path.strokeColor = 'white';
var animateLine = false;
var menuItemClicked = null;
menuPaper.view.onFrame = function (e) {
    if (animateLine) {
        path.segments[1].point = path.segments[1].point.add(new Point(0, 10));
        if (path.segments[1].point.y > window.innerHeight) {
            animateLine = false;
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
        }
    }
}

var menuPageItems = ['menu-home', 'menu-projects', 'menu-about', 'menu-dance', 'menu-art', 'menu-contact'];

$("#menu-projects").click(function () {
    //route(projectPage, menuPage);
});

var xPositions = {};

//Set on click
menuPageItems.forEach(function (item) {
    $("#" + item).click(function (e) {
        var element = $("#" + item);
        xPositions[item] = element.offset().left + element.width() / 2;
        console.log(xPositions);
        if (!animateLine) {
            path.add(new Point(element.offset().left + element.width() / 2, element.offset().top + element.height()));
            path.add(new Point($("#" + item).offset().left + element.width() / 2, $("#menu-home").offset().top + element.height()));
        }
        animateLine = true;
        menuItemClicked = item;
    });

    $("#" + item).hover(function () {
        animateLine = false;
        path.removeSegments();
    });
});

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

/**
 * Misc Page
 */
var preventMainMouseBind = false;

$('#misc').bind('mousewheel', function (e) {
    var delta;
    if (e.wheelDelta)
        delta = e.wheelDelta;
    else delta = e.originalEvent.wheelDelta;
    if (delta > 0) {
        //go up
        console.log("Up", animStack);
        if (animStack.length == 0 && pageHandlers[getCurrentPage()] && pageHandlers[getCurrentPage()].onUpScroll && !preventMainMouseBind)
            pageHandlers[getCurrentPage()].onUpScroll();
    }
    else {
        //go down
        console.log("Down");
        if (animStack.length == 0 && pageHandlers[getCurrentPage()] && pageHandlers[getCurrentPage()].onDownScroll && !preventMainMouseBind)
            pageHandlers[getCurrentPage()].onDownScroll();
    }
});

$('#misc-photos').bind('mousewheel', function (e) {
    var delta;
    if (e.wheelDelta)
        delta = e.wheelDelta;
    else delta = e.originalEvent.wheelDelta;
    animStack.push(true);
    if (delta > 0) {
        //go up
        console.log("Up", animStack);
        if (animStack.length == 0 && pageHandlers[getCurrentPage()] && pageHandlers[getCurrentPage()].onUpScroll)
            pageHandlers[getCurrentPage()].onUpScroll();
    }
    else {
        //go down
        console.log("Down 2");
        if (animStack.length == 0 && pageHandlers[getCurrentPage()] && pageHandlers[getCurrentPage()].onDownScroll)
            pageHandlers[getCurrentPage()].onDownScroll();
    }
    animStack.pop();
});

$('#misc-photos').mouseenter(function () { preventMainMouseBind = true; });
$('#misc-photos').mouseleave(function () { preventMainMouseBind = false; });

$('#misc').mouseenter(function () { MOUSE_OVER = true; });
$('#misc').mouseleave(function () { MOUSE_OVER = false; });


registerOnPageLoad("misc", function () {
    var miscCanvas = document.getElementById('misc-canvas');
    var miscPaper = new paper.PaperScope();
    miscPaper.setup(miscCanvas);
    var topPath = new miscPaper.Path();
    var bottomPath = new miscPaper.Path();
    var xPosition = xPositions["menu-art"] ? xPositions["menu-art"] : window.innerWidth * (0.671);
    $("#misc-side-image").css({ left: (window.innerWidth - $("#misc-side-image").width()) });
    $("#misc-side-title").css({  width: window.innerWidth - xPosition, height: window.innerHeight/2 });

    topPath.strokeColor = 'grey';
    bottomPath.strokeColor = 'grey';
    miscPaper.view.onFrame = function () {
    };

    var headings = ["Photography", "Art", "Writing"];
    var headingIdMap = {
        Photography: "#misc-photos",
        Art: "#misc-art",
        Writing: "#misc-writing"
    };
    var currentHeading = 0;
    var negativeCounter = 0;
    var nextHeading = 1;
    var sections = ["#misc-photos", "#misc-art", "#misc-writing"];
    var setMenuHeading = function () {
        var ids = ["#misc-menu-heading", "#misc-side-title"];
        ids.forEach(function (id) {
            animStack.push(true);
            $(id).fadeOut(200, function () {
                $("#misc-menu-heading").text(headings[nextHeading]);
                $("#misc-menu-heading").css("left", xPosition - $("#misc-menu-heading").width() / 2);
                $("#misc-side-title").text(headings[currentHeading]);
                $(id).fadeIn(400, function () {
                    animStack.pop();
                });
            })
        });
        var currentSection = headingIdMap[headings[currentHeading]];
        sections.forEach(function (section) {
            if (currentSection == section) return;
            $(section).fadeOut(200);
        });
        $(currentSection).fadeIn(400);
    }
    setMenuHeading();

    topPath.moveTo(xPosition, 0);
    topPath.lineTo(xPosition, $("#misc-menu-heading").offset().top - 10);
    bottomPath.moveTo(xPosition, $("#misc-menu-heading").offset().top + $("#misc-menu-heading").height() + 10);
    bottomPath.lineTo(xPosition, window.innerHeight);

    var miscPageMenuUp = function () {
        nextHeading = currentHeading;
        currentHeading = (currentHeading + 1) % headings.length;
        negativeCounter = currentHeading;
        setMenuHeading();
    }

    var miscPageMenuDown = function () {
        negativeCounter = negativeCounter - 1;
        if (Math.abs(negativeCounter) == headings.length) {
            negativeCounter = 0;
        }
        currentHeading = Math.abs(negativeCounter);
        nextHeading = (currentHeading + 1) % headings.length;
        setMenuHeading();
    }
    pageHandlers["misc"] = {
        onPageResize: function () {
            window.location.reload(true);
        },
        onKeyPress: function (e) {
            switch (e.which) {
                case 38: //Up
                    if (animStack.length == 0)
                        miscPageMenuUp();
                    break;
                case 40: //Down
                    if (animStack.length == 0)
                        miscPageMenuDown();
                    break;
            }
        },
        onUpScroll: miscPageMenuUp,
        onDownScroll: miscPageMenuDown
    }

    $('#grid').masonry({
        itemSelector: '.grid-item'
    });

});

registerPagePostLoad("misc", function () {

});

registerOnPageLoad("dance", function () {
    var danceCanvas = document.getElementById('dance-canvas');
    var dancePaper = new paper.PaperScope();
    dancePaper.setup(danceCanvas);
    var topPath = new dancePaper.Path();
    var bottomPath = new dancePaper.Path();
    var xPosition = xPositions["menu-dance"] ? xPositions["menu-dance"] : window.innerWidth * (0.671);
    topPath.moveTo(xPosition, 0);
    topPath.lineTo(xPosition, window.innerHeight);
    topPath.strokeColor = 'grey';
});

registerOnPageLoad("about", function () {
    var aboutCanvas = document.getElementById('about-canvas');
    var aboutPaper = new paper.PaperScope();
    aboutPaper.setup(aboutCanvas);
    var topPath = new aboutPaper.Path();
    var bottomPath = new aboutPaper.Path();
    var xPosition = xPositions["menu-about"] ? xPositions["menu-about"] : window.innerWidth / 2;
    console.log(xPosition, window.innerWidth);
    topPath.moveTo(xPosition, 0);
    topPath.lineTo(xPosition, window.innerHeight);
    topPath.strokeColor = 'grey';
    pageHandlers[aboutPage] = {
        onPageResize: function () {
            window.location.reload();
        }
    };
    registerPagePostLoad(aboutPage, () => {
        console.log("Test");
        xPosition = window.innerWidth / 2;
        topPath.removeSegments();
        topPath.moveTo(xPosition, 0);
        topPath.lineTo(xPosition, window.innerHeight);
    });
});










