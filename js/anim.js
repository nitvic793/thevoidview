/**
 * Common
 */

window.onpopstate = function (e) {
    console.log(window.history);
    console.log(e);
};

window.onhashchange = function () {
    console.log("Hash change", getCurrentPage());
    if (getCurrentPage() == null || getCurrentPage() == '') {
        route("first")
    }
    else {
        route(getCurrentPage());
    }
    // if (pageRefreshPipeline[getCurrentPage()]) {
    //     pageRefreshPipeline[getCurrentPage()]();
    // }
    removeLoader();
}

var onLoad = function () {
    if (getCurrentPage() == null) {
        directLoad("first")
    }
    else {
        directLoad(getCurrentPage());
    }
    if (pageRefreshPipeline[getCurrentPage()]) {
        pageRefreshPipeline[getCurrentPage()]();
    }
    removeLoader();
}

var onProjectPageLoad = function () {
    console.log('Loaded page 3');
}

var onMenuPageLoad = function () {
    console.log('Loaded menu page');
}

var pageRefreshPipeline = [];

var registerOnPageLoad = function (page, fn) {
    pageRefreshPipeline[page] = fn;
}

registerOnPageLoad("first", function () {
    setTimeout(typeFallSeven, 2000);
});
registerOnPageLoad("third", onProjectPageLoad);
registerOnPageLoad("second", onMenuPageLoad);
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

/**
 * I. First Page animations
 */

var removeLoader = function () {
    $("#loaderPage").fadeOut(400, function (e) {
        $("#loaderPage").remove();
    });
};

/**
 * a. Intro - Typewriter animation
 */
var captionLength = 0;
var caption = '';
var captionEl = $('#introHeader');
var currentPage = 0;

var pageIds = ["first", "second", "third"];

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

function doneTypingCallback() {
    console.log('Done Typing...');
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
    route("second", "first");
});

