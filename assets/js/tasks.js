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
			}, 200);
		}
	);
}

$(document).ready(function(){
	$.extend($.fn.disableTextSelect = function() {
		return this.each(function() {
			$(this).css('MozUserSelect','none');
			$(this).bind('selectstart',function(){return false;});
			$(this).mousedown(function(){return false;});
		});
	});

	//$('.noSelect').disableTextSelect();

	$('#task-list').sortable({
		axis: 'y',
		revert: 200,
		start: function(event, ui) {
			$(ui.item[0]).addClass('noclick');
		},
		update: function(event, ui) {
			if ($(ui.item[0]).position().top != ui.originalPosition.top) {
				//Need to change the sort order!
				var itemID = $(ui.item[0]).attr('id');
				var theTask = $('li#' + itemID);

				$.post(
					'/tasks/drop',
					{
						taskID: itemID.match(/task-(.*)/)[1],
						date: $(ui.item[0]).parent().attr('id').match(/task-list-(.*)/),
						index: $('#task-list li').index(theTask)
					},
					function(data) {
						console.log(data);
					}
				);
			}
		}
	});

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

	$('#task-list li').on('click', function() {
		if ($(this).hasClass('noclick')) {
			$(this).removeClass('noclick');
		} else {
			var taskID = $(this).attr('id').match(/task-(.*)/)[1];
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
	});
});