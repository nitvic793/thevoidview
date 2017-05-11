
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
            $("#" + v).css( "left","-100%");
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
    if (getCurrentPage() == null) {
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
    console.log('Loaded page 2');
}

var pageRefreshPipeline = [];

var registerPageRefresh = function (page, fn) {
    pageRefreshPipeline[page] = fn;
}

registerPageRefresh("first", onLoad);
registerPageRefresh("second", onProjectPageLoad);
var hasLoadedOnce = false;

window.onload = function () {
    onLoad();
    if (!hasLoadedOnce) {
        hasLoadedOnce = true;
    }
    else {

    }
}










