var FeedReader = {
	request: null,
	url: '',

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
		window.location.hash = "#" + $("#post-" + articleid).nextAll(".unread").first().attr("id");
	},
	
	jumpUnreadBack: function(articleid)
	{
		window.location.hash = "#" + $("#post-" + articleid).prevAll(".unread").first().attr("id");
	}
};

$(window).scroll(function() {
	// Move the focus when the window scrolls
	$(".post").each(function() {
		// Find the topmost visible element
		if($(this).offset().top >= $(window).scrollTop()) {
			// Remove active class from all elements, then add it to the current and stop
			$(".post.active").each(function() { $(this).removeClass("active"); });
			$(this).addClass("active");
			return false;
		}
	});
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
			var active = $(".active").first();
			FeedReader.jumpUnread(pid(active));
			// Make sure the focus is moved even if the window is not scrolled
			active.removeClass("active");
			active.nextAll(".unread").first().addClass("active");
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
			var active = $(".active").first();
			FeedReader.jumpUnreadBack(pid(active));
			// Make sure the focus is moved even if the window is not scrolled
			active.removeClass("active");
			active.prevAll(".unread").first().addClass("active");
			break;
		case 109:
		case 77:
			// m = toggle read
			FeedReader.toggle(pid($(".active").first()));
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