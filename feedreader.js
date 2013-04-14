var FeedReader = {
	request: null,
	url: '',
	nextFocus: undefined,

	toggle: function(articleid)
	{
		// Change the icon to show the user he clicked correctly because sometimes it takes up to five seconds
		//document.getElementById('statusimg-' + articleid).src = FeedReader.pluginurl + "/working.png";
		this.request = $.ajax(
		{
				method: 'GET',
				url: this.url,
				dataType: 'text',
				data: { q: articleid },
				success: function (data) { FeedReader.changeStatus(data, articleid); }
		});
	},

	changeStatus: function(data, articleid)
	{
		switch(data.trim())
		{
			case "read":
			case "unread":
				document.getElementById('statusimg-' + articleid).title = data;
				document.getElementById('statusimg-' + articleid).alt = data;
				$("#post-" + articleid).toggleClass("read");
				$("#post-" + articleid).toggleClass("unread");
				break;
			default:
				document.getElementById('statusimg-' + articleid).title = "Error";
				document.getElementById('statusimg-' + articleid).alt = "Error";
				break;
		}
	},
	
	jumpUnread: function(articleid)
	{
		var next = $("#post-" + articleid).nextAll(".unread");
		if(next.length > 0) { window.location.hash = "#" + next.first().attr("id");	}
	},
	
	jumpUnreadBack: function(articleid)
	{
		var prev = $("#post-" + articleid).prevAll(".unread");
		if(prev.length > 0) { window.location.hash = "#" + prev.first().attr("id");	}
	},
	
	unfocusAll: function() { $(".post.active").removeClass("active"); },
	focus: function(post) { FeedReader.unfocusAll(); post.addClass("active"); }
};

// Scroll logic for marking posts as active
$(window).scroll(function() {
	if($(window).scrollTop() == 0 || $(window).scrollTop() + $(window).height() == $(document).height()) {
		// Work around the workaround. If we jump to the top/end with HOME/END after we used key navigation at the top/end so this function was not triggered, the post to force-focus is not used and has to be removed. Otherwise it would ruin the top/end jump.
		FeedReader.nextFocus = undefined;
	}
	if($(window).scrollTop() == 0 && ($(".post").first().offset().top + $(".post").first().height()) > $(window).height()) {
		// Make sure the focus is always on the top post if the window is scrolled to the very top AND the top post's bottom is not visible.
		// Fixes probems with POS1/HOME key for large posts and avoids focus jumping for short posts
		FeedReader.unfocusAll();
		$(".post").first().addClass("active");
		return;
	}
	if($(window).scrollTop() + $(window).height() == $(document).height() && ($(".post").last().offset().top < $(window).scrollTop())) {
		// Make sure the focus is on the last post if the window is scrolled to the very end AND the last post's top is not visible.
		// Fixes problems with END key for large posts and avoids focus jumping for short posts
		FeedReader.unfocusAll();
		$(".post").last().addClass("active");
		return;
	}
	if($(".post.active").length > 0) {
		var activepost = $(".post.active").first();
		if(($(window).scrollTop() + $(window).height()) - (activepost.offset().top + activepost.height()) > ($(window).height() / 2)) {
			// The active post's bottom is visible and has passed more than half of the window's height, move focus
			if(activepost.next(".post").length > 0) {
				activepost.removeClass("active");
				activepost.next(".post").addClass("active");
			}
		}
		if(($(window).scrollTop() + $(window).height() - activepost.offset().top) < $(window).height() / 2) {
			// The active post has left the window to the bottom, move focus
			if(activepost.prev(".post").length > 0) {
				activepost.removeClass("active");
				activepost.prev(".post").addClass("active");
			}
		}
		activepost = $(".post.active").first();
		if(activepost.offset().top + activepost.height() < $(window).scrollTop() || activepost.offset().top > $(window).scrollTop() + $(window).height())  {
			// The active post has left the visible area completely without triggering one of the other conditions
			// That happens if you use the HOME or END key and your posts are small. In that case we just figure out a new active post
			FeedReader.unfocusAll();
			$(".post").each(function() {
				if($(this).offset().top > $(window).scrollTop() && $(this).offset().top < $(window).scrollTop() + $(window).height()) {
					// We found a post that has the top edge in the visible area
					$(this).addClass("active");
					return false;
				}
			});
			if($(".post.active").length == 0) {
				// We did not find a post with the top edge in the visible area, let's look for one with the bottom edge visible
				// If we did that at the same time the results would be very odd
				$(".post").each(function() {
					if($(this).offset().top + $(this).height() < $(window).scrollTop() + $(window).height() && $(this).offset().top + $(this).height() > $(window).scrollTop()) {
						$(this).addClass("active");
						return false;
					}
				});
			}
		}
	}
	// Workaround for programmatically triggered scrolling, which will always trigger this event, even after the async JQuery animation
	if(typeof FeedReader.nextFocus != 'undefined') {
		FeedReader.focus(FeedReader.nextFocus);
		FeedReader.nextFocus = undefined;
	}
	// This is the logic's end. If you manage to get your active post out of sight so that a long post fills the entire view having neither top nor bottom in the view... well, then you're screwed.
	// If there is no active post in the second part, that's propably because some other logic is working. Don't care then.
});

document.onkeypress = function(event) {
	switch(event.keyCode) {
		// On non-QWERT(Y|Z)-keyboards this might suck
		case 117:
		case 95:
			// u = mark read & next
			if($(".active").first().hasClass("unread")) {
				FeedReader.toggle(pid($(".active").first()));
			}
		case 106:
		case 74:
			// j = next
			var next = $(".post.active").next(".unread");
			if(next.length > 0) {
				$("body,html").animate({scrollTop: next.offset().top - 20}, 100, 'linear', function() {
					FeedReader.focus(next);
					FeedReader.nextFocus = next;
				});
			}
			break;
		case 105:
		case 73:
			// i = mark read & previous
			if($(".active").first().hasClass("unread")) {
				FeedReader.toggle(pid($(".active").first()));
			}
		case 107:
		case 75:
			// k = previous
			var prev = $(".post.active").prev(".unread");
			if(prev.length > 0) {
				$("body,html").animate({scrollTop: prev.offset().top - 20}, 100, 'linear', function() {
					FeedReader.focus(prev);
					FeedReader.nextFocus = prev;
				});
			}
			break;
		case 109:
		case 77:
			// m = toggle read
			FeedReader.toggle(pid($(".post.active")));
			break;
	}
};

function pid(jqobject) {
	return jqobject.attr("id").substr(5);
	//return jqobject.attr("id").substr(jqobject.attr("id").lastIndexOf("-") + 1);
}

$(document).ready(function() {
	$(".post").first().addClass("active");
});