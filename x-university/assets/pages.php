<div class="page finances" data-page="finances">
	<div class="transactions-toolbar">
		<input type="text" placeholder="Search..." class="transactions-search">
		<?php echo $filter_icon; ?>
		<?php echo $add_icon; ?>
	</div>
	<div class="filter-menu">
		<button class="filter-menu-item earned">Earned</button>
		<button class="filter-menu-item spent">Spent</button>
		<button class="filter-menu-item newest active">Newest</button>
		<button class="filter-menu-item oldest">Oldest</button>
		<button class="filter-menu-item gbp">GBP</button>
		<button class="filter-menu-item usd">USD</button>
		<button class="filter-menu-item reset">Reset</button>
	</div>
	<div class="transactions-wrapper">
		<div class="transactions-list-head-wrapper">
			<button class="transactions-list-head type"></button>
			<button class="transactions-list-head amount">Amount</button>
			<button class="transactions-list-head date">Date</button>
			<button class="transactions-list-head title">Title</button>
			<button class="transactions-list-head more"></button>
		</div>
		<div class="transactions-list"></div>
	</div>
	<div class="transactions-menu">
		<button class="transactions-menu-item edit">Edit</button>
		<button class="transactions-menu-item delete">Delete</button>
	</div>
	<div class="transaction-add-wrapper">
		<input type="text" placeholder="From..." class="transaction-add-input from">
		<input type="text" placeholder="To..." class="transaction-add-input to">
		<div>
			<button class="transaction-add-button category bank" id="bank">Bank</button>
			<button class="transaction-add-button category cash" id="cash">Cash</button>
		</div>
		<div class="banks">
			<button class="transaction-add-button institution barclays" id="barclays">Barclays</button>
			<button class="transaction-add-button institution hsbc" id="hsbc">HSBC</button>
		</div>
		<div>
			<button class="transaction-add-button currency gbp" id="gbp">GBP</button>
			<button class="transaction-add-button currency usd" id="usd">USD</button>
		</div>
		<div>
			<input type="text" placeholder="Day..." class="transaction-add-input day">
			<input type="text" placeholder="Month..." class="transaction-add-input month">
			<input type="text" placeholder="Year..." class="transaction-add-input year">
		</div>
		<input type="text" placeholder="Title..." class="transaction-add-input title">
		<textarea type="text" placeholder="Details..." class="transaction-add-textarea details"></textarea>
		<input type="text" placeholder="Amount..." class="transaction-add-input amount">
		<div>
			<button class="transaction-add-button type earned" id="earned">Earned</button>
			<button class="transaction-add-button type spent" id="spent">Spent</button>
		</div>
		<button class="transaction-add-confirm">Confirm</button>
	</div>
	<div class="balance-wrapper">
		<div class="balance-button-wrapper">
			<button class="balance-button edit">Edit</button>
			<?php echo $edit_icon; ?>
		</div>
		<div class="balance-category-wrapper cryptocurrency">
			<button class="balance-category">Cryptocurrency</button>
			<?php echo $arrow_icon; ?>
			<div class="balance-item-wrapper">
				<button class="balance-item eth">ETH</button>
				<button class="balance-amount eth"><?php echo $eth_icon; ?> <span>0</span></button>
			</div>
			<div class="balance-item-wrapper">
				<button class="balance-item bch">BCH</button>
				<button class="balance-amount bch"><?php echo $bch_icon; ?> <span>0</span></button>
			</div>
			<div class="balance-item-wrapper">
				<button class="balance-item etn">ETN</button>
				<button class="balance-amount etn"><?php echo $etn_icon; ?> <span>0</span></button>
			</div>
			<div class="balance-item-wrapper">
				<button class="balance-item usd">Total</button>
				<button class="balance-amount usd"><b>$</b> <span>0</span></button>
			</div>
		</div>
		<div class="balance-category-wrapper bank">
			<button class="balance-category">Bank</button>
			<?php echo $arrow_icon; ?>
			<div class="balance-item-wrapper">
				<button class="balance-item hsbc">HSBC</button>
				<button class="balance-amount hsbc"><b>£</b> <span>0</span></button>
			</div>
			<div class="balance-item-wrapper">
				<button class="balance-item barclays">Barclays</button>
				<button class="balance-amount barclays"><b>£</b> <span>0</span></button>
			</div>
			<div class="balance-item-wrapper">
				<button class="balance-item gbp">Total</button>
				<button class="balance-amount gbp"><b>£</b> <span>0</span></button>
			</div>
		</div>
		<button class="balance-item cash">Cash</button>
		<button class="balance-amount cash"><b>£</b> <span>0</span></button>
		<button class="balance-item total">Total</button>
		<button class="balance-amount total"><b>£</b> <span>0</span></button>
	</div>
	<div class="balance-edit-wrapper">
		<button class="balance-edit-label">ETH</button>
		<input type="text" placeholder="Ethereum..." class="balance-edit-input eth">
		<button class="balance-edit-label">BCH</button>
		<input type="text" placeholder="Bitcoin Cash..." class="balance-edit-input bch">
		<button class="balance-edit-label">ETN</button>
		<input type="text" placeholder="Electroneum..." class="balance-edit-input etn">
		<button class="balance-edit-label">HSBC</button>
		<input type="text" placeholder="HSBC..." class="balance-edit-input hsbc">
		<button class="balance-edit-label">Barclays</button>
		<input type="text" placeholder="Barclays..." class="balance-edit-input barclays">
		<button class="balance-edit-label">Cash</button>
		<input type="text" placeholder="Cash..." class="balance-edit-input cash">
		<button class="balance-edit-confirm">Confirm</button>
	</div>
