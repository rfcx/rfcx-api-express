
  function strLimitLength(str,len) {
    if (str.length > len) { return str.substr(0,len-2) + "...";
    } else { return str; }
  }

  function loadPopularSidebar() {
    var url = '/tagged/popular/rss';
    var $list = $('#popular');
    $.ajax({ url: url, type: 'GET', dataType: 'xml',
      success: function(data) {
        var $items = $(data).find('item:lt(4)');
        $items.each( function() {
          var $item = $(this);
          var link = $item.children('link').text();
          var title = $item.children('title').text();
          var content = $item.children('description').text();
          var date = $item.children('pubDate').text();
          var author = $item.children('dc\\:creator').text();
          if (link || title) {
            $list.append($('<li class="article"><a class="title" href="'+  link +'">'+ strLimitLength(title,28) +'</a>'
              +'<a class="author-name" href="'+  link +'">by '+author+'</a>'
            +'<div class="rte content">'+ content + '</div></li>'));
          } 
        });
        $("#popular li.article").each(function(){
        var imgurl = $(this).find('.rte.content img:eq(0)').attr('src');
        $(this).prepend('<a href="'+$(this).find("a.title").attr("href")+'"><div class="popimg"><img src="'+ imgurl +'" /></div></a>');
      });
    }});
  }

function emailSubscribeFormSetup() {

  if ($("form.rfcx-form").length > 0) {
    $.getScript("http://cdn.rfcx.org/vendor/parsley.js/1.1.16/parsley.min.js",function(){
      $("#mc-embedded-subscribe-form").submit(function(){
        var isEmailValid = $("input.input-large.email").parsley("validate");
        if (!isEmailValid) {
          alert("Please enter a valid e-mail.");
        }
        return isEmailValid;
      });
      $("#mc-embedded-subscribe-form a.btn-success").click(function(){
        $("#mc-embedded-subscribe-form").submit();
      });
    });
  }

}

  
  // //Photoset grid
  // $('.photoset-container').imagesLoaded(function(){
  //   $('.photoset-container').photosetGrid({
  //     gutter: '5px',
  //     rel: $('.photoset-container').attr('data-id'),
  //     highresLinks: true,
  //     onInit: function(){},
  //     onComplete: function(){
  //       // Show the grid after it renders
  //       $('.photoset-container').attr('style', '');
  //       $('.photoset-container a').colorbox({
  //         photo: true, scalePhotos: true, maxHeight:'90%', maxWidth:'90%'
  //       });
  //     }
  //   });
  // });


$(function(){
  
  loadPopularSidebar();

  var pathname = window.location.pathname;
  var container = $("#container");
  var masonryContainer = $("#masonry-container");
  var featured = masonryContainer.find('.article:first-child');

  if (pathname === "/") {

    var sticky = featured.addClass("sticky");

    $('.article.text').each(function(){
        var firstImage = $(this).find('.text-body img:eq(0)');
        var perms = $(this).attr("data-permalink");
        if (firstImage){
            $(this).find('.post-image').append(firstImage);
            $(this).find('.post-image img').css('width', '100%').wrap('<a href="'+perms+'"></a>');
        }
    });
    
    $(".sticky, .article.text, .article.link").each(function(){
      $(this).find(".text-body").text($.trim($(this).find(".text-body").text()).substring(0, 300) + "[...]");
    });

    masonryContainer.addClass("masonry-container-index").imagesLoaded(function(){
        masonryContainer.masonry({ itemSelector: '.article' });
    });

    $("div.article").each(function(){
      var permaLink = $(this).find("h2 .permalink").attr("href");
      $(this).find("div.post-text").css({height:"13em"}).after("<a class=\"read-more\">read more &raquo;</a>");
      $(this).find("div.text-body").each(function(){
        $(this).css({cursor:"pointer", fontStyle:"italic", color:"rgb(131, 131, 131)"}).attr("onClick","location='"+permaLink+"';");
      });
      $(this).css({width:"49.9%"});
    });

    container.find(".section-header-featured").after(sticky);
    masonryContainer.find(".large-6").removeClass("large-6").removeClass("six").addClass("large-12").addClass("twelve");
  
  } else if (pathname.substr(0,6) === "/post/") {

      $('.text-body img, #post-notes img').each(function(){
         $(this).addClass('th');
      });
  }

  container.css({visibility:"visible"});
  
  emailSubscribeFormSetup();

});
