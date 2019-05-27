<?php
	session_start();
	// Fetch account credentials from the "account.config" file and convert them from a JSON string into an array.
	$account = json_decode(file_get_contents("../source/cfg/account.config"), true);
	$valid_username = $account['username'];
	$valid_password = $account['password'];
	// If the "remember me" token has a timestamp associated with it and that timestamp indicates a point in time more than a month ago, then the token is changed, and the time is set to nothing. The user's cookie is also deleted. This is for security purposes so that the token keeps changing every month.
	if(!empty($account['time']) && time() - $account['time'] > 2592000) {
		$account['token'] = str_shuffle(hash("sha512", str_shuffle(time())));
		$account['time'] = "";
		file_put_contents("../source/cfg/account.config", json_encode($account));
		setcookie("x-university-token", null, -1, "/");
	}
	// If the user is logged in normally or their "remember" cookie has the same value as the saved token in the "account.config" along with a timestamp, then the user is seen as being logged in.
	if($_SESSION['LoggedIn'] or isset($_COOKIE['x-university-token']) && $_COOKIE['x-university-token'] == $account['token'] && !empty($account['time'])) {
		$logged_in = true;
	}
	
	$queries = array();
	parse_str($_SERVER['QUERY_STRING'], $queries);
	
	if(empty($queries['action'])) {
		$action = $_POST['action'];
	}
	else {
		$action = $queries['action'];
	}
	
	if($logged_in) {
		
		// Finances Page Functions
		
		if($action == "fetch-balance") {
			echo file_get_contents("../source/cfg/balance.config");
		}
		if($action == "update-balance") {
			$balance = json_decode(file_get_contents("../source/cfg/balance.config"), true);
			$eth = trim($_POST['eth']);
			$bch = trim($_POST['bch']);
			$etn = trim($_POST['etn']);
			$hsbc = trim($_POST['hsbc']);
			$barclays = trim($_POST['barclays']);
			$cash = trim($_POST['cash']);
			if(empty($eth)) {
				$eth = 0;
			}
			if(empty($bch)) {
				$bch = 0;
			}
			if(empty($etn)) {
				$etn = 0;
			}
			if(empty($hsbc)) {
				$hsbc = 0;
			}
			if(empty($barclays)) {
				$barclays = 0;
			}
			if(empty($cash)) {
				$cash = 0;
			}
			$balance['cryptocurrency']['eth'] = $eth;
			$balance['cryptocurrency']['bch'] = $bch;
			$balance['cryptocurrency']['etn'] = $etn;
			$balance['bank']['hsbc'] = $hsbc;
			$balance['bank']['barclays'] = $barclays;
			$balance['cash'] = $cash;
			$update = file_put_contents("../source/cfg/balance.config", json_encode($balance));
			if($update) {
				echo "done";
			}
		}
		if($action == "fetch-transactions") {
			echo file_get_contents("../source/cfg/transactions.config");
		}
		if($action == "add-transaction") {
			$transactions = json_decode(file_get_contents("../source/cfg/transactions.config"), true);
			$from = trim($_POST['from']);
			$to = trim($_POST['to']);
			$category = trim(strtolower($_POST['category']));
			$currency = trim(strtolower($_POST['currency']));
			$institution = trim(strtolower($_POST['institution']));
			if($category != "bank") {
				$institution = "";
			}
			$day = trim($_POST['day']);
			$month = trim($_POST['month']);
			$year = trim($_POST['year']);
			$date = $year . " / " . $month . " / " . $day;
			$time = strtotime($day . "-" . $month . "-" . $year);
			$title = trim($_POST['title']);
			$details = trim($_POST['details']);
			$amount = trim($_POST['amount']);
			$type = trim($_POST['type']);
			if(is_numeric($amount)) {
				if(!empty($category) && !empty($currency) && !empty($day) && !empty($month) && !empty($amount) && !empty($type)) {
					$id = time() . "-" . random_int(100000, 999999);
					$transactions[$id] = array("from" => $from, "to" => $to, "category" => $category, "currency" => $currency, "institution" => $institution, "date" => $date, "time" => $time, "title" => $title, "details" => $details, "amount" => $amount, "type" => $type);
					$save = file_put_contents("../source/cfg/transactions.config", json_encode($transactions));
					if($save) {
						echo "done";
					}
				}
				else {
					echo "You must fill out the required fields.";
				}
			}
			else {
				echo "The amount should only contain numbers.";
			}
		}
		if($action == "edit-transaction") {
			$transactions = json_decode(file_get_contents("../source/cfg/transactions.config"), true);
			$id = $_POST['id'];
			$from = trim($_POST['from']);
			$to = trim($_POST['to']);
			$category = trim(strtolower($_POST['category']));
			$currency = trim(strtolower($_POST['currency']));
			$institution = trim(strtolower($_POST['institution']));
			if($category != "bank") {
				$institution = "";
			}
			$day = trim($_POST['day']);
			$month = trim($_POST['month']);
			$year = trim($_POST['year']);
			$date = $year . " / " . $month . " / " . $day;
			$time = strtotime($day . "-" . $month . "-" . $year);
			$title = trim($_POST['title']);
			$details = trim($_POST['details']);
			$amount = trim($_POST['amount']);
			$type = trim($_POST['type']);
			if(is_numeric($amount)) {
				if(!empty($category) && !empty($currency) && !empty($day) && !empty($month) && !empty($amount) && !empty($type)) {
					$transactions[$id] = array("from" => $from, "to" => $to, "category" => $category, "currency" => $currency, "institution" => $institution, "time" => $time, "date" => $date, "title" => $title, "details" => $details, "amount" => $amount, "type" => $type);
					$save = file_put_contents("../source/cfg/transactions.config", json_encode($transactions));
					if($save) {
						echo "done";
					}
				}
				else {
					echo "You must fill out the required fields.";
				}
			}
			else {
				echo "The amount should only contain numbers.";
			}
		}
		if($action == "delete-transaction") {
			$transactions = json_decode(file_get_contents("../source/cfg/transactions.config"), true);
			$id = $_POST['id'];
			unset($transactions[$id]);
			$save = file_put_contents("../source/cfg/transactions.config", json_encode($transactions));
			if($save) {
				echo "done";
			}
		}
		
		//Shopping Page Functions
		
		if($action == "fetch-shopping-list") {
			echo file_get_contents("../source/cfg/shopping.config");
		}
		if($action == "delete-shopping-item") {
			$shopping = json_decode(file_get_contents("../source/cfg/shopping.config"), true);
			$id = $_POST['id'];
			$category = $_POST['category'];
			unset($shopping[$category][$id]);
			$save = file_put_contents("../source/cfg/shopping.config", json_encode($shopping));
			if($save) {
				echo "done";
			}
		}
		if($action == "add-shopping-item") {
			$shopping = json_decode(file_get_contents("../source/cfg/shopping.config"), true);
			$url = $_POST['url'];
			$name = $_POST['name'];
			$frequency = $_POST['frequency'];
			$price = $_POST['price'];
			$details = $_POST['details'];
			if(empty(trim($details))) {
				$details = "-";
			}
			$category = $_POST['category'];
			if(is_numeric($price)) {
				$shopping[$category][$url] = array("name" => $name, "frequency" => $frequency, "price" => $price, "details" => $details, "category" => $category);
				$save = file_put_contents("../source/cfg/shopping.config", json_encode($shopping));
				if($save) {
					echo "done";
				}
				else {
					echo "Could not add shopping item.";
				}
			}
			else {
				echo "The price must be a number and cannot contain special characters.";
			}
		}
		if($action == "edit-shopping-item") {
			$shopping = json_decode(file_get_contents("../source/cfg/shopping.config"), true);
			$url = $_POST['url'];
			$name = $_POST['name'];
			$frequency = $_POST['frequency'];
			$price = $_POST['price'];
			$details = $_POST['details'];
			if(empty(trim($details))) {
				$details = "-";
			}
			$category = $_POST['category'];
			if(is_numeric($price)) {
				$shopping[$category][$url] = array("name" => $name, "frequency" => $frequency, "price" => $price, "details" => $details, "category" => $category);
				$save = file_put_contents("../source/cfg/shopping.config", json_encode($shopping));
				if($save) {
					echo "done";
				}
				else {
					echo "Could not add shopping item.";
				}
			}
			else {
				echo "The price must be a number and cannot contain special characters.";
			}
		}
		
		// Files Page Functions
		
		if($action == "fetch-files") {
			$directory = "../files/uploads/";
			$files = glob($directory . "*");
			$list = array();
			array_multisort(array_map('filemtime', $files), SORT_NUMERIC, SORT_DESC, $files);
			foreach($files as $file) {
				array_push($list, basename($file));
			}
			echo json_encode($list);
		}
		if($action == "download-file") {
			$file = "../files/uploads/" . $queries['file'];
			$mime = mime_content_type($file);
			header('Content-Type: ' . $mime);
			header('Content-Disposition: attachment; filename="' . basename($file) . '"');
			header('Content-Length: '. filesize($file));
			readfile($file);
		}
		if($action == "delete-file") {
			$delete = unlink("../files/uploads/" . $_POST['file']);
			if($delete) {
				echo "done";
			}
		}
		if($action == "rename-file") {
			$directory = "../files/uploads/";
			$file = $directory . $_POST['file'];
			$ext = pathinfo($file, PATHINFO_EXTENSION);
			if(!empty(trim($_POST['name']))) {
				$rename = rename($file, $directory . $_POST['name'] . "." . $ext);
				if($rename) {
					echo "done";
				}
			}
		}
		if($action == "upload-file") {
			$name = $_POST['name'];
			$type = $_FILES['file']["type"];
			$size = $_FILES['file']["size"];
			$temp = $_FILES['file']["tmp_name"];
			$parts = explode(".", $_FILES['file']['name']);
			$extn = strtolower(end($parts));
			if(count($parts) == 1) {
				$extn = "";
			}
			else {
				$extn = "." . $extn;
			}
			
			$upload_directory = "../files/uploads/";
			$upload_file = $upload_directory . $name . $extn;
			if(file_exists($upload_file)) {
				$upload_file = $upload_directory . $name . time() . $extn;
			}
			$upload = move_uploaded_file($temp, $upload_file);
			
			if($upload) {
				echo "done";
			}
			else {
				echo "File could not be uploaded.";
			}
		}
		
		// Reminders Page Functions
		
		if($action == "add-reminder") {
			$reminders = json_decode(file_get_contents("../source/cfg/reminders.config"), true);
			$reminder = $_POST['reminder'];
			$id = time() . "-" . random_int(100000, 999999);
			$reminders[$id] = array("reminder" => $reminder, "status" => "unfinished");
			$add = file_put_contents("../source/cfg/reminders.config", json_encode($reminders));
			if($add) {
				echo "done";
			}
		}
		if($action == "delete-reminder") {
			$reminders = json_decode(file_get_contents("../source/cfg/reminders.config"), true);
			$id = $_POST['id'];
			unset($reminders[$id]);
			$update = file_put_contents("../source/cfg/reminders.config", json_encode($reminders));
			if($update) {
				echo "done";
			}
		}
		if($action == "toggle-reminder") {
			$reminders = json_decode(file_get_contents("../source/cfg/reminders.config"), true);
			$id = $_POST['id'];
			if($reminders[$id]['status'] == "finished") {
				$reminders[$id]['status'] = "unfinished";
			}
			else {
				$reminders[$id]['status'] = "finished";
			}
			$update = file_put_contents("../source/cfg/reminders.config", json_encode($reminders));
			if($update) {
				echo "done";
			}
		}
		if($action == "fetch-reminders") {
			$reminders = json_encode(array_reverse(json_decode(file_get_contents("../source/cfg/reminders.config"), true)));
			echo $reminders;
		}
		
		// Notes Page Functions
		
		if($action == "download-note") {
			$category = $queries['category'];
			if($category == "lecture") {
				$folder = "lectures";
			}
			else {
				$folder = "revision";
			}
			$file = "../files/notes/" . $folder . "/" . $queries['file'];
			$mime = mime_content_type($file);
			header('Content-Type: ' . $mime);
			header('Content-Disposition: attachment; filename="' . basename($file) . '"');
			header('Content-Length: '. filesize($file));
			readfile($file);
		}
		if($action == "delete-note") {
			$category = $_POST['category'];
			if($category == "lecture") {
				$folder = "lectures";
			}
			else {
				$folder = "revision";
			}
			$delete = unlink("../files/notes/" . $folder . "/" . $_POST['file']);
			if($delete) {
				echo "done";
			}
		}
		if($action == "rename-note") {
			$category = $_POST['category'];
			if($category == "lecture") {
				$folder = "lectures";
			}
			else {
				$folder = "revision";
			}
			$directory = "../files/notes/" . $folder . "/";
			$file = $directory . $_POST['file'];
			$ext = pathinfo($file, PATHINFO_EXTENSION);
			if(!empty(trim($_POST['title']))) {
				$rename = rename($file, $directory . $_POST['title'] . "." . $ext);
				if($rename) {
					echo "done";
				}
			}
		}
		if($action == "fetch-notes") {
			$category = $_POST['category'];
			if($category == "lecture") {
				$folder = "lectures";
			}
			else {
				$folder = "revision";
			}
			$directory = "../files/notes/" . $folder . "/";
			$files = glob($directory . "*");
			$notes = array();
			array_multisort(array_map('filemtime', $files), SORT_NUMERIC, SORT_DESC, $files);
			foreach($files as $file) {
				array_push($notes, basename($file));
			}
			echo json_encode($notes);
		}
		if($action == "upload-note") {
			$name = $_POST['title'];
			$type = $_FILES['file']["type"];
			$size = $_FILES['file']["size"];
			$temp = $_FILES['file']["tmp_name"];
			$parts = explode(".", $_FILES['file']['name']);
			$extn = strtolower(end($parts));
			if(in_array($extn, ["docx", "pdf", "pages", "txt", "rtf"])) {
				if(count($parts) == 1) {
					$extn = "";
				}
				else {
					$extn = "." . $extn;
				}
				
				$category = $_POST['category'];
				if($category == "lecture") {
					$folder = "lectures";
				}
				else {
					$folder = "revision";
				}
				
				$upload_directory = "../files/notes/" . $folder . "/";
				$upload_file = $upload_directory . $name . $extn;
				if(file_exists($upload_file)) {
					$upload_file = $upload_directory . $name . time() . $extn;
				}
				$upload = move_uploaded_file($temp, $upload_file);
				
				if($upload) {
					echo "done";
				}
				else {
					echo "File could not be uploaded.";
				}
			}
			else {
				echo "That file format is not supported.";
			}
		}
		
		// Account Page Functions
		
		if($action == "logout") {
			$_SESSION = array();
			$account['token'] = str_shuffle(hash("sha512", str_shuffle(time())));
			$account['time'] = "";
			file_put_contents("../source/cfg/account.config", json_encode($account));
			setcookie("x-university-token", null, -1, "/");
		}
		if($action == "change-username") {
			if(!empty($_POST['username']) && !empty($_POST['password'])) {
				if(password_verify($_POST['password'], $valid_password)) {
					if(ctype_alnum($_POST['username'])) {
						$account['username'] = $_POST['username'];
						$account['token'] = str_shuffle(hash("sha512", str_shuffle(time())));
						$account['time'] = "";
						$change = file_put_contents("../source/cfg/account.config", json_encode($account));
						setcookie("x-university-token", null, -1, "/");
						if($change) {
							echo "done";
						}
						else {
							echo "Could not change username.";
						}
					}
					else {
						echo "Username can only have letters and numbers.";
					}
				}
				else {
					echo "Wrong password.";
				}
			}
			else {
				echo "Please fill out both fields.";
			}
		}
		if($action == "change-password") {
			if(!empty($_POST['current_password']) && !empty($_POST['new_password']) && !empty($_POST['repeat_password'])) {
				if($_POST['new_password'] == $_POST['repeat_password']) {
					if(password_verify($_POST['current_password'], $valid_password)) {
						$hashed = password_hash($_POST['new_password'], PASSWORD_BCRYPT);
						$account['password'] = $hashed;
						$account['token'] = str_shuffle(hash("sha512", str_shuffle(time())));
						$account['time'] = "";
						$change = file_put_contents("../source/cfg/account.config", json_encode($account));
						setcookie("x-university-token", null, -1, "/");
						if($change) {
							echo "done";
						}
						else {
							echo "Could not change username.";
						}
					}
					else {
						echo "Wrong password.";
					}
				}
				else {
					echo "Passwords don't match.";
				}
			}
			else {
				echo "Please fill out all fields.";
			}
		}
		
		// Settings Page Functions
		
		if($action == "fetch-settings") {
			echo file_get_contents("../source/cfg/settings.config");
		}
		if($action == "save-settings") {
			$category = $_POST['category'];
			$option = $_POST['option'];
			$choice = $_POST['choice'];
			if(in_array($category, ['appearance']) && in_array($option, ['theme']) && in_array($choice, ['light', 'dark'])) {
				$settings = json_decode(file_get_contents("../source/cfg/settings.config"), true);
				$settings[$category][$option] = $choice;
				$save = file_put_contents("../source/cfg/settings.config", json_encode($settings));
				if($save) {
					echo "done";
				}
			}
		}
		if($action == "reset-finances") {
			$reset = file_put_contents("../source/cfg/transactions.config", "");
			if($reset) {
				echo "done";
			}
		}
		if($action == "reset-shopping") {
			$reset = file_put_contents("../source/cfg/shopping.config", "");
			if($reset) {
				echo "done";
			}
		}
		if($action == "reset-notes") {
			$revision_notes = glob("../files/notes/revision/*");
			$lecture_notes = glob("../files/notes/lectures/*");
			foreach($revision_notes as $note) {
				unlink($note);
			}
			foreach($lecture_notes as $note) {
				unlink($note);
			}
			if(empty(glob("../files/notes/revision/*")) && empty(glob("../files/notes/lectures/*"))) {
				echo "done";
			}
		}
		if($action == "reset-reminders") {
			$reset = file_put_contents("../source/cfg/reminders.config", "");
			if($reset) {
				echo "done";
			}
		}
		if($action == "reset-files") {
			$files = glob("../files/uploads/*");
			foreach($files as $file) {
				unlink($file);
			}
			if(empty(glob("../files/uploads/*"))) {
				echo "done";
			}
		}
		if($action == "reset-settings") {
			$reset = file_put_contents("../source/cfg/settings.config", '{"appearance":{"theme":"light"}}');
			if($reset) {
				echo "done";
			}
		}
	}
	else {
		if($action == "login") {
			$username = $_POST['username'];
			$password = $_POST['password'];
			if(password_verify($password, $valid_password) && strtolower($username) == strtolower($valid_username)) {
				$_SESSION['Username'] = $valid_username;
				$_SESSION['LoggedIn'] = true;
				if($_POST['remember'] == "enabled") {
					$account['time'] = time();
					file_put_contents("../source/cfg/account.config", json_encode($account));
					setcookie("x-university-token", $account['token'], time() + 2592000, "/");
				}
				else {
					$account['token'] = str_shuffle(hash("sha512", str_shuffle(time())));
					$account['time'] = "";
					file_put_contents("../source/cfg/account.config", json_encode($account));
					setcookie("x-university-token", null, -1, "/");
				}
				echo "valid";
			}
			else {
				echo "Invalid credentials.";
			}
		}
	}
?>