</div>
<div class="page shopping" data-page="shopping">
	<div class="category-wrapper">
		<button class="category-item food" data-category="food">Food</button>
		<button class="category-item drinks" data-category="drinks">Drinks</button>
		<button class="category-item essentials active" data-category="essentials">Essentials</button>
		<button class="category-item other" data-category="other">Other</button>
	</div>
	<div class="shopping-toolbar">
		<input type="text" class="shopping-search" placeholder="Search for an item...">
		<?php echo $add_icon; ?>
	</div>
	<div class="shopping-add-wrapper">
		<input type="text" placeholder="Link..." class="shopping-add-input url">
		<input type="text" placeholder="Name..." class="shopping-add-input name">
		<input type="text" placeholder="Frequency..." class="shopping-add-input frequency">
		<input type="text" placeholder="Price..." class="shopping-add-input price">
		<input type="text" placeholder="Details..." class="shopping-add-input details">
		<button class="shopping-add-button food" id="food">Food</button>
		<button class="shopping-add-button drinks" id="drinks">Drinks</button>
		<button class="shopping-add-button essentials" id="essentials">Essentials</button>
		<button class="shopping-add-button other" id="other">Other</button>
		<button class="shopping-add-confirm">Confirm</button>
	</div>
	<div class="shopping-wrapper">
		<div class="shopping-list-head-wrapper">
			<button class="shopping-list-head name">Name</button>
			<button class="shopping-list-head frequency">Frequency</button>
			<button class="shopping-list-head price">Price</button>
			<button class="shopping-list-head details">Details</button>
		</div>
		<div class="shopping-list food" data-category="food">
			<button class="shopping-list-title">Food</button>
			<div class="list"></div>
		</div>
		<div class="shopping-list drinks" data-category="drinks">
			<button class="shopping-list-title">Drinks</button>
			<div class="list"></div>
		</div>
		<div class="shopping-list essentials active" data-category="essentials">
			<button class="shopping-list-title">Essentials</button>
			<div class="list"></div>
		</div>
		<div class="shopping-list other" data-category="other">
			<button class="shopping-list-title">Other</button>
			<div class="list"></div>
		</div>
	</div>
	<div class="shopping-menu">
		<a target="_blank"><button class="shopping-menu-item buy">Buy</button></a>
		<button class="shopping-menu-item edit">Edit</button>
		<button class="shopping-menu-item delete">Delete</button>
	</div>
</div>
<div class="page documents" data-page="documents">
	<div class="tiles-wrapper">
		<div class="tile" id="notes">
			<div class="tile-icon-wrapper">
				<?php echo $edit_icon; ?>
			</div>
			<button class="tile-title">Notes</button>
		</div>
		<div class="tile" id="reminders">
			<div class="tile-icon-wrapper">
				<?php echo $tasks_icon; ?>
			</div>
			<button class="tile-title">Reminders</button>
		</div>
		<div class="tile" id="files">
			<div class="tile-icon-wrapper">
				<?php echo $cloud_icon; ?>
			</div>
			<button class="tile-title">Files</button>
		</div>
	</div>
