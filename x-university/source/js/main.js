$(document).ready(function() {
	
	// Get the SVG code of the icons that will be used later on.
	
	var other_icon = $(".other-icon").prop("outerHTML");
	var trash_icon = $(".trash-icon").prop("outerHTML");
	var file_icon = $(".file-icon").prop("outerHTML");
	
	$(".page").on("click", function() {
		hide_all();
	});
	$(".tile").on("click", function() {
		var page = $(this).attr("id");
		show_page(page);
	});
	
	// Navbar Functionality
	
	$(".navbar .back-icon").on("click", function() {
		var current_page = $(".page.active").attr("data-page");
		if(["finances", "shopping", "documents", "settings", "account"].includes(current_page)) {
			show_page("home");
		}
		if(["notes", "reminders", "files"].includes(current_page)) {
			show_page("documents");
		}
	});
	$(".navbar .menu-icon").on("click", function() {
		if($(this).hasClass("active")) {
			show_menu(false);
		}
		else {
			show_menu(true);
		}
	});
	
	// Finances Page Functionality
	
	$(".balance-category, .balance-category-wrapper .arrow-icon").on("click", function() {
		if($(this).parent().hasClass("active")) {
			$(this).parent().removeClass("active").children("div").hide();
		}
		else {
			$(this).parent().addClass("active").children("div").show();
		}
	});
	$(".balance-button.edit").on("click", function() {
		$(".balance-edit-wrapper, .popup-overlay").show();
	});
	$(".balance-edit-confirm").on("click", function() {
		var eth = $(".balance-edit-input.eth").val();
		var bch = $(".balance-edit-input.bch").val();
		var etn = $(".balance-edit-input.etn").val();
		var hsbc = $(".balance-edit-input.hsbc").val();
		var barclays = $(".balance-edit-input.barclays").val();
		var cash = $(".balance-edit-input.cash").val();
		
		$.ajax({
			url: "./scripts/process.php",
			type: "POST",
			data: { action: "update-balance", eth: eth, bch: bch, etn: etn, hsbc: hsbc, barclays: barclays, cash: cash },
			success: function(data) {
				$(".popup-overlay").trigger("click");
				fetch_balance();
				if(data != "done") {
					notify("Error", "Could not update balance.", "rgb(75,75,75)", 5000);
				}
			}
		});
	});
	$(".transactions-search").on("keyup", function() {
		var search = $(this).val().toLowerCase();
		if(search.trim().length != 0) {
			$(".transaction-item").filter(function() {
				$(this).toggle($(this).text().toLowerCase().indexOf(search) > -1);
			});
		}
		else {
			$(".transaction-item").show().removeAttr("style");
		}
		$(".filter-menu-item").removeClass("active");
		$(".filter-menu-item.newest").addClass("active");
	});
	$(".transactions-toolbar .filter-icon").on("click", function() {
		setTimeout(function() {
			if($(this).hasClass("active")) {
				$(this).removeClass("active");
				$(".filter-menu").hide();
			}
			else {
				$(this).addClass("active");
				$(".filter-menu").show();
			}
		}, 50);
	});
	$(".filter-menu-item").on("click", function() {
		if(!$(this).hasClass("active")) {
			$(this).addClass("active");
			if($(this).hasClass("earned")) {
				$(".transaction-item").show().each(function(element) {
					if($(this).find(".transaction-field.type").hasClass("spent")) {
						$(this).hide();
					}
				});
				$(".filter-menu-item.spent").removeClass("active");
			}
			else if($(this).hasClass("spent")) {
				$(".transaction-item").show().each(function(element) {
					if($(this).find(".transaction-field.type").hasClass("earned")) {
						$(this).hide();
					}
				});
				$(".filter-menu-item.earned").removeClass("active");
			}
			else if($(this).hasClass("gbp")) {
				$(".transaction-item").show().each(function(element) {
					if($(this).find(".details-wrapper .currency").html() == "usd") {
						$(this).hide();
					}
				});
				$(".filter-menu-item.usd").removeClass("active");
			}
			else if($(this).hasClass("usd")) {
				$(".transaction-item").show().each(function(element) {
					if($(this).find(".details-wrapper .currency").html() == "gbp") {
						$(this).hide();
					}
				});
				$(".filter-menu-item.gbp").removeClass("active");
			}
			else if($(this).hasClass("newest")) {
				$(".transaction-item").sort(function(a, b) {
					var date1  = $(a).find(".details-wrapper .date").text();
					var date1 = date1.split(" / ");
					var date1 = new Date(date1[2], date1[1] -1, date1[0]);
					
					var date2  = $(b).find(".details-wrapper .date").text();
					var date2 = date2.split(" / ");
					var date2 = new Date(date2[2], date2[1] -1, date2[0]);
					
					if(date1 < date2) {
						return 1;
					}
					else {
						return -1;
					}
				}).appendTo(".transactions-list");
				$(".filter-menu-item.oldest").removeClass("active");
			}
			else if($(this).hasClass("oldest")) {
				$(".transaction-item").sort(function(a, b) {
					var date1  = $(a).find(".details-wrapper .date").text();
					var date1 = date1.split(" / ");
					var date1 = new Date(date1[2], date1[1] -1, date1[0]);
					
					var date2  = $(b).find(".details-wrapper .date").text();
					var date2 = date2.split(" / ");
					var date2 = new Date(date2[2], date2[1] -1, date2[0]);
					
					if(date1 > date2) {
						return 1;
					}
					else {
						return -1;
					}
				}).appendTo(".transactions-list");
				$(".filter-menu-item.newest").removeClass("active");
			}
			else if($(this).hasClass("reset")) {
				fetch_transactions();
				$(".filter-menu-item").removeClass("active");
				$(".filter-menu-item.newest").addClass("active");
			}
		}
		$(".transactions-search").val("");
	});
	$(".transactions-toolbar .add-icon").on("click", function() {
		$(".transaction-add-wrapper").removeAttr("style");
		$(".popup-overlay, .transaction-add-wrapper, .transaction-add-wrapper .banks").show();
		$(".transaction-add-button").removeClass("active");
		$(".transaction-add-input, .transaction-add-textarea").val("");
		$(".transaction-add-button.bank, .transaction-add-button.hsbc, .transaction-add-button.gbp, .transaction-add-button.spent").addClass("active");
		var date = new Date();
		var day = "0" + date.getDate().toString();
		var month = "0" + date.getMonth().toString();
		$(".transaction-add-input.day").val(day.slice(-2));
		$(".transaction-add-input.month").val(month.slice(-2));
		$(".transaction-add-input.year").val(date.getFullYear());
		$(".transaction-add-confirm").addClass("add").removeClass("edit").attr("id", "");
	});
	$(".transaction-add-button").on("click", function() {
		if(!$(this).hasClass("active")) {
			$(this).parent().find(".transaction-add-button").removeClass("active");
			$(this).addClass("active");
			if($(".transaction-add-button.category.bank").hasClass("active")) {
				$(".transaction-add-wrapper .banks").show();
				$(".transaction-add-wrapper").removeAttr("style").show();
			}
			else {
				$(".transaction-add-wrapper .banks").hide();
				$(".transaction-add-wrapper").css({"height":"456px", "top":"calc(50% - 245px)"});
				if($(window).height() <= 590) {
					$(".transaction-add-wrapper").css({"height":"calc(100% - 30px)","border-radius":"0","top":"0"});
				}
			}
		}
	});
	$(".transaction-add-confirm").on("click", function() {
		var from = $(".transaction-add-input.from").val();
		var to = $(".transaction-add-input.to").val();
		var category = $(".transaction-add-button.category.active").attr("id");
		var currency = $(".transaction-add-button.currency.active").attr("id");
		var institution = $(".transaction-add-button.institution.active").attr("id");
		var day = "0" + $(".transaction-add-input.day").val();
		var month = "0" + $(".transaction-add-input.month").val();
		var year = $(".transaction-add-input.year").val();
		var title = $(".transaction-add-input.title").val();
		var details = $(".transaction-add-textarea").val();
		var amount = $(".transaction-add-input.amount").val();
		var type = $(".transaction-add-button.type.active").attr("id");
		if(year.length == 4) {
			if($(this).hasClass("edit")) {
				$.ajax({
					url: "./scripts/process.php",
					type: "POST",
					data: { action: "edit-transaction", id: $(this).attr("id"), from: from, to: to, category: category, currency: currency, institution: institution, day: day.slice(-2), month: month.slice(-2), year: year, title: title, details: details, amount: amount, type: type },
					success: function(data) {
						$(".popup-overlay").trigger("click");
						fetch_balance();
						if(data != "done") {
							notify("Error", data, "rgb(75,75,75)", 5000);
						}
					}
				});
			}
			else {
				$.ajax({
					url: "./scripts/process.php",
					type: "POST",
					data: { action: "add-transaction", from: from, to: to, category: category, currency: currency, institution: institution, day: day.slice(-2), month: month.slice(-2), year: year, title: title, details: details, amount: amount, type: type },
					success: function(data) {
						$(".popup-overlay").trigger("click");
						fetch_balance();
						if(data != "done") {
							notify("Error", data, "rgb(75,75,75)", 5000);
						}
					}
				});
			}	
		}
		else {
			notify("Error", "You must enter the full year (four characters).", "rgb(75,75,75)", 5000);
		}
	});
	$(".transactions-list").delegate(".other-icon", "click", function() {
		hide_all();
		var id = $(this).parent().parent().attr("id");
		$(".transactions-list .other-icon").removeClass("active");
		$(this).addClass("active");
		var x_offset = $(this).offset().left;
		var y_offset = $(this).offset().top;
		setTimeout(function() {
			$(".transactions-menu").show().css({"left":x_offset + 10 + "px", "top":y_offset - 45 + "px"}).attr({"id":id});
			if(x_offset + $(".transactions-menu").width() > $(window).width()) {
				$(".transactions-menu").css("left", x_offset - $(".transactions-menu").width() + 15);
			}
			if(y_offset + $(".transactions-menu").height() + 40 > $(window).height()) {
				$(".transactions-menu").css("top", y_offset - $(".transactions-menu").height() - 50);
			}
		}, 50);
	});
	$(".transactions-menu-item").on("click", function() {
		var id = $(this).parent().attr("id");
		if($(this).hasClass("edit")) {
			$(".transaction-add-confirm").removeClass("add").addClass("edit").attr("id", id);
			$(".popup-overlay, .transaction-add-wrapper").show();
			$(".transaction-add-button").removeClass("active");
			$(".transaction-add-input.from").val($(".transaction-item#" + id + " .details-wrapper .from").html());
			$(".transaction-add-input.to").val($(".transaction-item#" + id + " .details-wrapper .to").html());
			$(".transaction-add-button." + $(".transaction-item#" + id + " .details-wrapper .category").html()).addClass("active");
			if($(".transaction-add-button.category.bank").hasClass("active")) {
				$(".transaction-add-wrapper .banks").show();
				$(".transaction-add-wrapper").removeAttr("style").show();
			}
			else {
				$(".transaction-add-wrapper .banks").hide();
			}
			$(".transaction-add-button." + $(".transaction-item#" + id + " .details-wrapper .currency").html()).addClass("active");
			$(".transaction-add-button." + $(".transaction-item#" + id + " .details-wrapper .institution").html()).addClass("active");
			$(".transaction-add-input.title").val($(".transaction-item#" + id + " .details-wrapper .title").html());
			$(".transaction-add-textarea").val($(".transaction-item#" + id + " .details-wrapper .details").val());
			$(".transaction-add-input.amount").val($(".transaction-item#" + id + " .details-wrapper .amount").html());
			$(".transaction-add-button." + $(".transaction-item#" + id + " .details-wrapper .type").html()).addClass("active");
			var date = $(".transaction-item#" + id + " .transaction-field.date").html().split(" / ");
			var day = date[0];
			var month = date[1];
			var year = date[2];
			$(".transaction-add-input.day").val(day);
			$(".transaction-add-input.month").val(month);
			$(".transaction-add-input.year").val(year);
		}
		else if($(this).hasClass("delete")) {
			open_popup('<button class="popup-label">Are you sure?</button><button class="popup-confirm" id="' + id + '" data-action="delete-transaction">Delete</button>');
		}
	});
	
	// Shopping Page Functionality
	
	$(".shopping .category-item").on("click", function() {
		var category = $(this).attr("data-category");
		$(".shopping .category-item").removeClass("active");
		$(this).addClass("active");
		$(".shopping-list").removeClass("active").hide();
		$(".shopping-list." + category).show().addClass("active");
	});
	$(".shopping-search").on("keyup", function() {
		var search = $(this).val().toLowerCase();
		if(search.trim().length != 0) {
			$(".shopping-item").filter(function() {
				$(this).toggle($(this).text().toLowerCase().indexOf(search) > -1);
			});
			$(".shopping-list-title").show();
			$(".shopping-item").css("background", "none");
			$(".shopping-list").show().css("height", "auto");
		}
		else {
			$(".shopping-item").show().removeAttr("style");
			$(".shopping-list").hide().removeAttr("style");
			$(".shopping-list-title").hide();
			$(".category-item.active").trigger("click");
		}
	});
	$(".shopping-toolbar .add-icon").on("click", function() {
		$(".shopping-add-wrapper, .popup-overlay").show();
		$(".shopping-add-input").val("");
		$(".shopping-add-button").removeClass("active");
		$(".shopping-add-button.other").addClass("active");
		$(".shopping-add-confirm").removeClass("edit").addClass("add");
	});
	$(".shopping-add-button").on("click", function() {
		$(".shopping-add-button").removeClass("active");
		$(this).addClass("active");
	});
	$(".shopping-add-confirm").on("click", function() {
		var url = $(".shopping-add-input.url").val();
		var name = $(".shopping-add-input.name").val();
		var frequency = $(".shopping-add-input.frequency").val();
		var price = $(".shopping-add-input.price").val();
		var details = $(".shopping-add-input.details").val();
		var category = $(".shopping-add-button.active").attr("id");
		if($(this).hasClass("add")) {
			var action = "add-shopping-item";
		}
		else if($(this).hasClass("edit")) {
			var action = "edit-shopping-item";
		}
		$.ajax({
			url: "./scripts/process.php",
			type: "POST",
			data: { action: action, url: url, category: category, name: name, frequency: frequency, price: price, details: details },
			success: function(data) {
				fetch_shopping_list();
				$(".popup-top .close-icon").trigger("click");
				if(data != "done") {
					notify("Error", data, "rgb(75,75,75)", 5000);
				}
			}
		});
	});
	$(".shopping-list").delegate(".shopping-item", "click", function(e) {
		var url = $(this).attr("id");
		$(".shopping-item").removeClass("active");
		$(".shopping-menu a").attr("href", url);
		var item = $(this);
		var category = $(this).parent().parent().attr("data-category");
		var name = $(this).find(".name").html();
		var frequency = $(this).find(".frequency").html();
		var price = $(this).find(".price").html().replace("£", "");
		var details = $(this).find(".details").html();
		hide_all();
		var x_offset = e.pageX;
		var y_offset = e.pageY;
		setTimeout(function() {
			item.addClass("active");
			$(".shopping-menu").show().css({"left":x_offset - 5 + "px", "top":y_offset - 60 + "px"}).attr({"id":url, "data-category":category, "data-name":name, "data-frequency":frequency, "data-price":price, "data-details":details});
			if(x_offset + $(".shopping-menu").width() + 40 > $(window).width()) {
				$(".shopping-menu").css("left", x_offset - $(".shopping-menu").width());
			}
			if(y_offset + $(".shopping-menu").height() + 40 > $(window).height()) {
				$(".shopping-menu").css("top", y_offset - $(".shopping-menu").height() - 60);
			}
		}, 50);
	});
	$(".shopping-menu-item.delete").on("click", function() {
		var id = $(this).parent().attr("id");
		var category = $(this).parent().attr("data-category");
		open_popup('<button class="popup-label">Are you sure?</button><button class="popup-confirm" id="' + id + '" data-action="delete-shopping-item">Delete</button>');
	});
	$(".shopping-menu-item.edit").on("click", function() {
		$(".shopping-add-wrapper, .popup-overlay").show();
		$(".shopping-add-input").val("");
		$(".shopping-add-button").removeClass("active");
		$(".shopping-add-confirm").removeClass("add").addClass("edit");
		var url = $(this).parent().attr("id");
		var category = $(this).parent().attr("data-category");
		var name = $(this).parent().attr("data-name");
		var frequency = $(this).parent().attr("data-frequency");
		var price = $(this).parent().attr("data-price");
		var details = $(this).parent().attr("data-details");
		$(".shopping-add-input.url").val(url);
		$(".shopping-add-input.name").val(name);
		$(".shopping-add-input.frequency").val(frequency);
		$(".shopping-add-input.price").val(price);
		$(".shopping-add-input.details").val(details);
		$(".shopping-add-button." + category).addClass("active");
	});
	
	// Notes Page Functionality
	
	$(".notes-toolbar .add-icon").on("click", function() {
		if($(this).parent().hasClass("lecture")) {
			$(".notes-upload-file.lecture").trigger("click");
		}
		else {
			$(".notes-upload-file.revision").trigger("click");
		}
	});
	$(".notes-cancel-button").on("click", function() {
		if($(this).parent().hasClass("lecture")) {
			var category = "lecture";
		}
		else {
			var category = "revision";
		}
		reset_input(".notes-upload-wrapper." + category + " .notes-upload-file");
		$(".notes-upload-wrapper." + category + " .notes-upload-input").val("");
		$(this).parent().hide().css({"top":"0"});
	});
	$(".notes-upload-button").on("click", function() {
		if($(this).parent().hasClass("lecture")) {
			var category = "lecture";
		}
		else {
			var category = "revision";
		}
		var title = $(".notes-upload-wrapper." + category + " .notes-upload-input").val();
		var data = new FormData();
		data.append("action", "upload-note");
		data.append("category", category);
		data.append("title", title);
		data.append("file", $(".notes-upload-wrapper." + category + " .notes-upload-file")[0].files[0]);
		$.ajax({
			url: "./scripts/process.php",
			data: data,
			type: "POST",
			contentType: false,
			processData: false,
			success: function(data) {
				if(data == "done") {
					fetch_notes(category);
					$(".notes-upload-wrapper." + category + " .notes-cancel-button").trigger("click");
				}
				else {
					notify("Error", data, "rgb(75,75,75)", 4000);
				}
			}
		});
	});
	$(".notes-upload-file").on("change", function() {
		var filename = $(this).val().split('\\').pop().split(".")[0];
		if($(this).hasClass("lecture")) {
			var category = "lecture";
		}
		else {
			var category = "revision";
		}
		$(".notes-upload-wrapper." + category).show().animate({top: "60px"}, 250);
		$(".notes-upload-wrapper."  + category + " .notes-upload-input").val(filename);
	});
	$(".notes-list").delegate(".other-icon", "click", function() {
		hide_all();
		var id = $(this).parent().attr("id");
		if($(this).parent().parent().hasClass("lecture")) {
			var category = "lecture";
		}
		else {
			var category = "revision";
		}
		$(".notes-list .other-icon").removeClass("active");
		$(this).addClass("active");
		var x_offset = $(this).offset().left;
		var y_offset = $(this).offset().top;
		setTimeout(function() {
			$(".notes-menu").show().css({"left":x_offset + 10 + "px", "top":y_offset - 40 + "px"}).attr({"id":id, "data-category":category});
			if(x_offset + $(".notes-menu").width() > $(window).width()) {
				$(".notes-menu").css("left", x_offset - $(".notes-menu").width() + 15);
			}
			if(y_offset + $(".notes-menu").height() + 40 > $(window).height()) {
				$(".notes-menu").css("top", y_offset - $(".notes-menu").height() - 50);
			}
			if($(window).width() < 750) {
				if(category == "revision") {
					$(".notes-menu").css("top", "calc(100% - 20px + " + $(".notes-menu").css("top"));
				}
			}
		}, 50);
	});
	$(".notes-menu-item").on("click", function() {
		var id = $(this).parent().attr("id");
		var category = $(this).parent().attr("data-category");
		if($(this).hasClass("download")) {
			$("body").append('<iframe class="hidden download-iframe" src="./scripts/process.php?action=download-note&file=' + id + '&category=' + category + '"></iframe>');
			setTimeout(function() {
				$(".download-iframe").remove();
			}, 500);
		}
		else if($(this).hasClass("delete")) {
			open_popup('<button class="popup-label">Are you sure?</button><button class="popup-confirm" id="' + id + '" data-action="delete-note" data-category="' + category + '">Delete</button>');
		}
		else if($(this).hasClass("rename")) {
			open_popup('<input type="text" class="popup-input" placeholder="Title..."><button class="popup-confirm" id="' + id + '" data-action="rename-note" data-category="' + category + '">Rename</button>');
		}
	});
	
	// Popup Functionality
	
	$(".popup-top .close-icon, .popup-overlay").on("click", function() {
		$(".popup-wrapper, .popup-overlay, .balance-edit-wrapper, .transaction-add-wrapper, .shopping-add-wrapper").hide();
		$(".popup-bottom").html("");
	});
	$(".popup-bottom").delegate(".popup-confirm", "click", function() {
		var id = $(this).attr("id");
		var action = $(this).attr("data-action");
		if(action == "delete-transaction") {
			$.ajax({
				url: "./scripts/process.php",
				type: "POST",
				data: { action: "delete-transaction", id: id },
				success: function(data) {
					fetch_balance();
					$(".popup-top .close-icon").trigger("click");
					if(data != "done") {
						notify("Error", "Could not delete transaction.", "rgb(75,75,75)", 5000);
					}
				}
			});
		}
		if(action == "delete-shopping-item") {
			var category = $(".shopping-menu").attr("data-category");
			$.ajax({
				url: "./scripts/process.php",
				type: "POST",
				data: { action: "delete-shopping-item", id: id, category: category },
				success: function(data) {
					fetch_shopping_list();
					$(".popup-top .close-icon").trigger("click");
					if(data != "done") {
						notify("Error", "Could not delete shopping item.", "rgb(75,75,75)", 5000);
					}
				}
			});
		}
		if(action == "delete-note") {
			var category = $(this).attr("data-category");
			$.ajax({
				url: "./scripts/process.php",
				type: "POST",
				data: { file: id, category: category, action: "delete-note" },
				success: function(data) {
					fetch_notes(category);
					$(".popup-top .close-icon").trigger("click");
					if(data != "done") {
						notify("Error", "Could not delete file.", "rgb(75,75,75)", 5000);
					}
				}
			});
		}
		else if(action == "rename-note") {
			var category = $(this).attr("data-category");
			var title = $(".popup-input").val();
			$.ajax({
				url: "./scripts/process.php",
				type: "POST",
				data: { file: id, category: category, action: "rename-note", title: title },
				success: function(data) {
					fetch_notes(category);
					$(".popup-top .close-icon").trigger("click");
					if(data != "done") {
						notify("Error", "Could not rename file.", "rgb(75,75,75)", 5000);
					}
				}
			});
		}
		else if(action == "upload-file") {
			var data = new FormData();
			data.append("action", "upload-file");
			data.append("name", $(".popup-input").val());
			data.append("file", $(".files-upload-input")[0].files[0]);
			$.ajax({
				url: "./scripts/process.php",
				data: data,
				type: "POST",
				contentType: false,
				processData: false,
				success: function(data) {
					if(data == "done") {
						fetch_files();
						$(".popup-top .close-icon").trigger("click");
					}
					else {
						notify("Error", data, "rgb(75,75,75)", 4000);
					}
				}
			});
		}
		else if(action == "delete-file") {
			$.ajax({
				url: "./scripts/process.php",
				type: "POST",
				data: { file: id, action: "delete-file" },
				success: function(data) {
					fetch_files();
					$(".popup-top .close-icon").trigger("click");
					if(data != "done") {
						notify("Error", "Could not delete file.", "rgb(75,75,75)", 5000);
					}
				}
			});
		}
		else if(action == "rename-file") {
			var name = $(".popup-input").val();
			$.ajax({
				url: "./scripts/process.php",
				type: "POST",
				data: { file: id, action: "rename-file", name: name },
				success: function(data) {
					fetch_files();
					$(".popup-top .close-icon").trigger("click");
					if(data != "done") {
						notify("Error", "Could not rename file.", "rgb(75,75,75)", 5000);
					}
				}
			});
		}
		else if(action == "reset-page") {
			$.ajax({
				url: "./scripts/process.php",
				type: "POST",
				data: { action: id },
				success: function(data) {
					location.reload();
				}
			});
		}
	});
	
	// Reminders Page Functionality
	
	$(".reminder-search").on("keyup", function() {
		var search = $(this).val().toLowerCase();
		if(search.trim().length != 0) {
			$(".reminder-item").filter(function() {
				$(this).toggle($(this).text().toLowerCase().indexOf(search) > -1);
			});
		}
		else {
			$(".reminder-item").show().removeAttr("style");
		}
	});
	$(".reminder-text.input").keydown(function(e) {
		if(e.which == 13) {
			e.preventDefault();
			var reminder = $(this).text();
			add_reminder(reminder);
		}
	});
	$(".reminder-item .add-icon").on("click", function() {
		var reminder = $(".reminder-text.input").text();
		add_reminder(reminder);
	});
	$(".reminder-list").delegate(".reminder-status", "click", function() {
		toggle_reminder($(this).parent().attr("id"));
	});
	$(".reminder-list").delegate(".reminder-item .trash-icon", "click", function() {
		$.ajax({
			url: "./scripts/process.php",
			type: "POST",
			data: { action: "delete-reminder", id: $(this).parent().attr("id") },
			success: function(data) {
				if(data == "done") {
					fetch_reminders();
				}
				else {
					notify("Error", "Could not delete reminder.", "rgb(75,75,75)", 5000);
				}
			}
		});
	});
	
	// Files Page Functionality
	
	$(".files-search").on("keyup", function() {
		var search = $(this).val().toLowerCase();
		if(search.trim().length != 0) {
			$(".file-tile").filter(function() {
				$(this).toggle($(this).text().toLowerCase().indexOf(search) > -1);
			});
		}
		else {
			$(".file-tile").show().removeAttr("style");
		}
	});
	$(".files-toolbar .upload-icon").on("click", function() {
		$(".files-upload-input").trigger("click");
	});
	$(".files-upload-input").on("change", function() {
		var filename = $(this).val().split('\\').pop().split(".")[0];
		open_popup('<input type="text" class="popup-input" placeholder="Filename..." value="' + filename + '"><button class="popup-confirm" data-action="upload-file">Upload</button>');
	});
	$(".files-list").delegate(".file-tile", "click", function() {
		if(!$(this).hasClass("active")) {
			hide_all();
			var id = $(this).attr("id");
			$(".file-tile").removeClass("active");
			$(this).addClass("active");
			var x_offset = $(this).offset().left;
			var y_offset = $(this).offset().top;
			setTimeout(function() {
				$(".files-menu").show().css({"left":x_offset + 100 + "px", "top":y_offset + 50 + "px"}).attr("id", id);
				if(x_offset + 100 + $(".files-menu").width() > $(window).width()) {
					$(".files-menu").css("left", x_offset - $(".files-menu").width() + 15);
				}
				if(y_offset + $(".files-menu").height() + 40 > $(window).height()) {
					$(".files-menu").css("top", y_offset - $(".files-menu").height() - 50);
				}
			}, 50);
		}
		else {
			hide_all();
		}
	});
	$(".files-list").on("scroll", hide_all);
	$(".files-menu-item").on("click", function() {
		var id = $(this).parent().attr("id");
		if($(this).hasClass("download")) {
			$("body").append('<iframe class="hidden download-iframe" src="./scripts/process.php?action=download-file&file=' + id + '"></iframe>');
			setTimeout(function() {
				$(".download-iframe").remove();
			}, 500);
		}
		else if($(this).hasClass("delete")) {
			open_popup('<button class="popup-label">Are you sure?</button><button class="popup-confirm" id="' + id + '" data-action="delete-file">Delete</button>');
		}
		else if($(this).hasClass("rename")) {
			open_popup('<input type="text" class="popup-input" placeholder="Filename..."><button class="popup-confirm" id="' + id + '" data-action="rename-file">Rename</button>');
		}
	});
	
	// Account Page Functionality
	
	$(".account-button.logout").on("click", function() {
		$.ajax({
			url: "./scripts/process.php",
			type: "POST",
			data: { action: "logout" },
			success: function() {
				location.reload();
			}
		});
	});
	$(".confirm-username").on("click", function() {
		$.ajax({
			url: "./scripts/process.php",
			type: "POST",
			data: { action: "change-username", username: $(".account-input.username").val(), password: $(".account-input.password").val() },
			success: function(data) {
				if(data == "done") {
					location.reload();
				}
				else {
					notify("Error", data, "rgb(75,75,75)", 5000);
				}
			}
		});
	});
	$(".confirm-password").on("click", function() {
		$.ajax({
			url: "./scripts/process.php",
			type: "POST",
			data: { action: "change-password", current_password: $(".account-input.current-password").val(), new_password: $(".account-input.new-password").val(), repeat_password: $(".account-input.repeat-password").val() },
			success: function(data) {
				if(data == "done") {
					location.reload();
				}
				else {
					notify("Error", data, "rgb(75,75,75)", 5000);
				}
			}
		});
	});
	
	// Settings Page Functionality
	
	$(".settings-choice").on("click", function() {
		var choice = $(this).attr("data-choice");
		if($(this).hasClass("theme")) {
			var category = "appearance";
			var option = "theme";
		}
		$.ajax({
			url: "./scripts/process.php",
			type: "POST",
			data: { action: "save-settings", category: category, option: option, choice: choice },
			success: function(data) {
				if(data == "done") {
					location.reload();
				}
				else {
					notify("Error", "Could not save settings.", "rgb(75,75,75)", 5000);
				}
			}
		});
	});
	$(".settings-button").on("click", function() {
		var action = $(this).attr("data-action");
		open_popup('<button class="popup-label">Are you sure?</button><button class="popup-confirm" id="' + action + '" data-action="reset-page">Delete</button>');
	});
	
	// QoL Improvements, allowing the user to press "Enter" to submit forms.
	
	$(window).keydown(function(e) {
		if(e.which == 13) {
			if($(".popup-wrapper").is(":visible")) {
				$(".popup-confirm").trigger("click");
			}
			if($(".transaction-add-wrapper").is(":visible")) {
				$(".transaction-add-confirm").trigger("click");
			}
			if($(".balance-edit-wrapper").is(":visible")) {
				$(".balance-edit-confirm").trigger("click");
			}
			if($(".notes-upload-wrapper.lecture").is(":visible")) {
				$(".notes-upload-button.lecture").trigger("click");
			}
			if($(".notes-upload-wrapper.revision").is(":visible")) {
				$(".notes-upload-button.revision").trigger("click");
			}
		}
	});
	
	// Page Functions
	
	function show_page(page) {
		$(".page").hide().removeClass("active");
		$(".page." + page).show().addClass("active");
		$(".navbar-title").html(ucfirst(page));
		$(".navbar .back-icon").show().attr("id", page);
		if(page == "home") {
			$(".navbar .back-icon").hide();
		}
		else if(page == "finances") {
			fetch_balance();
		}
		else if(page == "shopping") {
			$(".shopping .category-item.essentials").trigger("click");
			fetch_shopping_list();
		}
		else if(page == "notes") {
			fetch_notes("lecture");
			fetch_notes("revision");
		}
		else if(page == "reminders") {
			fetch_reminders();
		}
		else if(page == "files") {
			fetch_files();
		}
		else if(page == "settings") {
			fetch_settings();
		}
	}
	
	// Finances Page Functions
	
	function fetch_transactions() {
		$.ajax({
			url: "./scripts/process.php",
			type: "POST",
			data: { action: "fetch-transactions" },
			success: function(data) {
				var transactions = JSON.parse(data);
				if(transactions.length != 0) {
					$(".transactions-list-head-wrapper").show();
				}
				else {
					$(".transactions-list-head-wrapper").hide();
				}
				$(".transactions-list").html("");
				$.each(transactions, function(key, value) {
					var balance = parseInt($(".balance-amount.total span").html().replace(",", ""));
					var from = transactions[key]['from'];
					var to = transactions[key]['to'];
					var category = transactions[key]['category'];
					var currency = transactions[key]['currency'];
					if(currency == "gbp") {
						var currency_symbol = "£";
					}
					else if(currency == "usd") {
						var currency_symbol = "$";
					}
					else {
						var currency_symbol = "";
					}
					var institution = transactions[key]['institution'];
					var date = transactions[key]['date'].split(" / ");
					var day = date[2];
					var month = date[1];
					var year = date[0];
					var title = transactions[key]['title'];
					var details = transactions[key]['details'];
					var amount = parseFloat(transactions[key]['amount']);
					var type = transactions[key]['type'];
					
					if(type == "earned") {
						var type_symbol = "+";
					}
					else {
						var type_symbol = "-";
					}
					
					$(".transactions-list").append('<div class="transaction-item" id="' + key + '"><button class="transaction-field type ' + type + '"><span>' + type_symbol + '</span></button><button class="transaction-field amount">' + currency_symbol + separate_thousands(amount) + '</button><button class="transaction-field date">' + day + " / " + month + " / " + year + '</button><button class="transaction-field title">' + title + '</button><button class="transaction-field more">' + other_icon + '</button><div class="details-wrapper"><span class="from">' + from + '</span><span class="to">' + to + '</span><span class="category">' + category + '</span><span class="currency">' + currency + '</span><span class="institution">' + institution + '</span><span class="date">' + year + " / " + month + " / " + day + '</span><span class="title">' + title + '</span><textarea class="details">' + details + '</textarea><span class="amount">' + amount + '</span><span class="type">' + type + '</span></div></div>');
					if(type == "spent") {
						if(currency == "gbp") {
							var total = balance - amount;
							$(".balance-amount.total span").html(separate_thousands(Math.floor(total)));
							if(category == "bank") {
								var bank_balance = parseInt($(".balance-amount." + institution + " span").html().replace(",", ""));
								var bank_total = bank_balance - amount;
								$(".balance-amount." + institution + " span").html(separate_thousands(bank_total));
							}
							else if(category == "cash") {
								var cash_balance = parseInt($(".balance-amount.cash span").html().replace(",", ""));
								var cash_total = cash_balance - amount;
								$(".balance-amount.cash span").html(separate_thousands(cash_total));
							}
						}
						else if(currency == "usd") {
							$.getJSON("https://api.exchangerate-api.com/v4/latest/GBP", function(gbp_data) {
								var gbp_price = parseFloat(gbp_data['rates']['USD']);
								var gbp = amount / gbp_price;
								var total = balance - gbp;
								$(".balance-amount.total span").html(separate_thousands(Math.floor(total)));
								if(category == "bank") {
									var bank_balance = parseInt($(".balance-amount." + institution + " span").html().replace(",", ""));
									var bank_total = bank_balance - (amount / gbp_price);
									$(".balance-amount." + institution + " span").html(separate_thousands(bank_total));
								}
								else if(category == "cash") {
									var cash_balance = parseInt($(".balance-amount.cash span").html().replace(",", ""));
									var cash_total = cash_balance - (amount / gbp_price);
									$(".balance-amount.cash span").html(separate_thousands(Math.floor(cash_total)));
								}
							});
						}
					}
					else if(type == "earned") {
						if(currency == "gbp") {
							var total = balance + amount;
							$(".balance-amount.total span").html(separate_thousands(Math.floor(total)));
							if(category == "bank") {
								var bank_balance = parseInt($(".balance-amount." + institution + " span").html().replace(",", ""));
								var bank_total = bank_balance + amount;
								$(".balance-amount." + institution + " span").html(separate_thousands(bank_total));
							}
							else if(category == "cash") {
								var cash_balance = parseInt($(".balance-amount.cash span").html().replace(",", ""));
								var cash_total = cash_balance + amount;
								$(".balance-amount.cash span").html(separate_thousands(cash_total));
							}
						}
						else if(currency == "usd") {
							$.getJSON("https://api.exchangerate-api.com/v4/latest/GBP", function(gbp_data) {
								var gbp_price = parseFloat(gbp_data['rates']['USD']);
								var gbp = amount / gbp_price;
								var total = balance + gbp;
								$(".balance-amount.total span").html(separate_thousands(Math.floor(total)));
								if(category == "bank") {
									var bank_balance = parseInt($(".balance-amount." + institution + " span").html().replace(",", ""));
									var bank_total = bank_balance + (amount / gbp_price);
									$(".balance-amount." + institution + " span").html(separate_thousands(bank_total));
								}
								else if(category == "cash") {
									var cash_balance = parseInt($(".balance-amount.cash span").html().replace(",", ""));
									var cash_total = cash_balance + (amount / gbp_price);
									$(".balance-amount.cash span").html(separate_thousands(Math.floor(cash_total)));
								}
							});
						}
					}
					var total = parseInt($(".balance-amount.hsbc span").html().replace(",", "")) + parseInt($(".balance-amount.barclays span").html().replace(",", ""));
					$(".balance-amount.gbp span").html(separate_thousands(total));
				});
				$(".transaction-item").sort(function(a, b) {
					var date1  = $(a).find(".details-wrapper .date").text();
					var date1 = date1.split(" / ");
					var date1 = new Date(date1[2], date1[1] -1, date1[0]);
					
					var date2  = $(b).find(".details-wrapper .date").text();
					var date2 = date2.split(" / ");
					var date2 = new Date(date2[2], date2[1] -1, date2[0]);
					
					if(date1 < date2) {
						return 1;
					}
					else {
						return -1;
					}
				}).appendTo(".transactions-list");
			}
		});
	}
	function fetch_balance() {
		$.ajax({
			url: "./scripts/process.php",
			type: "POST",
			data: { action: "fetch-balance" },
			success: function(data) {
				var balance = JSON.parse(data);
				var eth = parseFloat(balance['cryptocurrency']['eth']);
				var bch = parseFloat(balance['cryptocurrency']['bch']);
				var etn = parseFloat(balance['cryptocurrency']['etn']);
				$.getJSON("https://api.cryptonator.com/api/ticker/eth-usd", function(eth_data) {
					$.getJSON("https://api.cryptonator.com/api/ticker/bch-usd", function(bch_data) {
						$.getJSON("https://api.cryptonator.com/api/ticker/etn-usd", function(etn_data) {
							$.getJSON("https://api.exchangerate-api.com/v4/latest/GBP", function(gbp_data) {
								var eth_price = parseFloat(eth_data['ticker']['price']);
								var bch_price = parseFloat(bch_data['ticker']['price']);
								var etn_price = parseFloat(etn_data['ticker']['price']);
								var gbp_price = parseFloat(gbp_data['rates']['USD']);
								
								var usd = parseInt(eth * eth_price + bch * bch_price + etn * etn_price);
								var gbp = parseInt(usd / gbp_price);
								var hsbc = parseInt(balance['bank']['hsbc']);
								var barclays = parseInt(balance['bank']['barclays']);
								var bank_gbp = parseInt(hsbc + barclays);
								var cash = parseInt(balance['cash']);
								var total = parseInt(gbp + hsbc + barclays + cash);
								
								$(".balance-edit-input.eth").val(eth);
								$(".balance-edit-input.bch").val(bch);
								$(".balance-edit-input.etn").val(etn);
								$(".balance-edit-input.hsbc").val(hsbc);
								$(".balance-edit-input.barclays").val(barclays);
								$(".balance-edit-input.cash").val(cash);
								
								$(".balance-amount.eth span").html(eth.toFixed(3));
								$(".balance-amount.bch span").html(bch.toFixed(3));
								$(".balance-amount.etn span").html(separate_thousands(etn));
								$(".balance-amount.usd span").html(separate_thousands(Math.floor(usd)));
								$(".balance-amount.hsbc span").html(separate_thousands(hsbc));
								$(".balance-amount.barclays span").html(separate_thousands(barclays));
								$(".balance-amount.gbp span").html(separate_thousands(bank_gbp));
								$(".balance-amount.cash span").html(separate_thousands(Math.floor(cash)));
								$(".balance-amount.total span").html(separate_thousands(Math.floor(total)));
								
								fetch_transactions();
							});
						});
					});
				});
			}
		});
	}
	
	// Shopping Page Functions
	
	function fetch_shopping_list() {
		$.ajax({
			url: "./scripts/process.php",
			type: "POST",
			data: { action: "fetch-shopping-list" },
			success: function(data) {
				var list = JSON.parse(data);
				var food = list['food'];
				var drinks = list['drinks'];
				var essentials = list['essentials'];
				var other = list['other'];
				$(".shopping-list .list").html("");
				$.each(food, function(key, value) {
					$(".shopping-list.food .list").append('<div class="shopping-item" id="' + key + '"><button class="name">' + value['name'] + '</button><button class="frequency">' + value['frequency'] + '</button><button class="price">£' + value['price'] + '</button><button class="details">' + value['details'] + '</button></div>');
				});
				$.each(drinks, function(key, value) {
					$(".shopping-list.drinks .list").append('<div class="shopping-item" id="' + key + '"><button class="name">' + value['name'] + '</button><button class="frequency">' + value['frequency'] + '</button><button class="price">£' + value['price'] + '</button><button class="details">' + value['details'] + '</button></div>');
				});
				$.each(essentials, function(key, value) {
					$(".shopping-list.essentials .list").append('<div class="shopping-item" id="' + key + '"><button class="name">' + value['name'] + '</button><button class="frequency">' + value['frequency'] + '</button><button class="price">£' + value['price'] + '</button><button class="details">' + value['details'] + '</button></div>');
				});
				$.each(other, function(key, value) {
					$(".shopping-list.other .list").append('<div class="shopping-item" id="' + key + '"><button class="name">' + value['name'] + '</button><button class="frequency">' + value['frequency'] + '</button><button class="price">£' + value['price'] + '</button><button class="details">' + value['details'] + '</button></div>');
				});
				var categories = ["food", "drinks", "essentials", "other"];
				$.each(categories, function(key, value) {
					$(".shopping-list." + value + " .list .shopping-item").sort(function(a, b) {
						if(a.textContent < b.textContent) {
							return -1;
						} 
						else {
							return 1;
						}
					}).appendTo(".shopping-list." + value + " .list");
				});
				
			}
		});
	}
	
	// Files Page Functions
	
	function fetch_files() {
		$.ajax({
			url: "./scripts/process.php",
			type: "POST",
			data: { action: "fetch-files" },
			success: function(data) {
				var files = JSON.parse(data);
				$(".files-list").html("");
				$(".files-search").val("");
				$.each(files, function(key) {
					$(".files-list").append('<div class="file-tile" id="' + files[key] + '">' + file_icon + '<button class="file-title">' + files[key] + '</button></div>');
				});
			}
		});
	}
	
	// Reminders Page Functions
	
	function toggle_reminder(id) {
		$.ajax({
			url: "./scripts/process.php",
			type: "POST",
			data: { action: "toggle-reminder", id: id },
			success: function(data) {
				if(data == "done") {
					fetch_reminders();
				}
				else {
					notify("Error", "Could not update reminder status.", "rgb(75,75,75)", 5000);
				}
			}
		});
	}
	function add_reminder(reminder) {
		if(reminder.trim().length == 0) {
			notify("Error", "Cannot add an empty reminder.", "rgb(75,75,75)", 5000);
			$(".reminder-text.input").html("");
		}
		else {
			$.ajax({
				url: "./scripts/process.php",
				type: "POST",
				data: { action: "add-reminder", reminder: reminder },
				success: function(data) {
					if(data == "done") {
						$(".reminder-text.input").html("");
						fetch_reminders();
					}
					else {
						notify("Error", "Could not add reminder.", "rgb(75,75,75)", 5000);
					}
				}
			});
		}
	}
	function fetch_reminders() {
		$.ajax({
			url: "./scripts/process.php",
			type: "POST",
			data: { action: "fetch-reminders" },
			success: function(data) {
				var reminders = JSON.parse(data);
				$(".reminder-list").html("");
				$(".reminder-search").val("");
				$.each(reminders, function(key, value) {
					$(".reminder-list").append('<div class="reminder-item" id="' + key + '"><div class="reminder-status ' + reminders[key]['status'] + '"></div><span class="reminder-text ' + reminders[key]['status'] + '">' + reminders[key]['reminder'] + '</span>' + trash_icon + '</div>');
				});
			}
		});
	}
	
	// Notes Page Functions
	
	function fetch_notes(category) {
		$.ajax({
			url: "./scripts/process.php",
			type: "POST", 
			data: { action: "fetch-notes", category: category },
			success: function(data) {
				var notes = JSON.parse(data);
				$(".notes-list." + category).html("");
				$.each(notes, function(key) {
					$(".notes-list." + category).append('<div class="note-list-item" id="' + notes[key] + '"><button class="title">' + notes[key] + '</button>' + other_icon + '</div>');
				});
			}
		})
	}
	
	// Settings Page Functions
	
	function fetch_settings() {
		$.ajax({
			url: "./scripts/process.php",
			type: "POST",
			data: { action: "fetch-settings" },
			success: function(data) {
				var settings = JSON.parse(data);
				var theme = settings['appearance']['theme'];
				$(".settings-choice").removeClass("active");
				$(".settings-choice." + theme).addClass("active");
			}
		});
	}
	
	// Popups & Menu Functions
	
	function open_popup(html) {
		$(".popup-overlay, .popup-wrapper").show();
		$(".popup-bottom").html(html);
	}
	function hide_all() {
		if($(".menu-wrapper").is(":visible")) {
			show_menu(false);
		}
		if($(".transactions-menu").is(":visible")) {
			$(".transactions-menu").hide();
			$(".transactions-list .other-icon").removeClass("active");
		}
		if($(".shopping-menu").is(":visible")) {
			$(".shopping-menu").hide();
			$(".shopping-item").removeClass("active");
		}
		if($(".filter-menu").is(":visible")) {
			$(".filter-menu").hide();
			$(".transactions-toolbar .filter-icon").removeClass("active");
		}
		if($(".notes-menu").is(":visible")) {
			$(".notes-menu").hide();
			$(".notes-list .other-icon").removeClass("active");
		}
		if($(".files-menu").is(":visible")) {
			$(".files-menu").hide();
			$(".file-tile").removeClass("active");
		}
	}
	function show_menu(show) {
		if(show) {
			$(".navbar .menu-icon").addClass("active");
			$(".menu-wrapper").show().css("width", "200px");
		}
		else {
			$(".navbar .menu-icon").removeClass("active");
			$(".menu-wrapper").css("width", "0");
			setTimeout(function() {
				$(".menu-wrapper").hide();
			}, 400);
		}
	}
	
	// Other Functions
	
	function separate_thousands(number) {
		return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	}
	function reset_input(element) {
		$(element).wrap('<form>').closest('form').get(0).reset();
		$(element).unwrap();
	}
	function remove_duplicates(array) {
		return array.reduce(function(a,b){if(a.indexOf(b)<0)a.push(b);return a;},[]);
	} 
	function ucfirst(string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	}
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