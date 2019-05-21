<!-- Copyright <?php echo date('Y'); ?> © Xtrendence -->
<!DOCTYPE html>
<html>
	<head>
		<link rel="stylesheet" href="./source/css/<?php echo $theme; ?>.css?<?php echo time(); ?>">
		<link rel="stylesheet" href="./source/css/resize.css?<?php echo time(); ?>">
		<script src="./source/js/jquery.js"></script>
		<script src="./source/js/login.js?<?php echo time(); ?>"></script>
		<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
		<meta name="theme-color" content="<?php echo $theme_color; ?>">
		<title>X:/University</title>
	</head>
	
	<body id="<?php echo $device; ?>">
		<div class="navbar">
			<button class="navbar-title">Login</button>
		</div>
		<div class="page login" data-page="login">
			<div class="login-wrapper">
				<input type="text" class="login-input username" placeholder="Username...">
				<input type="password" class="login-input password" placeholder="Password...">
				<button class="remember-button">Remember Me</button>
				<button class="login-button">Login</button>
			</div>
		</div>
		<div class="notification-area"></div>
	</body>
</html>