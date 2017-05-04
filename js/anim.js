$(function () {
    /**
     * I. First Page animations
     */

    /**
     * a. Intro - Typewriter animation
     */
    var captionLength = 0;
    var caption = '';
    var captionEl = $('#introHeader');

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

    $("#voidwaybtn").width($("#btnContent").width());

    $("#voidwaybtn").hover(function (e) {
        $("#btnContent").text("the void way ->");
        $("#voidwaybtn").animate({ width: "150px" }, 'fast');
    },
        function (e) {
            $("#btnContent").html('<div id="circle"></div>');
            $("#voidwaybtn").animate({ width: "30px" }, 500);
        });


});