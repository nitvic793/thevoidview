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

String.prototype.trunc = function (n, useWordBoundary) {
    if (this.length <= n) { return this; }
    var subString = this.substr(0, n - 1);
    return (useWordBoundary
        ? subString.substr(0, subString.lastIndexOf(' '))
        : subString) + "&hellip;";
};

var addAfterStyleSheetRule = function (id, image) {
    var template = `content: "";
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;

    background-image: url(${image});
    background-size: cover;
    opacity: 0.2;`;
    // Create a new style tag
    var style = document.createElement("style");

    // Append the style tag to head
    document.head.appendChild(style);

    // Grab the stylesheet object
    sheet = style.sheet

    sheet.insertRule(id + `::after { ${template} }`, 0);
};

registerOnPageLoad(projectPage, function () {
    //$("#project-list").fullpage();
    projects = webData.projects;
    var menuItems = [];
    var idIndex = 1;
    $(".page-title").click(function () {
        $("#project-list").animate({ scrollTop: 0 });
    });

    var setGalleryImages = function (galleryId, images) {
        $('#' + galleryId).html('');
        images.forEach(function (image, index) {
            if (index == 0) {
                var html = `<a href="${image}"><span class="glyphicon glyphicon-th"></span>
                </a>`;
            }
            else {
                var html = `<a href="${image}" class="hidden">${index + 1}
                </a>`;
            }
            $('#' + galleryId).append(html);

        });
        lightGallery(document.getElementById(galleryId), {
            download: false
        });
    };

    var addProjectToList = function (title, image, text, images, nextProject, id) {
        var shortDesc = text.trunc(100, true);
        var template = ` <div class="project-container" id="project${id}">
            <div class="project-card">
            <div class="project-name">${title}</div>
            <div class="project-image" id="pi${id}"></div>
            <div class="project-short-desc" id="pshort${id}">${shortDesc} <a>${text.length > 100 ? "more" : ""}</a></div>
            <div class="project-text" id="pt${id}">
            <div class="project-text-internal" id="ptext${id}">${text}</div>
            </div>
            <!--div class="read-more" id="pr${id}">...</div-->
            <div class="project-gallery" id="pgallery${id}"><span class="glyphicon glyphicon-th"></span></div>
            </div>
            <div class="vertical-line"></div>
            <div class="horizontal-line"></div>
            <div class="next-project-name" id="nextp${id}">${nextProject}</div>
            </div>`;
        $("#project-list").append(template);
        $("#pi" + id).css("background", "url(" + image + ") no-repeat  center center"); //change background image
        $("#pi" + id).css("background-size", "cover");

        addAfterStyleSheetRule("#pt" + id, image);
        var readMoreToggle = function (textFirst, a) {
            var imageId = "#pi" + id;
            var shortDescId = `#pshort${id}`;
            var fullTextId = `#pt${id}`;
            if (textFirst == 'textFirst') {
                $(fullTextId).fadeToggle("fast", function () {
                    $(imageId).fadeToggle("fast");
                    $(shortDescId).fadeToggle("fast");
                });
            }
            else {
                $(shortDescId).fadeToggle("fast");
                $(imageId).fadeToggle("fast", function () {
                    $(fullTextId).fadeToggle("fast");
                });
            }

        };

        $("#pi" + id).click(readMoreToggle);

        $("#pshort" + id).click(readMoreToggle);
        $("#pr" + id).click(readMoreToggle);
        $("#pt" + id).click(readMoreToggle.bind(null, "textFirst"));

        $("#nextp" + id).click(function () {
            console.log("nextp" + id);
            $('#project-list').stop().animate({ scrollTop: $("#project" + id).height() * (id + 1) }, 800);
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
            addProjectToList(key, project.image, project.description, project.images, projectList[count + 1] ? projectList[count + 1] : "End", count);
            setGalleryImages(`pgallery${count}`, project.images);
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

    var photoData = webData.misc.photos;
    var artData = webData.misc.art;
    var writing = writingData;

    var loadGallery = function (galleryId, data, currentGallery) {
        var closePhoto = function () {
            animStack.pop(); //Enable scrolling again
            $("#misc-photo-container").fadeOut(400);
            $("#misc-description-container").fadeOut(400);
            //loadCurrentSection();
            bindMouseWheel(miscPage, defaultMouseWheelHandler);
        };

        $(galleryId).empty();
        $(galleryId).galereya({
            spacing: 0,
            wave: false,
            slideShowSpeed: 2000,
            // disableSliderOnClick: true,
            // onCellClick: function (e) {
            //     animStack.push(true);
            //     //hideAllSections();
            //     $("#misc-photo-container").fadeIn(400);
            //     var imgSrc = e.target.parentNode.getElementsByTagName("img")[0].src;
            //     var galleryArray = webData.misc[currentGallery];
            //     var imageObject = findObjectByAttribute(galleryArray, "fullsrc", imgSrc.substr(imgSrc.indexOf("/img") + 1, imgSrc.length));
            //     $("#misc-description").text(imageObject.fullDescription);
            //     $("#misc-desc-title").text(imageObject.description);
            //     $("#misc-description-container").fadeIn(400);
            //     console.log("Gallery", imgSrc.substr(imgSrc.indexOf("/img") + 1, imgSrc.length));

            //     // $("#misc-photo").width(xPosition - 60);
            //     $("#misc-photo-container").width(xPosition - 20);
            //     $("#misc-photo").css("width", "auto");
            //     $("#misc-photo").attr("src", e.target.parentNode.getElementsByTagName("img")[0].src);
            //     if ($("#misc-photo").width() > (xPosition - 60)) {
            //         $("#misc-photo").width(xPosition - 60);
            //     }
            //     $("#misc-photo-close").click(closePhoto);
            //     $("#misc-photo-container").click(closePhoto);
            // },
            load: function (next) {
                next(data);
            }
        });

    };

    $("#writing-text").click(function () {
        $("#writing-text").fadeOut("fast", function () {
            $("#writing-gallery").fadeIn("fast");
        });
    });

    var loadWriting = function () {
        $("#writing-gallery").empty();
        writingData.forEach(function (item) {
            var template = `<div class="writing-card" id="${item.id}">
                    <div class="writing-title">${item.title}</div>
                </div>`;
            $("#writing-gallery").append(template);
            $("#" + item.id).css("background", `linear-gradient(
                rgba(0, 0, 0, 0.7),
                rgba(0, 0, 0, 0.7)
              ),
              url('${item.image}') no-repeat`);
            $("#" + item.id).css("background-size", "100% 90%");
            $("#" + item.id).click(function (e) {
                console.log("test");
                $("#writing-gallery").fadeOut("fast", function () {
                    $("#writing-text").html(item.writing);
                    $("#writing-text").css("background", `linear-gradient(
                        rgba(0, 0, 0, 0.8),
                        rgba(0, 0, 0, 0.8)
                      ),
                      url('${item.image}') no-repeat`);
                    $("#writing-text").css("background-size", "cover");
                    $("#writing-text").fadeIn();
                });
            });

        });

    }

    loadWriting();
    loadGallery("#photo-gallery", photoData, "photos");
    loadGallery("#sketch-gallery", artData, "art");

    $("#next-art0").click(function () {
        $('#art-list').stop().animate({ scrollTop: $("#art-0").height() * (0 + 1) }, 800);
    });

    $("#next-art1").click(function () {
        $('#art-list').stop().animate({ scrollTop: $("#art-1").height() * (1 + 1) }, 800);
    });

    $("#art-title").click(function () {
        $("#art-list").animate({ scrollTop: 0 });
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


var slideShowTimer = null;
registerOnPageLoad(dancePage, function () {
    $("#dance-title").click(function () {
        $("#dance-list").animate({ scrollTop: 0 });
    });
    var danceSections = webData.dance.performances;
    var danceDescriptions = webData.dance.danceDescriptions;
    var danceImages = webData.dance.images;
    var danceImagesArray = webData.dance.imageArray;

    var setGalleryImages = function (galleryId, images) {
        $('#' + galleryId).html('');
        images.forEach(function (image, index) {
            if (index == 0) {
                var html = `<a href="${image}"><span class="glyphicon glyphicon-th"></span>
                </a>`;
            }
            else {
                var html = `<a href="${image}" class="hidden">${index + 1}
                </a>`;
            }
            $('#' + galleryId).append(html);

        });
        lightGallery(document.getElementById(galleryId), {
            download: false
        });
    };

    var addDanceToList = function (title, image, text, images, next, id) {
        var shortDesc = text.trunc(100, true);
        var template = ` <div class="project-container" id="dance${id}">
            <div class="project-card">
            <div class="project-name">${title}</div>
            <div class="project-image" id="di${id}"></div>
            <div class="project-short-desc" id="dshort${id}">${shortDesc} <a>${text.length > 100 ? "more" : ""}</a></div>
            <div class="project-text" id="dt${id}">
            <div class="project-text-internal" id="dtext${id}">${text}</div>
            </div>
            <!--div class="read-more" id="dr${id}">...</div-->
            <div class="project-gallery" id="dgallery${id}"><span class="glyphicon glyphicon-th"></span></div>
            </div>
            <div class="vertical-line"></div>
            <div class="horizontal-line"></div>
            <div class="next-project-name" id="nextd${id}">${next}</div>
            </div>`;
        $("#dance-list").append(template);
        $("#di" + id).css("background", "url('" + image + "') no-repeat  center center"); //change background image
        $("#di" + id).css("background-size", "cover");
        addAfterStyleSheetRule("#dt" + id, image);
        var readMoreToggle = function (textFirst, a) {
            var imageId = "#di" + id;
            var shortDescId = `#dshort${id}`;
            var fullTextId = `#dt${id}`;
            if (textFirst == 'textFirst') {
                $(fullTextId).fadeToggle("fast", function () {
                    $(imageId).fadeToggle("fast");
                    $(shortDescId).fadeToggle("fast");
                });
            }
            else {
                $(shortDescId).fadeToggle("fast");
                $(imageId).fadeToggle("fast", function () {
                    $(fullTextId).fadeToggle("fast");
                });
            }
        };

        $("#di" + id).click(readMoreToggle);

        $("#dshort" + id).click(readMoreToggle);
        $("#dr" + id).click(readMoreToggle);
        $("#dt" + id).click(readMoreToggle.bind(null, "textFirst"));

        $("#nextd" + id).click(function () {
            console.log("nextp" + id);
            $('#dance-list').stop().animate({ scrollTop: $("#dance" + id).height() * (id + 1) }, 800);
        });
    };

    var loadDances = function () {
        $("#dance-list").empty();
        var danceList = webData.dance.performances;
        var count = 0;
        for (var i = 0; i < danceList.length; ++i) {
            var next;
            if (count + 1 > danceList.length - 1) {
                next = danceList[count + 1];
            }
            else {
                next = '';
            }
            addDanceToList(danceList[i], danceImagesArray[i][0], danceDescriptions[i], danceImagesArray[i], danceList[count + 1] ? danceList[count + 1] : "End", count);
            setGalleryImages(`dgallery${i}`, danceImagesArray[i]);
            count++;
        }
    };

    loadDances();

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



    registerPagePostLoad(aboutPage, function () {

    });
});
