$(document).ready(function() {
	$(".remember-button").on("click", function() {
		if($(this).hasClass("active")) {
			$(this).removeClass("active");
		}
		else {
			$(this).addClass("active");
		}
	});
	$(".login-button").on("click", function() {
		var username = $(".username").val();
		var password = $(".password").val();
		var remember = "disabled";
		if($(".remember-button").hasClass("active")) {
			var remember = "enabled";
		}
		$.ajax({
			url: "./scripts/process.php",
			type: "POST",
			data: { username: username, password: password, remember: remember, action: "login" },
			success: function(data) {
				console.log(data);
				if(data != "valid") {
					notify("Error", data, "rgb(75,75,75)", 5000);
				}
				else {
					location.reload();
				}
			}
		});
	});
	function notify(title, description, color, duration) {
		var build = $('<div class="notification-wrapper noselect"><div class="notification-title-wrapper"><span class="notification-title">' + title + '</span></div><div class="notification-description-wrapper"><span class="notification-description">' + description + '</span></div></div>');
		$(".notification-area").show().append(build);
		$(build).show().css({"left":"-600px","background":color}).animate({left: 0}, 400);
		setTimeout(function() {
			$(build).animate({left: -600}, 400);
			setTimeout(function() {
				$(build).remove();
				if($(".notification-area").html().length == 0) {
					$(".notification-area").hide();
				}
			}, 400);
		}, duration);
	}
});