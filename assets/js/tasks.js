function clickTask(task) {
	if (task.hasClass('noclick')) {
		task.removeClass('noclick');
	} else {
		var taskID = task.attr('id').match(/task-(.*)/)[1];
		console.log('Clicked task ID = ' + taskID);

		$.post(
			'/tasks/click',
			{
				task: taskID
			},
			function(data) {
				console.log(data);
				//window.location = '/tasks';

				$('#task-list li#task-' + data.taskID).removeClass('progress completed');
				$('#task-list li#task-' + data.taskID).children('a').each(function() {
					$(this).css({'opacity': 0});
				});

				if (data.status == 2) {
					$('#task-list li#task-' + data.taskID).addClass('progress');
					$('#task-list #task-' + data.taskID + '-progress').css({'opacity': 1});
					$('#task-' + data.taskID + '-title').css({'margin-left': '25px'});
					console.log('"Progress" added.');
				} else if (data.status == 3) {
					$('#task-list li#task-' + data.taskID).addClass('completed');
					$('#task-list #task-' + data.taskID + '-completed').css({'opacity': 1});
					$('#task-' + data.taskID + '-title').css({'margin-left': '25px'});
					console.log('"Completed" added.');
				} else {
					$('#task-' + data.taskID + '-title').css({'margin-left': '0px'});
				}
			}
		);
	}
}

function checkSort() {
	var taskAboveID = 0;
	var updates = [];
	var length = $('#task-list').children('li').length;

	for (var i = 0; i < length; i++) {
		var task = $('#task-list').children('li').eq(i);
		var taskID = task.attr('id').match(/task-(.*)/)[1];
		var taskSort = task.data('sort');

		console.log('---------------------');
		console.log('taskAboveID = ' + taskAboveID);
		console.log('taskID = ' + taskID);
		console.log('taskSort = ' + taskSort);

		if (taskSort != taskAboveID) {
			var update = {};
			update.id = taskID;
			update.sortAfterId = taskAboveID;
			updates.push(update);
		}

		taskAboveID = taskID;
	}

	console.log();
	console.log('Updates time!');
	console.log(updates);

	if (updates.length > 0) {
		$.post(
			'/tasks/drop',
			{ updates: updates },
			function(data) {
				console.log('All updated!');
				var length = updates.length;
				for (var i = 0; i < length; i++) {
					$('#task-' + updates[i].id).data('sort', updates[i].sortAfterId).attr('data-sort', updates[i].sortAfterId);
				}
			}
		);
	}
}

function deleteTask(task) {
	$.post(
		'/tasks/delete',
		{
			taskID: task
		},
		function(data) {
			console.log(data);
			$('li#task-' + data.taskID).css({'opacity': 0});
			setTimeout(function() {
				$('li#task-' + data.taskID).remove();
				checkSort();
			}, 200);
		}
	);
}

$(document).ready(function(){
	//Have tasks flinged in
	var i = 0;
	var items = $('#task-list li');
	var length = items.length;

	var interval = setInterval(function() {
		if (i < length) {
			$(items[i]).css({
				'right': 'auto',
				'opacity': '1'
			});

			i++;
		} else {
			clearInterval(interval);
		}
	}, 70);

	//Manage new task submission
	$('#new-task').on('submit', function() {
		console.log('Submission started');
		var name = $('#new-task-name').val();

		if (name != '') {
			console.log('Task name has been specified');
			console.log('Post started');

			$.post(
				'/tasks/create',
				{
					name: name,
					statusId: 1,
					sortAfterId: 0
				},
				function(data) {
					console.log('Task successfully created in back-end.');

					$('#new-task-name').val('');
					console.log('Task name removed from input box.');

					console.log(data);
					$('#task-list').prepend(data);

					var item = $('#task-list').children('li').eq(0);

					item.css({'right': 'auto', 'opacity': 1});
					item.on('click', function() {
						clickTask($(this));
					});

					console.log('Sorting started');
					checkSort();
					console.log('Sorting ended');
				}
			);

			console.log('Post ended');
		} else {
			//TODO: Highlight new task field / present a message that a task name must be entered
		}

		console.log('Submission ended');
		return false;
	});

	//Make list sortable
	$('#task-list').sortable({
		axis: 'y',
		revert: 200,
		start: function(event, ui) {
			$(ui.item[0]).addClass('noclick');
		},
		stop: checkSort
	});

	//If tasks are clicked...
	$('#task-list li').on('click', function() {
		clickTask($(this));
	});
});