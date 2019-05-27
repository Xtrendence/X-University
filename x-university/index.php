<?php
	include "./scripts/detect_device.php";
	if($user_agent_mobile) {
		$device = "mobile";
	}
	else {
		$device = "desktop";
	}
	
	session_start();
	
	$account = json_decode(file_get_contents("./source/cfg/account.config"), true);
	$valid_username = $account['username'];
	$valid_password = $account['password'];
	if(!empty($account['time']) && time() - $account['time'] > 2592000) {
		$account['token'] = str_shuffle(hash("sha512", str_shuffle(time())));
		$account['time'] = "";
		file_put_contents("../source/cfg/account.config", json_encode($account));
		setcookie("x-university-token", null, -1, "/");
	}
	if($_SESSION['LoggedIn'] or isset($_COOKIE['x-university-token']) && $_COOKIE['x-university-token'] == $account['token'] && !empty($account['time'])) {
		$logged_in = true;
	}
	
	$settings = json_decode(file_get_contents("./source/cfg/settings.config"), true);
	$theme = $settings['appearance']['theme'];
	if($theme == "light") {
		$theme_color = "#efefef";
	}
	elseif($theme == "dark") {
		$theme_color = "#323232";
	}
	
	if($logged_in) {
		include "./assets/icons.php";
		include "./assets/ui_elements.php";
?>
<!-- Copyright <?php echo date('Y'); ?> © Xtrendence -->
<!DOCTYPE html>
<html>
	<head>
		<link rel="stylesheet" href="./source/css/<?php echo $theme; ?>.css?<?php echo time(); ?>">
		<link rel="stylesheet" href="./source/css/resize.css?<?php echo time(); ?>">
		<script src="./source/js/jquery.js"></script>
		<script src="./source/js/main.js?<?php echo time(); ?>"></script>
		<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
		<meta name="theme-color" content="<?php echo $theme_color; ?>">
		<title>X:/University</title>
	</head>
	
	<body id="<?php echo $device; ?>">
		<div class="navbar">
			<?php echo $back_icon; ?>
			<button class="navbar-title">Home</button>
			<?php echo $menu_icon; ?>
		</div>
		<div class="page home" data-page="home">
			<div class="tiles-wrapper">
				<div class="tile" id="finances">
					<div class="tile-icon-wrapper">
						<?php echo $money_icon; ?>
					</div>
					<button class="tile-title">Finances</button>
				</div>
				<div class="tile" id="shopping">
					<div class="tile-icon-wrapper">
						<?php echo $basket_icon; ?>
					</div>
					<button class="tile-title">Shopping</button>
				</div>
				<div class="tile" id="documents">
					<div class="tile-icon-wrapper">
						<?php echo $archive_icon; ?>
					</div>
					<button class="tile-title">Documents</button>
				</div>
				<div class="tile" id="settings">
					<div class="tile-icon-wrapper">
						<?php echo $settings_icon; ?>
					</div>
					<button class="tile-title">Settings</button>
				</div>
				<div class="tile" id="account">
					<div class="tile-icon-wrapper">
						<?php echo $user_icon; ?>
					</div>
					<button class="tile-title">Account</button>
				</div>
			</div>
		</div>
		<div class="popup-wrapper">
			<div class="popup-top">
				<?php echo $close_icon; ?>
			</div>
			<div class="popup-bottom"></div>
		</div>
		<div class="popup-overlay"></div>
		<div class="menu-wrapper">
			<a href="https://www.instagram.com/Xtrendence" target="_blank"><button class="menu-item">Instagram</button></a>
		</div>
		<div class="notification-area"></div>
		<?php include "./assets/pages.php"; ?>
		<noscript>
			<div class="noscript-wrapper">
				<div class="noscript-container">
					<span>You need to have JavaScript enabled to use this website.</span>
					<a href="./"><button>Refresh</button></a>
				</div>
			</div>
		</noscript>
	</body>
</html>
<?php } else { include "./assets/login.php"; } ?>