
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

setTimeout(typeFallSeven, 2000);

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

$("#toProject").click(function () {
    route("third", "second");
});

var getCurrentPage = function () {
    var url = window.location.href;
    return url.indexOf('#!/') == -1 ? null : (url.substr(url.indexOf('#!/') + 3, url.length - url.indexOf('#')));
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

var route = function (toPage, fromPage) {
    if (!toPage) toPage = 'first';
    if (!fromPage) {
        pageIds.forEach(function (v, i, arr) {
            $("#" + v).css("left", "-100%");
            console.log(v, toPage);
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
        console.log(v, page);
    });
    $("#" + page).css("left", "0px");
}

window.onpopstate = function (e) {
    console.log(window.history);
    console.log(e);
};


window.onhashchange = function () {
    console.log(getCurrentPage());
    if (getCurrentPage() == null || getCurrentPage() == '') {
        route("first")
    }
    else {
        route(getCurrentPage());
    }
    console.log('Hash change');
    if (pageRefreshPipeline[getCurrentPage()]) {
        pageRefreshPipeline[getCurrentPage()]();
    }
}

var onLoad = function () {
    if (getCurrentPage() == null) {
        directLoad("first")
    }
    else {
        directLoad(getCurrentPage());
    }
}

var onProjectPageLoad = function () {
    console.log('Loaded page 3');
}

var pageRefreshPipeline = [];

var registerPageRefresh = function (page, fn) {
    pageRefreshPipeline[page] = fn;
}

registerPageRefresh("first", onLoad);
registerPageRefresh("third", onProjectPageLoad);
var hasLoadedOnce = false;

window.onload = function () {
    onLoad();
    if (!hasLoadedOnce) {
        hasLoadedOnce = true;
    }
    else {

    }
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
        text: "Project #1",
        middle: false,
        element: null
    },
    {
        id: 2,
        top: 50,
        text: "Project #2",
        middle: true,
        element: null
    },
    {
        id: 3,
        top: 75,
        text: "Project #3",
        middle: false,
        element: null
    }
]

var loadProjectMenu = function () {
    console.log("Project Menu loading");
    var idName = "#pname";
    menuItems.forEach(function (val) {
        var element = $(idName + val.id);
        element.text(val.text);
        if (val.middle) {
            $("#project-title").text(val.text);
            element.css("font-size", "22pt");
        }
        element.css("top", val.top + '%');
        menuItems.element = element;
    });

    for (var i = 1; i <= 4; ++i) {
        var line = $("line" + i);
        
    }
}

var animStack = [];

var menuDown = function () {
    var idName = "#pname";
    menuItems.forEach(function (menuItem) {
        var element = $(idName + menuItem.id);
        if (menuItem.top >= 75) {
            animStack.push(true);
            menuItem.top = 25;
            element.animate({
                top: "100%"
            }, 200, function (ele) {
                element.css("top", "0%");
                element.animate({
                    top: "25%"
                }, 200);
                animStack.pop();
            })
        }
        else {

            menuItem.top = menuItem.top + 25;
            if (menuItem.top == 50) {
                menuItem.nextMiddle = true;
            }

            var animations = {
                top: menuItem.top + "%"
            };
            if (menuItem.middle) {
                animations["font-size"] = "12pt";
                animStack.push(true);
                element.animate(animations, 400, function (e) {
                    menuItem.middle = false;
                    animStack.pop();

                });

            }
            if (menuItem.nextMiddle) {
                 $("#project-title").text(menuItem.text);
                animStack.push(true);
                animations["font-size"] = "22pt";
                element.animate(animations, 400, function (e) {
                    menuItem.middle = true;
                    menuItem.nextMiddle = false;
                    animStack.pop();
                });
            }

        }
    });
}

var menuUp = function () {
    var idName = "#pname";
    menuItems.forEach(function (menuItem) {
        var element = $(idName + menuItem.id);
        if (menuItem.top <= 25) {
            animStack.push(true);
            menuItem.top = 75;
            element.animate({
                top: "0%"
            }, 200, function (ele) {
                element.css("top", "100%");
                element.animate({
                    top: "75%"
                }, 200);
                animStack.pop();
            })
        }
        else {

            menuItem.top = menuItem.top - 25;
            if (menuItem.top == 50) {
                menuItem.nextMiddle = true;
            }

            var animations = {
                top: menuItem.top + "%"
            };
            if (menuItem.middle) {
                animations["font-size"] = "12pt";
                animStack.push(true);
                element.animate(animations, 400, function (e) {
                    menuItem.middle = false;
                    animStack.pop();
                });
            }

            if (menuItem.nextMiddle) {
                $("#project-title").text(menuItem.text);
                animStack.push(true);
                animations["font-size"] = "22pt";
                element.animate(animations, 400, function (e) {
                    menuItem.middle = true;
                    menuItem.nextMiddle = false;
                    animStack.pop();
                });
            }

        }
    });
}

loadProjectMenu();