</div>
<div class="page notes" data-page="notes">
	<div class="hidden"><?php echo $other_icon; ?></div>
	<div class="notes-sections-wrapper">
		<div class="section lecture-notes">
			<div class="notes-toolbar lecture">
				<button class="notes-toolbar-title">Lectures</button>
				<?php echo $add_icon; ?>
			</div>
			<div class="notes-upload-wrapper lecture">
				<input type="file" class="notes-upload-file lecture hidden">
				<input type="text" placeholder="Title..." class="notes-upload-input">
				<button class="notes-cancel-button">Cancel</button>
				<button class="notes-upload-button lecture">Upload</button>
			</div>
			<div class="notes-list lecture"></div>
		</div>
		<div class="section revision-notes">
			<div class="notes-toolbar revision">
				<button class="notes-toolbar-title">Revision</button>
				<?php echo $add_icon; ?>
			</div>
			<div class="notes-upload-wrapper revision">
				<input type="file" class="notes-upload-file revision hidden">
				<input type="text" placeholder="Title..." class="notes-upload-input">
				<button class="notes-cancel-button">Cancel</button>
				<button class="notes-upload-button revision">Upload</button>
			</div>
			<div class="notes-list revision"></div>
		</div>
	</div>
	<div class="notes-menu">
		<button class="notes-menu-item download">Download</button>
		<button class="notes-menu-item delete">Delete</button>
		<button class="notes-menu-item rename">Rename</button>
	</div>
</div>
<div class="page reminders" data-page="reminders">
	<div class="hidden"><?php echo $trash_icon; ?></div>
	<input type="text" placeholder="Search..." class="reminder-search">
	<div class="reminder-wrapper">
		<div class="reminder-item">
			<?php echo $add_icon; ?>
			<span placeholder="Remind me to..." class="reminder-text input" contenteditable="true"></span>
		</div>
		<div class="reminder-list"></div>
	</div>
</div>
<div class="page files" data-page="files">
	<div class="hidden"><?php echo $file_icon; ?></div>
	<div class="files-toolbar">
		<input type="text" placeholder="Search files..." class="files-search">
		<?php echo $upload_icon; ?>
	</div>
	<div class="files-wrapper">
		<div class="files-list"></div>
	</div>
	<input type="file" class="files-upload-input hidden">
	<div class="files-menu">
		<button class="files-menu-item download">Download</button>
		<button class="files-menu-item delete">Delete</button>
		<button class="files-menu-item rename">Rename</button>
	</div>
</div>
<div class="page settings" data-page="settings">
	<div class="settings-section" data-category="appearance">
		<div>
			<button class="settings-title">Theme</button>
			<button class="settings-choice theme light" data-choice="light">Light</button>
			<button class="settings-choice theme dark" data-choice="dark">Dark</button>
		</div>
	</div>
	<div class="settings-section">
		<div>
			<button class="settings-title">Reset Pages</button>
			<button class="settings-button" data-action="reset-finances">Reset "Finances"</button>
			<button class="settings-button" data-action="reset-shopping">Reset "Shopping"</button>
			<button class="settings-button" data-action="reset-notes">Reset "Notes"</button>
			<button class="settings-button" data-action="reset-reminders">Reset "Reminders"</button>
			<button class="settings-button" data-action="reset-files">Reset "Files"</button>
			<button class="settings-button" data-action="reset-settings">Reset "Settings"</button>
		</div>
	</div>
</div>
<div class="page account" data-page="account">
	<div class="account-username-wrapper">
		<button class="account-title">Change Username</button>
		<input type="password" placeholder="Password..." class="account-input password">
		<input type="text" placeholder="New Username..." class="account-input username">
		<button class="account-button confirm-username">Confirm</button>
	</div>
	<div class="account-password-wrapper">
		<button class="account-title">Change Password</button>
		<input type="password" placeholder="Current Password..." class="account-input current-password">
		<input type="password" placeholder="New Password..." class="account-input new-password">
		<input type="password" placeholder="Repeat Password..." class="account-input repeat-password">
		<button class="account-button confirm-password">Confirm</button>
	</div>
	<button class="account-button logout">Logout <?php echo $valid_username; ?></button>
</div>