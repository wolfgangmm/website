(function ($) {

    $.fn.scrollPagination = function (options) {

        var settings = {
            nop: 10, // The number of posts per scroll to be loaded
            offset: 1, // Initial offset, begins at 0 in this case
            error: 'No More Entries!', // When the user reaches the end this is the message that is
            // displayed. You can change this if you want.
            delay: 500, // When you scroll down the posts will load after a delayed amount of time.
            // This is mainly for usability concerns. You can alter this as you see fit
            scroll: false // The main bit, if set to false posts will not load as the user scrolls.
            // but will still load if the user clicks.
        }

        // Extend the options so they work with the plugin
        if (options) {
            $.extend(settings, options);
        }

        // For each so that we keep chainability.
        return this.each(function () {

            // Some variables
            $this = $(this);
            $settings = settings;
            var offset = $settings.offset;
            var busy = false; // Checks if the scroll action is happening
            // so we don't run it multiple times

            // Custom messages based on settings
            // if ($settings.scroll == true) $initmessage = 'Scroll for more or click here';
            // else $initmessage = 'Click for more';

            // Append custom messages and extra UI
            // $this.append('<div class="content"></div><div class="loading-bar">' + $initmessage + '</div>');

            function getData() {

                var jqxhr = $.ajax({
                    type: "GET",
                    url: "modules/timeline.xql",
                    data: {start: offset, count: $settings.nop },
                    beforeSend: function () {
                        console.log("loading next chunk");
                    }
                })
                    .done(function (data) {
                        // Change loading bar content (it may have been altered)
                        // $this.find('.loading-bar').html($initmessage);
                        // If there is no data returned, there are no more posts to be shown. Show error
                        data = data += "";
                        if (data.length < $settings.nop) {
                            
                            // $this.find('.loading-bar').html($settings.error);
                            $(".scroll").addClass("all-loaded");
                            $(".scroll i").removeClass("fa-spin");
                        }
                        else {

                            // Offset increases
                            offset = offset + $settings.nop;

                            // Append the data to the content div
                            $(".timeline .row").append(data);

                            if (offset == 1) {
                                new WOW().init();
                            }
                            // No longer busy!
                            busy = false;
                        }
                    })
                    .fail(function (error) {
                        console.log("error loading timeline data:'", error, "'");
                    });

            }

            getData(); // Run function initially

            // If scrolling is enabled
            if ($settings.scroll == true) {
                // .. and the user is scrolling
                $(window).scroll(function () {

                    // Check the user is at the bottom of the element
                    if ($(window).scrollTop() + $(window).height() > $this.height() && !busy) {

                        // Now we are working, so busy is true
                        busy = true;

                        // Tell the user we're loading posts
                        // $this.find('.loading-bar').html('Loading Posts');

                        // Run the function to fetch the data inside a delay
                        // This is useful if you have content in a footer you
                        // want the user to see.
                        setTimeout(function () {

                            getData();

                        }, $settings.delay);

                    }
                });
            }

            // Also content can be loaded by clicking the loading bar/
            $this.find('.scroll').click(function () {
                if (busy == false) {
                    busy = true;
                    getData();
                }

            });

        });
    }

})(jQuery);
