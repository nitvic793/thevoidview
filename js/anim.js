$(function () {
    /**
     * First Page animations
     */
    var $demoText = $("#introHeader");
    var $demoText2 = $("#introHeader2");
    $demoText2.hide();

    //Split the text into characters and wrap every character into span element, then convert the whitespaces to whitespace characters.
    $demoText.html($demoText.html().replace(/./g, "<span>$&</span>").replace(/\s/g, "&nbsp;"));

    function startAnimation() {
        TweenMax.staggerFromTo($demoText.find("span"), 0.2, { autoAlpha: 0 }, { autoAlpha: 1 }, 0.2, reset);
    }

    function startAnimation2() {
        $demoText2.show();
        $demoText2.html($demoText2.html().replace(/./g, "<span>$&</span>").replace(/\s/g, "&nbsp;"));
        TweenMax.staggerFromTo($demoText2.find("span"), 0.2, { autoAlpha: 0 }, { autoAlpha: 1 }, 0.15, reset);
    }

    function reset() {
        TweenMax.to(null, 1, { autoAlpha: 1 });
    }

    //startAnimation();

    var captionLength = 0;
    var caption = '';
    var captionEl = $('#introHeader');

    function type() {
        captionEl.html(caption.substr(0, captionLength++));
        if (captionLength < caption.length + 1) {
            if (caption[captionLength - 2] == '.') {
                console.log('test');
                setTimeout(type, 1500);
            }
            else setTimeout(type, 200);
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

    setInterval(cursorAnimation, 600);


    typeFallSeven();




    $("#voidwaybtn").width($("#btnContent").width());

    $("#voidwaybtn").hover(function (e) {
        $("#btnContent").text("the void way ->");
        console.log($("#btnContent").width());
        $("#voidwaybtn").animate({ width: "150px" }, 'fast');
    },
        function (e) {
            $("#btnContent").html('<div id="circle"></div>');
            $("#voidwaybtn").animate({ width: "30px" }, 500);
        });


});