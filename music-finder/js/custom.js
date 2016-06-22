$(window).load(function() {
    $('.flexslider').flexslider({
        animation: "fade",
        animationLoop: true,
        controlNav: true,
        directionNav: false
    });
});

  var colors = new Array(
      [230,105,147],
      [58,164,178],
      [40,26,88],
      [232,24,122]);

    var step = 0;
    //color table indices for: 
    // current color left
    // next color left
    // current color right
    // next color right
    var colorIndices = [0,1,2,3];

    //transition speed
    var gradientSpeed = 0.002;

    function updateGradient() {
      var c0_0 = colors[colorIndices[0]];
      var c0_1 = colors[colorIndices[1]];
      var c1_0 = colors[colorIndices[2]];
      var c1_1 = colors[colorIndices[3]];

      var istep = 1 - step;
      var r1 = Math.round(istep * c0_0[0] + step * c0_1[0]);
      var g1 = Math.round(istep * c0_0[1] + step * c0_1[1]);
      var b1 = Math.round(istep * c0_0[2] + step * c0_1[2]);
      var color1 = "#"+((r1 << 16) | (g1 << 8) | b1).toString(16);

      var r2 = Math.round(istep * c1_0[0] + step * c1_1[0]);
      var g2 = Math.round(istep * c1_0[1] + step * c1_1[1]);
      var b2 = Math.round(istep * c1_0[2] + step * c1_1[2]);
      var color2 = "#"+((r2 << 16) | (g2 << 8) | b2).toString(16);

        $('.gradient').css({background: "-webkit-radial-gradient(80% 10%, circle, "+color1+", transparent), -webkit-radial-gradient(80% 50%, circle, "+color2+", transparent)"});
        
        step += gradientSpeed;
        if ( step >= 1 )
        {
          step %= 1;
          colorIndices[0] = colorIndices[1];
          colorIndices[2] = colorIndices[3];
          
          //pick two new target color indices
          //do not pick the same as the current one
          colorIndices[1] = ( colorIndices[1] + Math.floor( 1 + Math.random() * (colors.length - 1))) % colors.length;
          colorIndices[3] = ( colorIndices[3] + Math.floor( 1 + Math.random() * (colors.length - 1))) % colors.length;
          
        }
    } setInterval(updateGradient,10);


$(document).ready(function() {
     $('.preloading').fadeOut();

    $('#carousel_vertical_slide, #carousel-testimonial-1, #carousel-testimonial-2, #carousel_fade, #carousel_vertical_testimonial, #carousel_fade_icons, #carousel-support, #carousel_fade_2, #carousel_testimonial_2').carousel({
        interval: 3000
    });
    $('#logokhan').hover(function() {
        $(this).addClass('animated tada');
    }, function() {
        $(this).removeClass('animated tada');
    });
    //            Responsive Videos
    $("#main-media").fitVids();
    ///////////// HEIGHT OF FIRST FRAME OF WEBSITE
    $(function() {
        $('#top').css({
            'height': ($(window).height()) + 'px'
        });
        $(window).resize(function() {
            $('#top').css({
                'height': ($(window).height()) + 'px'
            });
        });
    });
    //////// NICE SCROLL JS
    $(function() {
        $("html").niceScroll({
            horizrailenabled: false
        });
    });
});
///////////// ANCHOR SCROLLS    
$("a[href^='#top']").click(function(event) {
    event.preventDefault();
    var full_url = this.href;
    var parts = full_url.split("#");
    var trgt = parts[1];
    var target_offset = $("#" + trgt).offset();
    var target_top = target_offset.top - 80;
    $('html, body').animate({
        scrollTop: target_top
    }, 2500, 'easeOutBounce');
});
$("a[href^='#features']").click(function(event) {
    event.preventDefault();
    var full_url = this.href;
    var parts = full_url.split("#");
    var trgt = parts[1];
    var target_offset = $("#" + trgt).offset();
    var target_top = target_offset.top - 0;
    $('html, body').animate({
        scrollTop: target_top
    }, 1000, 'easeInOutExpo');
});
$(".nav li a[href^='#']").click(function(event) {
    event.preventDefault();
    var full_url = this.href;
    var parts = full_url.split("#");
    var trgt = parts[1];
    var target_offset = $("#" + trgt).offset();
    var target_top = target_offset.top - 0;
    $('html, body').animate({
        scrollTop: target_top
    }, 1500, 'easeInOutExpo');
});
//
//  
// Cache selectors
var lastId,
    topMenu = $(".nav"),
    topMenuHeight = topMenu.outerHeight() + 50,
    // All list items
    menuItems = topMenu.find("a"),
    // Anchors corresponding to menu items
    scrollItems = menuItems.map(function() {
        var item = $($(this).attr("href"));
        if (item.length) {
            return item;
        }
        ///////////////TWITTER 

        $('.tweets').each(function() {
            var tweets = $(this),
                data = tweets.data() || {};
            tweets.tweet({
                modpath: 'assets/twitter/',
                username: data.username,
                count: data.count,
                template: "{text}{time}",
                loading_text: 'loading twitter feed...'
            });
        });
        ///////////////FANCYBOX 
        $(".fancybox-media").fancybox({
            arrows: true,
            padding: 0,
            closeBtn: true,
            openEffect: 'fade',
            closeEffect: 'fade',
            prevEffect: 'fade',
            nextEffect: 'fade',
            helpers: {
                media: {},
                overlay: {
                    locked: false
                },
                buttons: false,
                title: {
                    type: 'inside'
                }
            },
            beforeLoad: function() {
                var el, id = $(this.element).data('title-id');
                if (id) {
                    el = $('#' + id);
                    if (el.length) {
                        this.title = el.html();
                    }
                }
            }
        });
    });
