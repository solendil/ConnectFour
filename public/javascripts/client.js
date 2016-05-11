
// A simple range iterator
range = function* (begin, end) {
  let interval = 1;
  if (end > begin) {
    for (let i = begin; i < end; i += 1) {
      yield i;
    }
  } else {
    for (let i = begin - 1; i >= end; i -= 1) {
      yield i;
    }
  }
}

// Initializes the board HTML
buildBoardHtml = function(params) {
	console.log("building board ", params)
	for (let j of range(0, params.HEIGHT)) {
	  let tr = $(document.createElement('tr'));
	  for (let i of range(0, params.WIDTH)) {
	    let td = $(document.createElement('td'));
	    td.attr('id', 'id_' + j + '_' + i).attr('_column', i).attr('_row', j);
	    td.appendTo(tr);
	    let content = $(document.createElement('div')).addClass('content').appendTo(td);
	    let token = $(document.createElement('div')).addClass('token').appendTo(content);
	  }
	  tr.appendTo($("#board"));
	}
}

// Renders the JSON board in HTML
renderBoard = function(params) {
	for (let j of range(0, params.HEIGHT)) {
		for (let i of range(0, params.WIDTH)) {
			let selector = '#id_' + j + '_' + i + ' .token';
			$(selector).addClass(params.board[j * params.WIDTH + i]);
		}
	}
	if (params.win && params.win.won) {
		$(".player").html(params.win.color);
		$(".status").removeClass('hidden');
		for (let cell of params.win.cells) {
			$('#id_' + cell.j + '_' + cell.i + ' .content').addClass('win');
		}
		$("#board td").off("click");
	}
}

// Initializes page
$.ajax( "/state" ).done(function(res) {
	buildBoardHtml(res);
	renderBoard(res);

	// "click on the board" callback
	$("#board td").click((evt) => {
		let column = $(evt.target).closest('td').attr('_column');
		$.ajax( "/playat/"+column ).done(function(res) {
			console.log(res);
			renderBoard(res);
		});
	});

});