var getCurrentPage = function () {
    var url = window.location.href;
    var currentPage = url.indexOf('#!/') == -1 ? null : (url.substr(url.indexOf('#!/') + 3, url.length - url.indexOf('#')));
    if (!currentPage) {
        return "first";
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

var route = function (toPage, fromPage, cb) {
    if (!toPage) toPage = 'first';
    if (!fromPage) {
        pageIds.forEach(function (v, i, arr) {
            $("#" + v).css("left", "-100%");
        });
        $("#" + toPage).css("left", "-100%");
        $("#" + toPage).animate({ "left": "0px" }, 'slow');
    }
    else {
        $("#" + toPage).css("left", "100%");
        $("#" + fromPage).animate({ left: "-100%" }, 'slow');
        $("#" + toPage).animate({ left: "0" }, 'slow');
    }
    window.history.pushState('Object', toPage, '#!/' + toPage);
    if (pageRefreshPipeline[getCurrentPage()]) {
        pageRefreshPipeline[getCurrentPage()]();
    }
}

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

$('#third').mouseenter(function () { MOUSE_OVER = true; });
$('#third').mouseleave(function () { MOUSE_OVER = false; });

$('#third').bind('mousewheel', function (e) {
    var delta;
    if (e.wheelDelta)
        delta = e.wheelDelta;
    else delta = e.originalEvent.wheelDelta;
    if (delta > 0) {
        //go up
        console.log("Up");
        if (animStack.length == 0)
            menuUp();
    }
    else {
        //go down
        console.log("Down", animStack);
        if (animStack.length == 0)
            menuDown();
    }
});

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

var queue = new Queue();
var currentProject = {};
var loadProjectMenu = function () {
    console.log("Project Menu loading");
    var idName = "#pname";
    menuItems.forEach(function (val) {
        $("#project-menu").append(`<div class="projectName" id="pname${val.id}"></div>`);
    });
    menuItems.forEach(function (val, index) {
        var element = $(idName + val.id);
        element.text(val.text);
        menuItems[index].top = (index + 1) * 25;
        element.css("top", val.top + '%');
        menuItems.element = element;
        if (val.top > 75) {
            //Queue all extra project items
            if (val.top == 100) {
                $("#project-title").text(val.text);
                currentProject = val;
                loadProject(val.text);
            }
            queue.enqueue(index);
        }
    });

    for (var i = 1; i <= 4; ++i) {
        var line = $("line" + i);

    }
}

var animStack = [];

var lastDeqeue = null;
var lastUpDeqeue = null;

var processed = {};

var menuDown = function () {
    console.log('MenuDown', lastDeqeue, queue.peek(), processed);
    var idName = "#pname";
    menuItems.forEach(function (menuItem, index) {
        if (processed[index]) return;
        var element = $(idName + menuItem.id);
        if (menuItem.top == 75) {
            currentProject = menuItem;
            loadProject(currentProject.text);

            animStack.push(true);
            if (!queue.isEmpty()) {
                var currentTop = queue.dequeue();
                lastDeqeue = currentTop;
                queue.enqueue(index);
                element.animate({
                    top: "100%",
                    color: "#808080"
                }, 400, function (e) {
                    animStack.pop();
                });
                menuItem.top = 100;
                var currentElement = $(idName + menuItems[currentTop].id);
                currentElement.css("top", "0%");
                animStack.push(true);
                currentElement.animate({
                    top: "25%",
                    color: "#808080"
                }, 400, function () {
                    animStack.pop();
                });
                menuItems[currentTop].top = 25;
                processed[currentTop] = true;
            }
            else {
                menuItem.top = 25;
                element.animate({
                    top: "100%",
                    color: "#808080"
                }, 200, function (ele) {
                    element.css("top", "0%");
                    element.animate({
                        top: "25%",
                        color: "#808080"
                    }, 200);
                    animStack.pop();
                });
            }
        }
        else if (menuItem.top < 100) {
            menuItem.top = menuItem.top + 25;
            var animations = {
                top: menuItem.top + "%",
                color: "#808080"
            };

            animStack.push(true);
            element.animate(animations, 400, function (e) {
                menuItem.middle = false;
                animStack.pop();
            });
        }
        processed[index] = true;
    });
    processed = {};
}

var menuUp = function () {

    console.log('MenuDown', lastUpDeqeue, queue.peek(), processed);
    var idName = "#pname";
    menuItems.forEach(function (menuItem, index) {
        if (processed[index]) return;
        var element = $(idName + menuItem.id);
        if (menuItem.top == 25) {
            currentProject = menuItem;
            loadProject(currentProject.text);
            animStack.push(true);
            if (!queue.isEmpty()) {
                var currentTop = queue.dequeue();
                lastUpDeqeue = currentTop;
                queue.enqueue(index);
                element.animate({
                    top: "-10%",
                    color: "#808080"
                }, 400, function (e) {
                    element.css("top", "100%");
                    animStack.pop();
                });
                menuItem.top = 100;
                var currentElement = $(idName + menuItems[currentTop].id);
                currentElement.css("top", "100%");
                animStack.push(true);
                currentElement.animate({
                    top: "75%",
                    color: "#808080"
                }, 400, function () {
                    animStack.pop();
                });
                menuItems[currentTop].top = 75;
                processed[currentTop] = true;
            }
            else {
                menuItem.top = 25;
                element.animate({
                    top: "100%",
                    color: "#808080"
                }, 200, function (ele) {
                    element.css("top", "0%");
                    element.animate({
                        top: "25%",
                        color: "#808080"
                    }, 200);
                    animStack.pop();
                });
            }
        }
        else {
            menuItem.top = menuItem.top - 25;
            var animations = {
                top: menuItem.top + "%",
                color: "#808080"
            };

            animStack.push(true);
            element.animate(animations, 400, function (e) {
                menuItem.middle = false;
                animStack.pop();
            });
        }
        processed[index] = true;
    });
    processed = {};
}

$(document).keyup(function (e) {
    if (keyHandlers[getCurrentPage()])
        keyHandlers[getCurrentPage()].onKeyPress(e);
});

var keyHandlers = {
    third: {
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
        }
    }
}

var loadProject = function (projectName) {
    var project = projects[projectName];
    $("#project-title").text(projectName);
    $("#project-details").text(project.description);
    animStack.push(true);
    $("#project-image").fadeOut(100, function (e) {
        $("#project-image").css("background-image", "url(" + project.image + ")");
        $("#project-image").fadeIn(200, function (e) {
            animStack.pop();
        });
    });
};

loadProjectMenu();

var canvas = document.getElementById('project-canvas');
paper.setup(canvas);
var path = new paper.Path();
path.strokeColor = 'white';

// Draw the view now:

var paths = [new paper.Path(), new paper.Path(), new paper.Path(), new paper.Path(), new paper.Path()];
view.onFrame = function (event) {
    drawLines();
}

var drawLines = function () {
    var points = getDrawPoints();
    points.forEach(function (p, i) {
        paths[i].strokeColor = 'white';
        if (!p.start || !p.end) return;
        paths[i].removeSegments();
        paths[i].moveTo(p.start);
        paths[i].lineTo(p.end);
    });
}

var getDrawPoints = function () {
    var elements = [];
    menuItems.forEach(function (item) {
        elements.push($("#pname" + item.id));
    });
    var points = [];
    var paperPoints = [];
    points.push(0);
    elements.forEach(function (e) {
        if (e.position().top > 0) {
            points.push(e.position().top);
            var y2 = e.position().top + e.height() + 20;
            points.push(y2);
        }
    });
    points.sort();
    points.forEach(function (point, index) {
        paperPoints.push(new paper.Point($("#pname1").position().left + $("#pname1").width() / 2 + 10, point));
    });
    var finalPoints = [];
    for (var i = 0; i < paperPoints.length; i += 2) {
        finalPoints.push({
            start: paperPoints[i],
            end: paperPoints[i + 1]
        });
    }
    return finalPoints;
}

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
                    route("third", "second");
                    break;
                default:
                //do nothing
            }
        }
    }
}

var menuPageItems = ['menu-home', 'menu-projects', 'menu-about', 'menu-dance', 'menu-art', 'menu-contact'];

$("#menu-projects").click(function () {
    //route("third", "second");
});

menuPageItems.forEach(function (item) {
    $("#" + item).click(function (e) {
        var element = $("#" + item);
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

menuPageItems.forEach(function (val, i) {
    var menu = $("#" + val);
    menu.hover(function (e) {
        if (animStack.length == 0 && $("#menu-image").css("background-image").indexOf(val) == -1) {
            animStack.push(true);

            $("#menu-image").css("background-image", "url(../img/" + val + ".png)");

            $("#menu-image").css({
                left: i * 14 + "%"
            });
            $("#menu-image").fadeIn(100, function () {
                animStack.pop();
            });

        };
    });
});












