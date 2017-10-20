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
 * Register modal
 * @param {string} modalId 
 * @param {string} buttonId 
 */
var registerModal = function (modalId, buttonId) {
    // Get the modal
    var modal = document.getElementById(modalId);

    // Get the button that opens the modal
    var btn = document.getElementById(buttonId);

    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];

    // When the user clicks the button, open the modal 
    btn.onclick = function () {
        modal.style.display = "block";
    }

    // When the user clicks on <span> (x), close the modal
    span.onclick = function () {
        modal.style.display = "none";
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
};

var showScrollMessage = function (x) {
    $("#scroll-message").width(200);
    if (!x) {
        $("#scroll-message").css("right", "50%");
    }
    else {
        $("#scroll-message").css("left", x);
    }
    $("#scroll-message").fadeIn(400, function () {
        setTimeout(function () {
            //$("#scroll-message").fadeOut(400);
        }, 5000);
    });
};

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

var PREVENT_MAIN_MOUSE_BIND = false;

var defaultMouseWheelHandler = function (e) {
    var delta;
    if (e.wheelDelta)
        delta = e.wheelDelta;
    else delta = e.originalEvent.wheelDelta;
    if (delta > 0) {
        //go up
        console.log("Up", animStack);
        if (animStack.length == 0 && pageHandlers[getCurrentPage()] && pageHandlers[getCurrentPage()].onUpScroll && !PREVENT_MAIN_MOUSE_BIND)
            pageHandlers[getCurrentPage()].onUpScroll();
    }
    else {
        //go down
        console.log("Down");
        if (animStack.length == 0 && pageHandlers[getCurrentPage()] && pageHandlers[getCurrentPage()].onDownScroll && !PREVENT_MAIN_MOUSE_BIND)
            pageHandlers[getCurrentPage()].onDownScroll();
    }
};

/**
 * Prevents default scroll behavior on given element
 * @param {string} id Element ID 
 */
var preventScrollBehaviorOnElement = function (id) {
    $('#' + id).mouseenter(function () { PREVENT_MAIN_MOUSE_BIND = true; });
    $('#' + id).mouseleave(function () { PREVENT_MAIN_MOUSE_BIND = false; });
}

var MOUSE_OVER = false;
$('body').bind('mousewheel', function (e) {
    return true;
});

$('#' + projectPage).mouseenter(function () { MOUSE_OVER = true; });
$('#' + projectPage).mouseleave(function () { MOUSE_OVER = false; });

$('#' + projectPage).bind('mousewheel', defaultMouseWheelHandler);


var fireDescription = `<p>I am writing this because I needed to give an impression of some random text. Just to see how it looks. This one is called Fire, for some weird reason. I am writing this because I needed to give an impression of some random text. Just to see how it looks. This one is called Fire, for some weird reason.
I am writing this because I needed to give an impression of some random text. Just to see how it looks. This one is called Fire, for some weird reason.
I am writing this because I needed to give an impression of some random text. Just to see how it looks. This one is called Fire, for some weird reason.</p>
`;


var projects = {
    Drone: {
        image: "../img/drone1.png",
        images: ["img/drone1.png", "img/c.jpg"],
        description: fireDescription + "</p>Some random drone text. </p>" + fireDescription + fireDescription
    },
    Emoi: {
        image: "../img/b.jpg",
        images: ["img/a.jpg", "img/c.jpg"],
        description: fireDescription + "<p> New paragraph, for testing </p>"
    },
    "Testimonial Map": {
        image: "../img/a.jpg",
        images: ["img/a.jpg", "img/c.jpg"],
        description: fireDescription + "<p> New paragraph, for testing </p>"
    },
    Other: {
        image: "../img/c.jpg",
        images: ["img/a.jpg", "img/c.jpg"],
        description: fireDescription + "<p> New paragraph, for testing </p>"
    },
};

var animStack = [];

$(document).keyup(function (e) {
    if (pageHandlers[getCurrentPage()] && pageHandlers[getCurrentPage()].onKeyPress)
        pageHandlers[getCurrentPage()].onKeyPress(e);
});


var drawArrow = function (x, y, paperScope) {
    var leftLine = new paperScope.Path();
    var rightLine = new paperScope.Path();
    rightLine.strokeColor = leftLine.strokeColor = 'grey';
    leftLine.moveTo(x - 5, y - 5);
    leftLine.lineTo(x, y);
    rightLine.moveTo(x + 5, y - 5);
    rightLine.lineTo(x, y);
}

registerOnPageLoad(projectPage, function () {
    //lightGallery(document.getElementById('project-images'));
    preventScrollBehaviorOnElement("project-details");
    projects = webData.projects;
    var menuItems = [];
    var idIndex = 1;
    $("#project-list").empty();
    for (var key in projects) {
        menuItems.push({
            id: idIndex,
            text: key
        });
        var currentIndex = idIndex;
        $("#project-list").append(`<li id="pli-${idIndex}">${key}</li>`);
        $(`#pli-${idIndex}`).click(function () {

            var id = $(this).attr('id');
            console.log(id.substr(id.indexOf('pli-') + 4, 1));
            id = id.substr(id.indexOf('pli-') + 4, 1);
            currentHeading = id - 1;
            nextHeading = (currentHeading + 1) % menuItems.length;
            negativeCounter = currentHeading - 1;
            if (negativeCounter < 0)
                negativeCounter = menuItems.length;
            loadProjectMenu();
        });
        idIndex++;
    }
    $("#project-list-container").mouseenter(function (e) {
        $("#project-list").slideDown("fast");
    });
    $("#project-list-container").mouseleave(function (e) {
        $("#project-list").slideUp("fast");

    });

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
    //showScrollMessage(xPosition + 20);
    projectPaper.view.onFrame = function (event) {
    }

    var setGalleryImages = function (images) {
        $("#project-images").fadeOut(100, function () {
            $("#project-images").html('');
            images.forEach(function (image) {
                var html = `<a href="${image}">
                <img class="thumb" src="${image}">
                </a>`;
                $("#project-images").append(html);
            });
            $("#project-images").fadeIn(400, function () {
                lightGallery(document.getElementById('project-images'), {
                    download: false
                });
            });
        });
    };

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
            $("#project-details").html(project.description);
            $("#project-details").fadeIn(200, function (e) {
            });
        });

        setGalleryImages(project.images);

        $("#next-project").fadeOut(100, function () {
            $("#next-project").html('<span class="small">Next: </span>' + menuItems[nextHeading].text);
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

    registerPagePostLoad(projectPage, function () {
        //Re draw lines because the next project element 
        topPath.removeSegments();
        bottomPath.removeSegments();
        topPath.moveTo(xPosition, 20);
        topPath.lineTo(xPosition, $("#next-project").offset().top - 10);
        bottomPath.moveTo(xPosition, $("#next-project").offset().top + $("#next-project").height() + 10);
        bottomPath.lineTo(xPosition, window.innerHeight - 30);
        $("#project-title").css("width", xPosition);
    });
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
        if (menuItemClicked == "menu-home") {
            console.log(menuItemClicked);
            animateLine = false;
            path.removeSegments();
            return;
        }
        path.segments[1].point = path.segments[1].point.add(new Point(0, 10));
        if (path.segments[1].point.y > window.innerHeight) {
            animateLine = false;
            path.removeSegments();
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
        // animateLine = false;
        //path.removeSegments();
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

var onMenuPageLoad = function () {
    animateLine = false;
    path.removeSegments();
}

/**
 * Misc Page
 */



var bindMouseWheel = function (page, handler) {
    $('#' + page).bind('mousewheel', handler);
};

bindMouseWheel(miscPage, defaultMouseWheelHandler);

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

$('#misc-photos').mouseenter(function () { PREVENT_MAIN_MOUSE_BIND = true; });
$('#misc-photos').mouseleave(function () { PREVENT_MAIN_MOUSE_BIND = false; });

$('#misc').mouseenter(function () { MOUSE_OVER = true; });
$('#misc').mouseleave(function () { MOUSE_OVER = false; });



var galleryLoaded = {}; //Variable to store the loaded galleries(photos, art) so as to not load them again.
registerOnPageLoad(miscPage, function () {
    var xPosition = xPositions["menu-art"] ? xPositions["menu-art"] : window.innerWidth * (0.671); //!!IMPORTANT 
    //showScrollMessage(xPosition + 20);
    var currentGallery = '';
    var loadGallery = function (galleryId, data) {
        var closePhoto = function () {
            animStack.pop(); //Enable scrolling again
            $("#misc-photo-container").fadeOut(400);
            $("#misc-description-container").fadeOut(400);
            //loadCurrentSection();
            bindMouseWheel(miscPage, defaultMouseWheelHandler);
        };
        console.log("Emptying...");
        $(galleryId).empty();
        $(galleryId).galereya({
            wave: false,
            slideShowSpeed: 4000,
            disableSliderOnClick: true,
            onCellClick: function (e) {
                animStack.push(true);
                //hideAllSections();
                $("#misc-photo-container").fadeIn(400);
                var imgSrc = e.target.parentNode.getElementsByTagName("img")[0].src;
                var galleryArray = webData.misc[currentGallery];
                var imageObject = findObjectByAttribute(galleryArray, "fullsrc", imgSrc.substr(imgSrc.indexOf("/img") + 1, imgSrc.length));
                $("#misc-description").text(imageObject.fullDescription);
                $("#misc-desc-title").text(imageObject.description);
                $("#misc-description-container").fadeIn(400);
                console.log("Gallery", imgSrc.substr(imgSrc.indexOf("/img") + 1, imgSrc.length));

                // $("#misc-photo").width(xPosition - 60);
                $("#misc-photo-container").width(xPosition - 20);
                $("#misc-photo").attr("src", e.target.parentNode.getElementsByTagName("img")[0].src);
                if ($("#misc-photo").width() > (xPosition - 60)) {
                    $("#misc-photo").width(xPosition - 60);
                }
                $("#misc-photo-close").click(closePhoto);
                $("#misc-photo-container").click(closePhoto);
            },
            load: function (next) {
                next(data);
            }
        });

    };

    var loadWriting = function (item) {
        hideAllSections();
        animStack.push(true); //Hacky way to disable scrolling behavior
        var writing = writings[item.id];
        console.log(writing, item);
        $("#writing-desk-title").text(item.title);
        $("#writing-desk").width(xPosition);
        $("#writing-content").html(writing);
        $("#writing-desk").fadeIn(200);
        $("#writing-desk-close").click(function () {
            animStack.pop(); //Enable scrolling again
            $("#writing-desk").fadeOut(400);
            loadCurrentSection();
            bindMouseWheel(miscPage, defaultMouseWheelHandler);
        });
    };

    /**
     * Art page main menu sections
     */
    var headings = ["Photography", "Sketches", "Writing"];
    var loadSideMenu = function () {
        var miscMenuItems = headings;
        $("#misc-list").empty();
        for (var i = 0; i < miscMenuItems.length; ++i) {
            var key = miscMenuItems[i];
            var currentIndex = i;
            $("#misc-list").append(`<li id="mli-${currentIndex}">${key}</li>`);
            $(`#mli-${currentIndex}`).click(function () {
                var id = $(this).attr('id');
                console.log(id.substr(id.indexOf('mli-') + 4, 1));
                id = id.substr(id.indexOf('mli-') + 4, 1);
                currentHeading = id;
                nextHeading = (currentHeading + 1) % miscMenuItems.length;
                negativeCounter = currentHeading - 1;
                if (negativeCounter < 0)
                    negativeCounter = miscMenuItems.length;
                setMenuHeading();
            });
        }
        $("#misc-list-container").mouseenter(function (e) {
            $("#misc-list").slideDown("fast");
        });
        $("#misc-list-container").mouseleave(function (e) {
            $("#misc-list").slideUp("fast");
        });
    };
    //loadSideMenu();

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

    var loadWritingDeck = function (data) {
        $("#writing-deck").empty();
        data.forEach(function (item) {
            var html = `<div class="module mid" id="${item.id}">
                <h2>${item.title}</h2>
                </div>`;
            $("#writing-deck").append(html);
            $('#' + item.id).css("background-image", "url(" + item.image + ")");
            $('#' + item.id).click(e => loadWriting(item));
        });
    };

    var loadSectionGallery = function (section) {
        //if (galleryLoaded[section]) return;
        switch (section) {
            case "#misc-photos":
                currentGallery = "photos";
                var data = webData.misc.photos;
                loadGallery("#misc-gallery", data);
                break;
            case "#misc-art":
                currentGallery = "art";
                var data = webData.misc.art;
                loadGallery("#misc-art-gallery", data);
                break;
            case "#misc-writing":
                currentGallery = "writing";
                var data = writingData;
                loadWritingDeck(data);
                break;
            default:
                break;
        }
        galleryLoaded[section] = true;
    };

    $('body').unbind('mousewheel');
    $('body').bind('mousewheel', function (e) {
        return true;
    });

    preventScrollBehaviorOnElement("misc-art-gallery");

    var miscCanvas = document.getElementById('misc-canvas');
    var miscPaper = new paper.PaperScope();
    miscPaper.setup(miscCanvas);
    var topPath = new miscPaper.Path();
    var bottomPath = new miscPaper.Path();

    $("#misc-side-image").css({ width: window.innerWidth - xPosition });
    $("#misc-side-title").css({ width: window.innerWidth - xPosition, height: window.innerHeight / 2 });

    topPath.strokeColor = 'grey';
    bottomPath.strokeColor = 'grey';
    miscPaper.view.onFrame = function () {
    };

    
    var sideImages = ["../img/side-image.png", "../img/side-image-art.png", "../img/side-image-writing.png"]
    var headingIdMap = {
        Photography: "#misc-photos",
        Sketches: "#misc-art",
        Writing: "#misc-writing"
    };
    var currentHeading = 0;
    var negativeCounter = 0;
    var nextHeading = 1;
    var sections = ["#misc-photos", "#misc-art", "#misc-writing"];
    var hideAllSections = function () {
        sections.forEach(function (section) {
            $(section).fadeOut(200);
        });
    };

    var loadCurrentSection = function () {
        var currentSection = headingIdMap[headings[currentHeading]];
        $(currentSection).fadeIn(400, function () {
            loadSectionGallery(currentSection);
        });
    }
    var setMenuHeading = function () {
        var ids = ["#misc-menu-heading", "#misc-side-title"];
        ids.forEach(function (id) {
            animStack.push(true);
            $(id).fadeOut(200, function () {
                $("#misc-menu-heading").html(headings[nextHeading]);
                $("#misc-menu-heading").css("left", xPosition - $("#misc-menu-heading").width() / 2);
                $("#misc-side-title").text(headings[currentHeading]);
                $(id).fadeIn(400, function () {
                    animStack.pop();
                });
            })
        });

        $("#misc-side-image").fadeOut(100, function () {
            $("#misc-side-image").css("background-image", "url(" + sideImages[currentHeading] + ")");
            $("#misc-side-image").fadeIn(400, function (e) {
            });
        });
        var currentSection = headingIdMap[headings[currentHeading]];
        sections.forEach(function (section) {
            if (currentSection == section) return;
            $(section).fadeOut(200);
        });
        $(currentSection).fadeIn(400, function () {
            console.log("Load ", currentSection);
            loadSectionGallery(currentSection);
        });
    };

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
    pageHandlers[miscPage] = {
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

    registerPagePostLoad(miscPage, function () {
        //loadSectionGallery("#misc-photos");
        topPath.removeSegments();

        topPath.moveTo(xPosition, 20);
        topPath.lineTo(xPosition, $("#misc-menu-heading").offset().top);
        bottomPath.removeSegments();
        bottomPath.moveTo(xPosition, $("#misc-menu-heading").offset().top + $("#misc-menu-heading").height() + 20);
        bottomPath.lineTo(xPosition, window.innerHeight - 20);
    });
});

bindMouseWheel(dancePage, defaultMouseWheelHandler);

$('#dance').mouseenter(function () { MOUSE_OVER = true; });
$('#dance').mouseleave(function () { MOUSE_OVER = false; });

var slideShowTimer = null;
registerOnPageLoad(dancePage, function () {
    var danceCanvas = document.getElementById('dance-canvas');
    var dancePaper = new paper.PaperScope();
    dancePaper.setup(danceCanvas);
    var topPath = new dancePaper.Path();
    var bottomPath = new dancePaper.Path();
    topPath.strokeColor = bottomPath.strokeColor = 'grey';
    var currentHeading = 0;
    var negativeCounter = 0;
    var nextHeading = 1;
    var xPosition = xPositions["menu-dance"] ? xPositions["menu-dance"] : window.innerWidth * (0.671);
    preventScrollBehaviorOnElement("dance-side-description");
    var loadSideMenu = function () {
        $("#dance-list").empty();
        for (var i = 0; i < webData.dance.performances.length; ++i) {
            var key = webData.dance.performances[i];
            var currentIndex = i;
            $("#dance-list").append(`<li id="dli-${currentIndex}">${key}</li>`);
            $(`#dli-${currentIndex}`).click(function () {
                var id = $(this).attr('id');
                console.log(id.substr(id.indexOf('dli-') + 4, 1));
                id = id.substr(id.indexOf('dli-') + 4, 1);
                currentHeading = id;
                nextHeading = (currentHeading + 1) % webData.dance.performances.length;
                negativeCounter = currentHeading - 1;
                if (negativeCounter < 0)
                    negativeCounter = webData.dance.performances.length;
                setMenuHeading();
            });
        }
        $("#dance-list-container").mouseenter(function (e) {
            $("#dance-list").slideDown("fast");
        });
        $("#dance-list-container").mouseleave(function (e) {
            $("#dance-list").slideUp("fast");
        });
    };

    loadSideMenu();
    //showScrollMessage(xPosition + 20);
    $("#dance-menu-heading").css("left", xPosition - $("#dance-menu-heading").width() / 2);
    $("#dance-side-title").css({ width: window.innerWidth - xPosition, height: window.innerHeight / 2 });
    $("#dance-main-image").css({ width: window.innerWidth - (window.innerWidth - xPosition) });
    $("#dance-side-description").css({ width: window.innerWidth - xPosition, height: window.innerHeight / 2 });
    topPath.moveTo(xPosition, 0);
    topPath.lineTo(xPosition, $("#dance-menu-heading").offset().top - 10);
    bottomPath.moveTo(xPosition, $("#dance-menu-heading").offset().top + $("#dance-menu-heading").height() + 10);
    bottomPath.lineTo(xPosition, window.innerHeight);
    var danceSections = webData.dance.performances;
    var danceDescriptions = webData.dance.danceDescriptions;
    var danceImages = webData.dance.images;
    var danceImagesArray = webData.dance.imageArray;
    var setGalleryImages = function (images) {
        $("#dance-images").html('');
        images.forEach(function (image, index) {
            if (index == 0) {
                var html = `<a href="${image}"><span class="glyphicon glyphicon-th"></span>
                </a>`;
            }
            else {
                var html = `<a href="${image}" class="hidden">${index + 1}
                </a>`;
            }
            $("#dance-images").append(html);

        });
        lightGallery(document.getElementById('dance-images'), {
            download: false
        });
    };
    clearInterval(slideShowTimer);
    var setDanceImageSlideShow = function (headerPosition) {
        var images = danceImagesArray[headerPosition];
        setGalleryImages(images);
        var currentIndex = 0;
        slideShowTimer = setInterval(function () {
            currentIndex = (currentIndex + 1) % images.length;
            var image = images[currentIndex];
            $("#dance-main-image").fadeOut(100, function (e) {
                $("#dance-main-image").css("background-image", "url('" + image + "')");
                $("#dance-main-image").fadeIn(400, function (e) {
                });
            });
        }, 4000);
    }
    var setMenuHeading = function () {
        animStack.push();
        $("#dance-menu-heading").fadeOut(100, function () {
            var heading = danceSections[nextHeading];
            $("#dance-menu-heading").html('<span class="small">Next: </span>' + heading);
            $("#dance-menu-heading").fadeIn(400, function () {
                animStack.pop();
            });
        });

        $("#dance-main-image").fadeOut(100, function (e) {
            $("#dance-main-image").css("background-image", "url(" + danceImagesArray[currentHeading][0] + ")");
            $("#dance-main-image").fadeIn(400, function (e) {
            });
            clearInterval(slideShowTimer);
            setDanceImageSlideShow(currentHeading);
        });


        $("#dance-side-title").fadeOut(100, function () {
            $("#dance-side-title").text(danceSections[currentHeading]);
            $("#dance-side-title").fadeIn(400);
        });

        animStack.push(true);
        $("#dance-side-description").fadeOut(100, function () {
            $("#dance-side-description").html(danceDescriptions[currentHeading]);
            $("#dance-side-description").fadeIn(400, function () {
                animStack.pop();
            });
        });
    }

    setMenuHeading();
    //On scroll up
    var dancePageMenuUp = function () {
        nextHeading = currentHeading;
        currentHeading = (currentHeading + 1) % danceSections.length;
        negativeCounter = currentHeading;
        setMenuHeading();
    }
    //On scroll down
    var dancePageMenuDown = function () {
        negativeCounter = negativeCounter - 1;
        if (Math.abs(negativeCounter) == danceSections.length) {
            negativeCounter = 0;
        }
        currentHeading = Math.abs(negativeCounter);
        nextHeading = (currentHeading + 1) % danceSections.length;
        setMenuHeading();
    }
    //Defining page handlers for currentPage
    pageHandlers[dancePage] = {
        onPageResize: function () {
            window.location.reload(true);
        },
        onKeyPress: function (e) {
            switch (e.which) {
                case 38: //Up
                    if (animStack.length == 0)
                        dancePageMenuUp();
                    break;
                case 40: //Down
                    if (animStack.length == 0)
                        dancePageMenuDown();
                    break;
            }
        },
        onUpScroll: dancePageMenuUp,
        onDownScroll: dancePageMenuDown
    }

    registerPagePostLoad(dancePage, function () {
        //preventScrollBehaviorOnElement('dance-side-description');
        $("#dance-menu-heading").css("left", xPosition - $("#dance-menu-heading").width() / 2);
        topPath.removeSegments();
        bottomPath.removeSegments();
        topPath.moveTo(xPosition, 20);
        topPath.lineTo(xPosition, $("#dance-menu-heading").offset().top - 10);
        bottomPath.moveTo(xPosition, $("#dance-menu-heading").offset().top + $("#dance-menu-heading").height() + 10);
        bottomPath.lineTo(xPosition, window.innerHeight - 25);
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
